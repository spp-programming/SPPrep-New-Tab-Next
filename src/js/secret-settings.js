"use strict"
import { secretSettingsContent, secretSettingsCustomBackgroundAlertWrapper, secretSettingsCustomBackgroundSection, secretSettingsCustomBackgroundUploader, secretSettingsDisabledContent, secretSettingsDisableSwitch, secretSettingsGradientDisableSwitch, secretSettingsSaveButton, secretSettingsVideoBackgroundPreview, secretSettingsWhenEnabled } from "./modules/secret-settings-constants.js"
import { handleFakeLinks } from "./modules/fake-links.js"
import { runMigrations } from "./modules/migrations.js"
import { getSeasonalBackground } from "./modules/seasonal-backgrounds.js"
import { secretSettingsFontSelection, secretSettingsFontPreview, secretSettingsStaticBackgroundPreview, secretSettingsBackgroundSelection, secretSettingsBackgroundPreviewNotes, secretSettingsGradientSelection, secretSettingsGradientSelectionReset} from "./modules/secret-settings-constants.js"
import { backgroundBliss, backgroundMscBuilding, backgroundOsxLeopard, backgroundOsxLion, backgroundOsxTiger, backgroundOsxYosemite, backgroundRainbow, backgroundSnow, backgroundStaffStaring, backgroundStreetView, backgroundStreetViewBetter, selectImageImage, validBackgrounds, validFonts } from "./modules/global-constants.js"

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerElement => new bootstrap.Tooltip(tooltipTriggerElement))

let changesWereMade = false
let aboutToReload = false

let storedCustomBackground
let uploadedCustomBackground

secretSettingsDisableSwitch.addEventListener("change", () => {
    handleBeforeUnload()
    secretSettingsWhenEnabled.hidden = false
    if (secretSettingsDisableSwitch.checked) {
        secretSettingsWhenEnabled.hidden = true
    }
})

secretSettingsGradientSelection.addEventListener("change", () => {
    handleBeforeUnload()
})

secretSettingsGradientSelectionReset.addEventListener("click", () => {
    handleBeforeUnload()
    secretSettingsGradientSelection.value = "#9b042a"
})

secretSettingsGradientDisableSwitch.addEventListener("change", () => {
    handleBeforeUnload()
    handleGradientColorDisablement()
})

secretSettingsBackgroundSelection.addEventListener("change", () => {
    secretSettingsStaticBackgroundPreview.hidden = false
    secretSettingsBackgroundPreviewNotes.hidden = false
    handleBeforeUnload()
    updateBackgroundPreview()
})

secretSettingsFontSelection.addEventListener("change", () => {
    handleBeforeUnload()
    updateFontPreview()
})

secretSettingsSaveButton.addEventListener("click", () => {
    saveSecretSettings()
})

async function handleSecretSettingsVisibility() {
    try {
        const secretSettingsVisible = (await chrome.storage.local.get())["secretSettingsVisible"]

        if (secretSettingsVisible === true) {
            secretSettingsContent.hidden = false
        } else {
            secretSettingsDisabledContent.hidden = false
        }
    } catch (error) {
        console.error(error)
        alert(`Oops, something went wrong while checking secret settings visibility. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}`)
    }
}

secretSettingsCustomBackgroundUploader.addEventListener("change", handleCustomBackgroundUploaderChange)

async function handleCustomBackgroundUploaderChange() {
    handleBeforeUnload()
    secretSettingsBackgroundSelection.disabled = true
    secretSettingsCustomBackgroundUploader.disabled = true
    secretSettingsSaveButton.disabled = true
    let backgroundURL
    if (validateCustomBackgroundFileList() === true) {
        backgroundURL = await constructCustomBackgroundURL()
        uploadedCustomBackground = backgroundURL
        updateBackgroundPreview()
    } else {
        secretSettingsCustomBackgroundUploader.value = ""
        secretSettingsVideoBackgroundPreview.innerHTML = ""
        secretSettingsVideoBackgroundPreview.parentElement.hidden = true
        secretSettingsStaticBackgroundPreview.setAttribute("src", selectImageImage)
        secretSettingsStaticBackgroundPreview.parentElement.hidden = false
        uploadedCustomBackground = undefined
    }
    secretSettingsBackgroundSelection.disabled = false
    secretSettingsCustomBackgroundUploader.disabled = false
    secretSettingsSaveButton.disabled = false
}

function validateCustomBackgroundFileList() {
    secretSettingsCustomBackgroundAlertWrapper.innerHTML = ""
    if (secretSettingsCustomBackgroundUploader.files.length === 0) {
        console.log("Custom background validator: No files selected.")
        return false
    }
    if (secretSettingsCustomBackgroundUploader.files[0].type.startsWith("image/") === false && secretSettingsCustomBackgroundUploader.files[0].type.startsWith("video/") === false) {
        console.error(`Custom background validator: File "${secretSettingsCustomBackgroundUploader.files[0].name}" is not an image! (Unexpected MIME type of "${secretSettingsCustomBackgroundUploader.files[0].type}")`)
        secretSettingsCustomBackgroundAlertWrapper.innerHTML = `<div class="alert alert-danger alert-dismissible fade show mt-3" role="alert"><div><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> <span>File is not an image or video! Your background needs to be in a format supported by your browser.</span></div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
        return false
    }
    if (secretSettingsCustomBackgroundUploader.files[0].size > 5000000) {
        console.error(`Custom background validator: File "${secretSettingsCustomBackgroundUploader.files[0].name}" is larger than 5000000 bytes!`)
        secretSettingsCustomBackgroundAlertWrapper.innerHTML = `<div class="alert alert-danger alert-dismissible fade show mt-3" role="alert"><div><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> <span>File is larger than 5 megabytes! Reduce the file size of your image before trying again.</span></div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
        return false
    }
    return true
}

async function constructCustomBackgroundURL() {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.addEventListener("load", () => {
            resolve(fileReader.result)
        })
        fileReader.addEventListener("error", () => {
            reject()
        })
        fileReader.readAsDataURL(secretSettingsCustomBackgroundUploader.files[0])
    })
}

async function loadSecretSettings() {
    try {
        const storedBackgroundSelection = (await chrome.storage.local.get())["secretSettings_backgroundSelection"]
        storedCustomBackground = (await chrome.storage.local.get())["secretSettings_customBackground"]
        const storedFontSelection = (await chrome.storage.local.get())["secretSettings_fontSelection"]
        const storedGradientSelection = (await chrome.storage.local.get())["secretSettings_gradientSelection"]
        const storedGradientDisabled = (await chrome.storage.local.get())["secretSettings_gradientDisabled"]
        if (validBackgrounds.includes(storedBackgroundSelection)) {
            secretSettingsBackgroundSelection.value = storedBackgroundSelection
        }
        if (storedBackgroundSelection === "custom") {
            secretSettingsCustomBackgroundSection.hidden = false
        }
        if (validFonts.includes(storedFontSelection)) {
            secretSettingsFontSelection.value = storedFontSelection
        }
        if (/^#[0-9A-F]{6}$/i.test(storedGradientSelection)) {
            secretSettingsGradientSelection.value = storedGradientSelection
        }
        if (storedGradientDisabled === true) {
            secretSettingsGradientDisableSwitch.checked = true
        }
        handleGradientColorDisablement()
    } catch (error) {
        console.error(error)
        alert(`Oops, something went wrong while loading secret settings. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}`)
    }
}

async function saveSecretSettings() {
    try {
        // element.src gets the absolute URL, but we need the relative URL so element.getAttribute("src") is used instead
        if (secretSettingsStaticBackgroundPreview.getAttribute("src") === selectImageImage && secretSettingsVideoBackgroundPreview.children.length === 0) {
            secretSettingsCustomBackgroundAlertWrapper.innerHTML = `<div class="alert alert-danger alert-dismissible fade show mt-3" role="alert"><div><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> <span>Please upload a custom background before saving. If you don't want to save your changes, you can close this tab.</span></div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
            secretSettingsCustomBackgroundAlertWrapper.scrollIntoView({ behavior: "smooth" })
            return
        }
        secretSettingsDisableSwitch.disabled = true
        secretSettingsFontSelection.disabled = true
        secretSettingsBackgroundSelection.disabled = true
        secretSettingsCustomBackgroundUploader.disabled = true
        secretSettingsGradientSelection.disabled = true
        secretSettingsGradientDisableSwitch.disabled = true
        secretSettingsSaveButton.disabled = true
        secretSettingsSaveButton.innerHTML = "<span class=\"spinner-border spinner-border-sm\" aria-hidden=\"true\"></span> <span role=\"status\">Saving...</span>"
        if (secretSettingsDisableSwitch.checked) {
            await chrome.storage.local.remove(["secretSettings_customBackground"])
            await chrome.storage.local.remove(["secretSettings_backgroundSelection"])
            await chrome.storage.local.remove(["secretSettings_fontSelection"])
            await chrome.storage.local.remove(["secretSettings_gradientSelection"])
            await chrome.storage.local.remove(["secretSettings_gradientDisabled"])
            await chrome.storage.local.remove(["secretSettingsVisible"])
        } else {
            if (uploadedCustomBackground === undefined && storedCustomBackground === undefined) {
                await chrome.storage.local.remove(["secretSettings_customBackground"])
            } else {
                await chrome.storage.local.set({ secretSettings_customBackground: uploadedCustomBackground })
            }
            if (secretSettingsBackgroundSelection.value !== "custom") {
                await chrome.storage.local.remove(["secretSettings_customBackground"])
            }
            await chrome.storage.local.set({ secretSettings_backgroundSelection: secretSettingsBackgroundSelection.value })
            await chrome.storage.local.set({ secretSettings_fontSelection: secretSettingsFontSelection.value })
            await chrome.storage.local.set({ secretSettings_gradientSelection: secretSettingsGradientSelection.value })
            await chrome.storage.local.set({ secretSettings_gradientDisabled: secretSettingsGradientDisableSwitch.checked })
        }
        aboutToReload = true
        chrome.runtime.reload()
    } catch (error) {
        console.error(error)
        alert(`Oops, something went wrong while saving secret settings. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}`)
    }
}

function updateBackgroundPreview() {
    secretSettingsStaticBackgroundPreview.parentElement.hidden = false
    secretSettingsVideoBackgroundPreview.innerHTML = ""
    secretSettingsVideoBackgroundPreview.parentElement.hidden = true
    secretSettingsCustomBackgroundSection.hidden = true
    switch (secretSettingsBackgroundSelection.value) {
        case "custom":
            secretSettingsCustomBackgroundSection.hidden = false
            secretSettingsStaticBackgroundPreview.setAttribute("src", selectImageImage)
            if (typeof storedCustomBackground !== "string" | "undefined") {
                console.error(`Stored custom background is an invalid type (got "${typeof storedCustomBackground}", expected "string" or "undefined")`)
                if (uploadedCustomBackground === undefined) {
                    return
                }
            }
            if (uploadedCustomBackground === undefined && storedCustomBackground.startsWith("data:image/") === true) {
                secretSettingsStaticBackgroundPreview.setAttribute("src", storedCustomBackground)
            }
            if (uploadedCustomBackground === undefined && storedCustomBackground.startsWith("data:video/") === true) {
                secretSettingsStaticBackgroundPreview.parentElement.hidden = true
                secretSettingsVideoBackgroundPreview.innerHTML = ""
                secretSettingsVideoBackgroundPreview.parentElement.hidden = false
                const source = document.createElement("source")
                source.src = storedCustomBackground
                secretSettingsVideoBackgroundPreview.appendChild(source)
            }
            if (uploadedCustomBackground !== undefined) {
                if (uploadedCustomBackground.startsWith("data:image/") === true) {
                    secretSettingsStaticBackgroundPreview.setAttribute("src", uploadedCustomBackground)
                    return
                }
                if (uploadedCustomBackground.startsWith("data:video/") === true) {
                    secretSettingsStaticBackgroundPreview.parentElement.hidden = true
                    secretSettingsStaticBackgroundPreview.setAttribute("src", selectImageImage)
                    secretSettingsVideoBackgroundPreview.innerHTML = ""
                    secretSettingsVideoBackgroundPreview.parentElement.hidden = false
                    const source = document.createElement("source")
                    source.src = uploadedCustomBackground
                    secretSettingsVideoBackgroundPreview.appendChild(source)
                    return
                }
                console.error("Unable to load custom background, probably because of an invalid MIME type.")
            }
            secretSettingsBackgroundPreviewNotes.innerHTML = "Harrison Green asked for this. Go thank him for that :)"
            break
        case "seasonal":
            secretSettingsStaticBackgroundPreview.setAttribute("src", getSeasonalBackground((new Date()).getMonth(), (new Date()).getDate()))
            secretSettingsBackgroundPreviewNotes.innerHTML = "This background will change automatically based on the seasons. There are only two images we can use, so a given image is actually used for two seasons."
            break
        case "bliss":
            secretSettingsStaticBackgroundPreview.setAttribute("src", backgroundBliss)
            secretSettingsBackgroundPreviewNotes.innerHTML = "I added this in because nostalgia."
            break
        case "osx-tiger":
            secretSettingsStaticBackgroundPreview.setAttribute("src", backgroundOsxTiger)
            secretSettingsBackgroundPreviewNotes.innerHTML = "I added the OS X Leopard one, so there was no reason not to include this one too.<br>Image attribution: &copy; 2024 Apple<br>Source: <a href=\"https://512pixels.net/projects/default-mac-wallpapers-in-5k/\" target=\"_blank\">512pixels.net</a>"
            break
        case "osx-leopard":
            secretSettingsStaticBackgroundPreview.setAttribute("src", backgroundOsxLeopard)
            secretSettingsBackgroundPreviewNotes.innerHTML = "One of the people in the Programming Club Discord server suggested this one.<br>Image attribution: &copy; 2024 Apple<br>Source: <a href=\"https://512pixels.net/projects/default-mac-wallpapers-in-5k/\" target=\"_blank\">512pixels.net</a>"
            break
        case "osx-lion":
            secretSettingsStaticBackgroundPreview.setAttribute("src", backgroundOsxLion)
            secretSettingsBackgroundPreviewNotes.innerHTML = "I think the same guy who suggested the OS X Leopard one would like this one too.<br>Image attribution: &copy; 2024 Apple<br>Source: <a href=\"https://512pixels.net/projects/default-mac-wallpapers-in-5k/\" target=\"_blank\">512pixels.net</a>"
            break
        case "osx-yosemite":
            secretSettingsStaticBackgroundPreview.setAttribute("src", backgroundOsxYosemite)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This one is the most different from the rest of the OS X wallpapers. It's also actually the largest wallpaper (by file size) in here!<br>Image attribution: &copy; 2024 Apple<br>Source: <a href=\"https://512pixels.net/projects/default-mac-wallpapers-in-5k/\" target=\"_blank\">512pixels.net</a>"
            break
        case "msc-building":
            secretSettingsStaticBackgroundPreview.setAttribute("src", backgroundMscBuilding)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This background was brought over from the older version of the extension. There is no higher quality version because I couldn't get AI upscaling to get usable results."
            break
        case "snow":
            secretSettingsStaticBackgroundPreview.setAttribute("src", backgroundSnow)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This background was introduced in version 3.0. It's also AI upscaled, but you can also use the original, low quality version instead if you want."
            break
        case "snow-low-quality":
            secretSettingsStaticBackgroundPreview.setAttribute("src", backgroundSnow)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This background was introduced in version 3.0. This version of the image was shared on the Programming Club Discord server and is included as-is."
            break
        case "original-fall-winter":
            secretSettingsStaticBackgroundPreview.setAttribute("src", backgroundStaffStaring)
            secretSettingsBackgroundPreviewNotes.innerHTML = "Although this background was in the older version of the extension, you never actually saw it because the seasonal background feature wasn't functional at the time."
            break
        case "street-view":
            secretSettingsStaticBackgroundPreview.setAttribute("src", backgroundStreetView)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This is a Google Street View screenshot, dating back to 2012. This version of the background was shared on the Programming Club Discord server and is included as-is.<br>Image attribution: &copy; 2024 Google"
            break
        case "street-view-better":
            secretSettingsStaticBackgroundPreview.setAttribute("src", backgroundStreetViewBetter)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This is a Google Street View screenshot, dating back to 2012. This background has a greater field of view and resolution, compared to the other version.<br>Image attribution: &copy; 2024 Google"
            break
        case "rainbow":
            secretSettingsStaticBackgroundPreview.setAttribute("src", backgroundRainbow)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This background is an SVG. I could've just used CSS to make an animation like this, but the SVG works anywhere images do, which makes this the lazy option."
            break
        default:
            secretSettingsStaticBackgroundPreview.hidden = true
            secretSettingsBackgroundPreviewNotes.hidden = true
    }
}

function updateFontPreview() {
    secretSettingsFontPreview.classList.remove.apply(secretSettingsFontPreview.classList, Array.from(secretSettingsFontPreview.classList).filter(v=>v.startsWith("font-"))) // Stolen from https://stackoverflow.com/a/53002208
    switch (secretSettingsFontSelection.value) {
        case "azeret-mono":
            secretSettingsFontPreview.classList.add("font-azeret-mono")
            break
        case "sans-serif":
            secretSettingsFontPreview.classList.add("font-sans-serif")
            break
        case "inter":
            secretSettingsFontPreview.classList.add("font-inter")
        break
        case "lato":
            secretSettingsFontPreview.classList.add("font-lato")
            break
        case "montserrat":
            secretSettingsFontPreview.classList.add("font-montserrat")
            break
        case "nunito":
            secretSettingsFontPreview.classList.add("font-nunito")
            break
        case "poppins":
            secretSettingsFontPreview.classList.add("font-poppins")
            break
        case "raleway":
            secretSettingsFontPreview.classList.add("font-raleway")
            break
        case "rubik":
            secretSettingsFontPreview.classList.add("font-rubik")
            break
        default:
            secretSettingsFontPreview.classList.add("font-azeret-mono")
    }
}

function handleBeforeUnload() {
    if (changesWereMade === false) {
        changesWereMade = true
        window.addEventListener("beforeunload", (event) => {
            if (aboutToReload === true) {
                return
            }
            event.preventDefault()
        })
    }
}

function handleGradientColorDisablement() {
    if (secretSettingsGradientDisableSwitch.checked === true) {
        secretSettingsGradientSelection.disabled = true
        secretSettingsGradientSelection.style.cursor = "not-allowed"
        secretSettingsGradientSelectionReset.disabled = true
        secretSettingsGradientSelectionReset.style.cursor = "not-allowed"
    } else {
        secretSettingsGradientSelection.disabled = false
        secretSettingsGradientSelection.style.removeProperty("cursor")
        secretSettingsGradientSelectionReset.disabled = false
        secretSettingsGradientSelectionReset.style.removeProperty("cursor")
    }
}

async function loadStuff() {
    await runMigrations()
    handleFakeLinks()
    await loadSecretSettings()
    handleSecretSettingsVisibility()
    updateFontPreview()
    updateBackgroundPreview()
    secretSettingsStaticBackgroundPreview.hidden = false
    secretSettingsBackgroundPreviewNotes.hidden = false
}
loadStuff()
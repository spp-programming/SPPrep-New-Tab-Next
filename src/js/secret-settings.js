"use strict"
import { secretSettingsContent, secretSettingsCustomBackgroundAlertWrapper, secretSettingsCustomBackgroundSection, secretSettingsCustomBackgroundUploader, secretSettingsDisabledContent, secretSettingsDisableSwitch, secretSettingsSaveButton, secretSettingsWhenEnabled } from "./modules/secret-settings-constants.js"
import { handleFakeLinks } from "./modules/fake-links.js"
import { runMigrations } from "./modules/migrations.js"
import { getSeasonalBackground } from "./modules/seasonal-backgrounds.js"
import { secretSettingsFontSelection, secretSettingsFontPreview, secretSettingsBackgroundPreview, secretSettingsBackgroundSelection, secretSettingsBackgroundPreviewNotes, secretSettingsGradientSelection, secretSettingsGradientSelectionReset} from "./modules/secret-settings-constants.js"
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

secretSettingsBackgroundSelection.addEventListener("change", () => {
    secretSettingsBackgroundPreview.hidden = false
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
    const secretSettingsVisible = (await chrome.storage.local.get())["secretSettingsVisible"]

    if (secretSettingsVisible === true) {
        secretSettingsContent.hidden = false
    } else {
        secretSettingsDisabledContent.hidden = false
    }
}

secretSettingsCustomBackgroundUploader.addEventListener("change", handleCustomBackgroundUploaderChange)

async function handleCustomBackgroundUploaderChange() {
    handleBeforeUnload()
    secretSettingsBackgroundSelection.disabled = true
    secretSettingsCustomBackgroundUploader.disabled = true
    secretSettingsSaveButton.disabled = true
    let backgroundURL
    if (!validateCustomBackgroundFileList()) {
        secretSettingsCustomBackgroundUploader.value = ""
        secretSettingsBackgroundPreview.setAttribute("src", selectImageImage)
        uploadedCustomBackground = undefined
    } else {
        backgroundURL = await constructCustomBackgroundURL()
        secretSettingsBackgroundPreview.setAttribute("src", backgroundURL)
        uploadedCustomBackground = backgroundURL
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
    if (secretSettingsCustomBackgroundUploader.files[0].size > 5000000) {
        console.error(`Custom background validator: File "${secretSettingsCustomBackgroundUploader.files[0].name}" is larger than 5000000 bytes!`)
        secretSettingsCustomBackgroundAlertWrapper.innerHTML = `<div class="alert alert-danger alert-dismissible" role="alert"><div><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> <span>File is larger than 5 megabytes! Reduce the file size of your image before trying again.</span></div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
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
    const storedBackgroundSelection = (await chrome.storage.local.get())["secretSettings_backgroundSelection"]
    storedCustomBackground = (await chrome.storage.local.get())["secretSettings_customBackground"]
    const storedFontSelection = (await chrome.storage.local.get())["secretSettings_fontSelection"]
    const storedGradientSelection = (await chrome.storage.local.get())["secretSettings_gradientSelection"]
    if (validBackgrounds.includes(storedBackgroundSelection)) {
        secretSettingsBackgroundSelection.value = storedBackgroundSelection
    }
    if (storedBackgroundSelection === "custom") {
        if (storedCustomBackground !== undefined) {
            secretSettingsBackgroundPreview.setAttribute("src", storedCustomBackground)
        }
        secretSettingsCustomBackgroundSection.hidden = false
    }
    if (validFonts.includes(storedFontSelection)) {
        secretSettingsFontSelection.value = storedFontSelection
    }
    if (/^#[0-9A-F]{6}$/i.test(storedGradientSelection)) {
        secretSettingsGradientSelection.value = storedGradientSelection
    }
}

async function saveSecretSettings() {
    secretSettingsDisableSwitch.disabled = true
    secretSettingsFontSelection.disabled = true
    secretSettingsBackgroundSelection.disabled = true
    secretSettingsCustomBackgroundUploader.disabled = true
    secretSettingsGradientSelection.disabled = true
    secretSettingsSaveButton.disabled = true
    secretSettingsSaveButton.innerHTML = "<span class=\"spinner-border spinner-border-sm\" aria-hidden=\"true\"></span> <span role=\"status\">Saving...</span>"
    if (secretSettingsDisableSwitch.checked) {
        await chrome.storage.local.remove(["secretSettings_customBackground"])
        await chrome.storage.local.remove(["secretSettings_backgroundSelection"])
        await chrome.storage.local.remove(["secretSettings_fontSelection"])
        await chrome.storage.local.remove(["secretSettings_gradientSelection"])
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
    }
    aboutToReload = true
    chrome.runtime.reload()
}

function updateBackgroundPreview() {
    secretSettingsCustomBackgroundSection.hidden = true
    switch (secretSettingsBackgroundSelection.value) {
        case "custom":
            secretSettingsCustomBackgroundSection.hidden = false
            secretSettingsBackgroundPreview.setAttribute("src", selectImageImage)
            if (storedCustomBackground !== undefined) {
                secretSettingsBackgroundPreview.setAttribute("src", storedCustomBackground)
            }
            if (uploadedCustomBackground !== undefined) {
                secretSettingsBackgroundPreview.setAttribute("src", uploadedCustomBackground)
            }
            secretSettingsBackgroundPreviewNotes.innerHTML = "Harrison Green asked for this. Go thank him for that :)"
            break
        case "seasonal":
            secretSettingsBackgroundPreview.setAttribute("src", getSeasonalBackground((new Date()).getMonth(), (new Date()).getDate()))
            secretSettingsBackgroundPreviewNotes.innerHTML = "This background will change automatically based on the seasons. There are only two images we can use, so a given image is actually used for two seasons."
            break
        case "bliss":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundBliss)
            secretSettingsBackgroundPreviewNotes.innerHTML = "I added this in because nostalgia."
            break
        case "osx-tiger":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundOsxTiger)
            secretSettingsBackgroundPreviewNotes.innerHTML = "I added the OS X Leopard one, so there was no reason not to include this one too.<br>Image attribution: &copy; 2024 Apple<br>Source: <a href=\"https://512pixels.net/projects/default-mac-wallpapers-in-5k/\" target=\"_blank\">512pixels.net</a>"
            break
        case "osx-leopard":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundOsxLeopard)
            secretSettingsBackgroundPreviewNotes.innerHTML = "One of the people in the Programming Club Discord server suggested this one.<br>Image attribution: &copy; 2024 Apple<br>Source: <a href=\"https://512pixels.net/projects/default-mac-wallpapers-in-5k/\" target=\"_blank\">512pixels.net</a>"
            break
        case "osx-lion":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundOsxLion)
            secretSettingsBackgroundPreviewNotes.innerHTML = "I think the same guy who suggested the OS X Leopard one would like this one too.<br>Image attribution: &copy; 2024 Apple<br>Source: <a href=\"https://512pixels.net/projects/default-mac-wallpapers-in-5k/\" target=\"_blank\">512pixels.net</a>"
            break
        case "osx-yosemite":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundOsxYosemite)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This one is the most different from the rest of the OS X wallpapers. It's also actually the largest wallpaper (by file size) in here!<br>Image attribution: &copy; 2024 Apple<br>Source: <a href=\"https://512pixels.net/projects/default-mac-wallpapers-in-5k/\" target=\"_blank\">512pixels.net</a>"
            break
        case "msc-building":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundMscBuilding)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This background was brought over from the older version of the extension. There is no higher quality version because I couldn't get AI upscaling to get usable results."
            break
        case "snow":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundSnow)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This background was introduced in version 3.0. It's also AI upscaled, but you can also use the original, low quality version instead if you want."
            break
        case "snow-low-quality":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundSnow)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This background was introduced in version 3.0. This version of the image was shared on the Programming Club Discord server and is included as-is."
            break
        case "original-fall-winter":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundStaffStaring)
            secretSettingsBackgroundPreviewNotes.innerHTML = "Although this background was in the older version of the extension, you never actually saw it because the seasonal background feature wasn't functional at the time."
            break
        case "street-view":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundStreetView)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This is a Google Street View screenshot, dating back to 2012. This version of the background was shared on the Programming Club Discord server and is included as-is.<br>Image attribution: &copy; 2024 Google"
            break
        case "street-view-better":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundStreetViewBetter)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This is a Google Street View screenshot, dating back to 2012. This background has a greater field of view and resolution, compared to the other version.<br>Image attribution: &copy; 2024 Google"
            break
        case "rainbow":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundRainbow)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This background is an SVG. I could've just used CSS to make an animation like this, but the SVG works anywhere images do, which makes this the lazy option."
            break
        default:
            secretSettingsBackgroundPreview.hidden = true
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

async function loadStuff() {
    await runMigrations()
    handleFakeLinks()
    await loadSecretSettings()
    handleSecretSettingsVisibility()
    updateFontPreview()
    updateBackgroundPreview()
    secretSettingsBackgroundPreview.hidden = false
    secretSettingsBackgroundPreviewNotes.hidden = false
}
loadStuff()
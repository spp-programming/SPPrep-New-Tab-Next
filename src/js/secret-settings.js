"use strict"
import { secretSettingsContent, secretSettingsCustomBackgroundAlertWrapper, secretSettingsCustomBackgroundSection, secretSettingsCustomBackgroundUploader, secretSettingsDisabledContent, secretSettingsDisableSwitch, secretSettingsGradientDisableSwitch, secretSettingsLoadCloudButton, secretSettingsLoadingOverlayContent, secretSettingsSaveButton, secretSettingsSaveCloudAlertWrapper, secretSettingsSaveCloudButton, secretSettingsUnsavedChangesIndicator, secretSettingsVideoBackgroundPreview, secretSettingsWhenEnabled } from "./modules/secret-settings-constants.js"
import { handleFakeLinks } from "./modules/fake-links.js"
import { runCloudMigrations, runMigrations } from "./modules/migrations.js"
import { getSeasonalBackground } from "./modules/seasonal-backgrounds.js"
import { secretSettingsFontSelection, secretSettingsFontPreview, secretSettingsStaticBackgroundPreview, secretSettingsBackgroundSelection, secretSettingsBackgroundPreviewNotes, secretSettingsGradientSelection, secretSettingsGradientSelectionReset} from "./modules/secret-settings-constants.js"
import { backgroundList, selectImageImage, validFonts } from "./modules/global-constants.js"
import { getCustomBackgroundData, getCustomBackgroundDataFromURL } from "./modules/background-fetcher.js"
import * as bootstrap from "./thirdparty/bootstrap.bundle.min.js"

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

secretSettingsBackgroundSelection.addEventListener("change", async () => {
    secretSettingsStaticBackgroundPreview.hidden = false
    secretSettingsBackgroundPreviewNotes.hidden = false
    handleBeforeUnload()
    await updateBackgroundPreview()
})

secretSettingsFontSelection.addEventListener("change", () => {
    handleBeforeUnload()
    updateFontPreview()
})

secretSettingsSaveCloudButton.addEventListener("click", () => {
    if (confirm("If you continue, your settings in the cloud will be overwritten with the ones set on this page.") === false) {
        return
    }
    saveCloudSecretSettings()
})

secretSettingsLoadCloudButton.addEventListener("click", () => {
    if (confirm("WARNING WARNING WARNING\nIf you continue, local settings will be OVERWRITTEN with the ones stored in the cloud.") === false) {
        return
    }
    const targetUrl = new URL(location.href)
    targetUrl.searchParams.set("loadCloudSettings", "true")
    aboutToReload = true
    location.href = targetUrl
})

secretSettingsSaveButton.addEventListener("click", () => {
    saveSecretSettings()
})

async function handleSecretSettingsVisibility() {
    try {
        const secretSettingsVisible = (await chrome.storage.local.get())["secretSettingsVisible"]
        secretSettingsLoadingOverlayContent.hidden = true
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
        secretSettingsCustomBackgroundAlertWrapper.innerHTML = '<div class="alert theme-info mt-3" role="alert"><div><div class="spinner-border spinner-border-sm" role="status"></div> <span>Loading the file (this may take a few seconds)</span></div></div>'
        backgroundURL = await constructCustomBackgroundURL()
        uploadedCustomBackground = backgroundURL
        await updateBackgroundPreview()
        secretSettingsCustomBackgroundAlertWrapper.innerHTML = ""
    } else {
        secretSettingsCustomBackgroundUploader.value = ""
        secretSettingsVideoBackgroundPreview.innerHTML = ""
        secretSettingsVideoBackgroundPreview.parentElement.hidden = true
        secretSettingsVideoBackgroundPreview.load()
        secretSettingsStaticBackgroundPreview.setAttribute("src", selectImageImage)
        secretSettingsStaticBackgroundPreview.parentElement.hidden = false
        uploadedCustomBackground = undefined
    }
    secretSettingsBackgroundSelection.disabled = false
    secretSettingsCustomBackgroundUploader.disabled = false
    secretSettingsSaveButton.disabled = false
    // All of this ResizeObserver stuff is needed because the images loading in would screw up scrollIntoView's initial calculations and push the target element offscreen
    secretSettingsStaticBackgroundPreview.parentElement.parentElement.scrollIntoView({ behavior: "smooth" })
    const observer = new ResizeObserver(() => {
        secretSettingsStaticBackgroundPreview.parentElement.parentElement.scrollIntoView({ behavior: "smooth" })
        observer.disconnect()
    })
    observer.observe(document.body)
}

function validateCustomBackgroundFileList() {
    secretSettingsCustomBackgroundAlertWrapper.innerHTML = ""
    if (secretSettingsCustomBackgroundUploader.files.length === 0) {
        console.log("Custom background validator: No files selected.")
        return false
    }
    if (secretSettingsCustomBackgroundUploader.files[0].type.startsWith("image/") === false && secretSettingsCustomBackgroundUploader.files[0].type.startsWith("video/") === false) {
        console.error(`Custom background validator: File "${secretSettingsCustomBackgroundUploader.files[0].name}" is not an image! (Unexpected MIME type of "${secretSettingsCustomBackgroundUploader.files[0].type}")`)
        secretSettingsCustomBackgroundAlertWrapper.innerHTML = `<div class="alert theme-danger mt-3" role="alert"><div><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> <span>File is not an image or video! Your background needs to be in a format supported by your browser.</span></div><button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button></div>`
        return false
    }
    if (secretSettingsCustomBackgroundUploader.files[0].size > 5000000) {
        console.error(`Custom background validator: File "${secretSettingsCustomBackgroundUploader.files[0].name}" is larger than 5000000 bytes!`)
        secretSettingsCustomBackgroundAlertWrapper.innerHTML = `<div class="alert theme-danger mt-3" role="alert"><div><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> <span>File is larger than 5 megabytes! Reduce the file size of your image before trying again.</span></div><button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button></div>`
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

async function loadCloudSecretSettings() {
    try {
        const storedBackgroundSelection = (await chrome.storage.sync.get())["secretSettings_backgroundSelection"]
        const storedFontSelection = (await chrome.storage.sync.get())["secretSettings_fontSelection"]
        const storedGradientSelection = (await chrome.storage.sync.get())["secretSettings_gradientSelection"]
        const storedGradientDisabled = (await chrome.storage.sync.get())["secretSettings_gradientDisabled"]
        if (Object.values(backgroundList).map(background => background.name).includes(storedBackgroundSelection) === true && storedBackgroundSelection !== "custom") {
            secretSettingsBackgroundSelection.value = storedBackgroundSelection
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
        handleBeforeUnload()
        secretSettingsSaveCloudAlertWrapper.innerHTML = `<div class="alert theme-success" role="alert"><div><i class="bi bi-check-lg" aria-hidden="true"></i> <span><strong>Loaded from the cloud!</strong> Please inspect your loaded settings before saving them locally. You can press the <i class="bi bi-floppy" aria-hidden="true"></i> Save button below this message to do that.</span></div><button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    } catch (error) {
        console.error(error)
        alert(`Oops, something went wrong while loading secret settings. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}`)
    }
}

async function loadSecretSettings() {
    try {
        const storedBackgroundSelection = (await chrome.storage.local.get())["secretSettings_backgroundSelection"]
        storedCustomBackground = (await chrome.storage.local.get())["secretSettings_customBackground"]
        const storedFontSelection = (await chrome.storage.local.get())["secretSettings_fontSelection"]
        const storedGradientSelection = (await chrome.storage.local.get())["secretSettings_gradientSelection"]
        const storedGradientDisabled = (await chrome.storage.local.get())["secretSettings_gradientDisabled"]
        if (Object.values(backgroundList).map(background => background.name).includes(storedBackgroundSelection) === true) {
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

async function saveCloudSecretSettings() {
    try {
        // element.src gets the absolute URL, but we need the relative URL so element.getAttribute("src") is used instead
        if (secretSettingsStaticBackgroundPreview.getAttribute("src") === selectImageImage && secretSettingsVideoBackgroundPreview.children.length === 0) {
            secretSettingsCustomBackgroundAlertWrapper.innerHTML = `<div class="alert theme-danger mt-3" role="alert"><div><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> <span>Please upload a custom background before saving. If you don't want to save your changes, you can close this tab.</span></div><button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button></div>`
            secretSettingsCustomBackgroundAlertWrapper.scrollIntoView({ behavior: "smooth" })
            return
        }
        secretSettingsDisableSwitch.disabled = true
        secretSettingsFontSelection.disabled = true
        secretSettingsBackgroundSelection.disabled = true
        secretSettingsCustomBackgroundUploader.disabled = true
        secretSettingsGradientSelection.disabled = true
        secretSettingsGradientDisableSwitch.disabled = true
        secretSettingsLoadCloudButton.disabled = true
        secretSettingsSaveCloudButton.disabled = true
        secretSettingsSaveButton.disabled = true
        if (secretSettingsDisableSwitch.checked) {
            await chrome.storage.sync.remove(["secretSettings_backgroundSelection"])
            await chrome.storage.sync.remove(["secretSettings_fontSelection"])
            await chrome.storage.sync.remove(["secretSettings_gradientSelection"])
            await chrome.storage.sync.remove(["secretSettings_gradientDisabled"])
            await chrome.storage.sync.remove(["secretSettingsVisible"])
        } else {
            if (secretSettingsBackgroundSelection.value === "custom") {
                await chrome.storage.sync.remove(["secretSettings_backgroundSelection"])
            } else {
                await chrome.storage.sync.set({ secretSettings_backgroundSelection: secretSettingsBackgroundSelection.value })
            }
            await chrome.storage.sync.set({ secretSettings_fontSelection: secretSettingsFontSelection.value })
            await chrome.storage.sync.set({ secretSettings_gradientSelection: secretSettingsGradientSelection.value })
            await chrome.storage.sync.set({ secretSettings_gradientDisabled: secretSettingsGradientDisableSwitch.checked })
        }
        secretSettingsDisableSwitch.disabled = false
        secretSettingsFontSelection.disabled = false
        secretSettingsBackgroundSelection.disabled = false
        secretSettingsCustomBackgroundUploader.disabled = false
        secretSettingsGradientSelection.disabled = false
        secretSettingsGradientDisableSwitch.disabled = false
        secretSettingsLoadCloudButton.disabled = false
        secretSettingsSaveCloudButton.disabled = false
        secretSettingsSaveCloudAlertWrapper.innerHTML = `<div class="alert theme-success" role="alert"><div><i class="bi bi-check-lg" aria-hidden="true"></i> <span><strong>Saved to the cloud!</strong> However, your changes have not been saved locally. You can press the <i class="bi bi-floppy" aria-hidden="true"></i> Save button below this message to do that.</span></div><button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button></div>`
        secretSettingsSaveButton.disabled = false
    } catch (error) {
        console.error(error)
        alert(`Oops, something went wrong while saving secret settings. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}`)
    }
}

async function saveSecretSettings() {
    try {
        // element.src gets the absolute URL, but we need the relative URL so element.getAttribute("src") is used instead
        if (secretSettingsStaticBackgroundPreview.getAttribute("src") === selectImageImage && secretSettingsVideoBackgroundPreview.children.length === 0) {
            secretSettingsCustomBackgroundAlertWrapper.innerHTML = `<div class="alert theme-danger mt-3" role="alert"><div><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> <span>Please upload a custom background before saving. If you don't want to save your changes, you can close this tab.</span></div><button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button></div>`
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
            await chrome.storage.local.remove(["secretSettings_customBackgroundVideoPosition"])
            await chrome.storage.local.remove(["secretSettings_backgroundSelection"])
            await chrome.storage.local.remove(["secretSettings_fontSelection"])
            await chrome.storage.local.remove(["secretSettings_gradientSelection"])
            await chrome.storage.local.remove(["secretSettings_gradientDisabled"])
            await chrome.storage.local.remove(["secretSettingsVisible"])
        } else {
            if (uploadedCustomBackground === undefined && storedCustomBackground === undefined) {
                await chrome.storage.local.remove(["secretSettings_customBackground"])
                await chrome.storage.local.remove(["secretSettings_customBackgroundVideoPosition"])
            } else {
                await chrome.storage.local.set({ secretSettings_customBackground: uploadedCustomBackground })
                await chrome.storage.local.remove(["secretSettings_customBackgroundVideoPosition"])
            }
            if (secretSettingsBackgroundSelection.value !== "custom") {
                await chrome.storage.local.remove(["secretSettings_customBackground"])
                await chrome.storage.local.remove(["secretSettings_customBackgroundVideoPosition"])
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

async function updateBackgroundPreview() {
    secretSettingsStaticBackgroundPreview.parentElement.hidden = false
    secretSettingsVideoBackgroundPreview.innerHTML = ""
    secretSettingsVideoBackgroundPreview.parentElement.hidden = true
    secretSettingsVideoBackgroundPreview.load()
    secretSettingsCustomBackgroundSection.hidden = true
    const backgroundSelection = secretSettingsBackgroundSelection.value
    if (Object.values(backgroundList).map(background => background.name).includes(backgroundSelection) === true) {
        switch (secretSettingsBackgroundSelection.value) {
            case "custom":
                secretSettingsCustomBackgroundSection.hidden = false
                secretSettingsStaticBackgroundPreview.setAttribute("src", selectImageImage)
                secretSettingsBackgroundPreviewNotes.innerHTML = "Harrison Green asked for this. Go thank him for that :)"
                const storedBackgroundData = await getCustomBackgroundData()
                if (storedBackgroundData.type === "none") {
                    console.error(`Stored custom background is an invalid type`)
                    if (uploadedCustomBackground === undefined) {
                        return
                    }
                }
                if (uploadedCustomBackground === undefined && storedBackgroundData.type === "image") {
                    secretSettingsStaticBackgroundPreview.setAttribute("src", storedBackgroundData.url)
                }
                if (uploadedCustomBackground === undefined && storedBackgroundData.type === "video") {
                    secretSettingsStaticBackgroundPreview.parentElement.hidden = true
                    secretSettingsVideoBackgroundPreview.innerHTML = ""
                    secretSettingsVideoBackgroundPreview.parentElement.hidden = false
                    secretSettingsVideoBackgroundPreview.load()
                    const source = document.createElement("source")
                    source.src = storedBackgroundData.url
                    secretSettingsVideoBackgroundPreview.appendChild(source)
                }
                if (uploadedCustomBackground !== undefined) {
                    const uploadedBackgroundData = await getCustomBackgroundDataFromURL(uploadedCustomBackground)
                    if (uploadedBackgroundData.type === "image") {
                        secretSettingsStaticBackgroundPreview.setAttribute("src", uploadedBackgroundData.url)
                        return
                    }
                    if (uploadedBackgroundData.type === "video") {
                        secretSettingsStaticBackgroundPreview.parentElement.hidden = true
                        secretSettingsStaticBackgroundPreview.setAttribute("src", selectImageImage)
                        secretSettingsVideoBackgroundPreview.innerHTML = ""
                        secretSettingsVideoBackgroundPreview.parentElement.hidden = false
                        secretSettingsVideoBackgroundPreview.load()
                        const source = document.createElement("source")
                        source.src = uploadedBackgroundData.url
                        secretSettingsVideoBackgroundPreview.appendChild(source)
                        return
                    }
                    console.error("Unable to load custom background, probably because of an invalid MIME type.")
                }
                break
            case "seasonal":
                secretSettingsStaticBackgroundPreview.setAttribute("src", getSeasonalBackground())
                secretSettingsBackgroundPreviewNotes.innerHTML = backgroundList.seasonal.description
                break
            default:
                secretSettingsStaticBackgroundPreview.setAttribute("src", Object.values(backgroundList).filter(background => background.name === backgroundSelection)[0].file)
                secretSettingsBackgroundPreviewNotes.innerHTML = Object.values(backgroundList).filter(background => background.name === backgroundSelection)[0].description
        }
    } else {
        secretSettingsStaticBackgroundPreview.hidden = true
        secretSettingsBackgroundPreviewNotes.hidden = true
    }
}

function updateFontPreview() {
    secretSettingsFontPreview.classList.remove(...validFonts.map(name => `font-${name}`))
    const fontSelection = secretSettingsFontSelection.value.trim()
    if (validFonts.includes(fontSelection) === true) {
        secretSettingsFontPreview.classList.add(`font-${fontSelection}`)
    } else {
        secretSettingsFontPreview.classList.add("font-azeret-mono")
    }
}

function handleBeforeUnload() {
    if (changesWereMade === false) {
        changesWereMade = true
        secretSettingsUnsavedChangesIndicator.hidden = false
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
    await runCloudMigrations()
    handleFakeLinks()
    if (new URL(location.href).searchParams.get("loadCloudSettings") === "true") {
        const targetUrl = new URL(location.href)
        targetUrl.searchParams.delete("loadCloudSettings")
        history.replaceState(null, null, targetUrl)
        await loadCloudSecretSettings()
        await handleSecretSettingsVisibility()
        // All of this ResizeObserver stuff is needed because the images loading in would screw up scrollIntoView's initial calculations and push the target element offscreen
        secretSettingsSaveCloudAlertWrapper.scrollIntoView({ behavior: "smooth" })
        const observer = new ResizeObserver(() => {
            secretSettingsSaveCloudAlertWrapper.scrollIntoView({ behavior: "smooth" })
            observer.disconnect()
        })
        observer.observe(document.body)
    } else {
        await loadSecretSettings()
        handleSecretSettingsVisibility()
    }
    updateFontPreview()
    await updateBackgroundPreview()
    secretSettingsStaticBackgroundPreview.hidden = false
    secretSettingsBackgroundPreviewNotes.hidden = false
}
loadStuff()
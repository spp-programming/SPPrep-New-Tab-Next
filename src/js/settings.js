"use strict"
import { handleFakeLinks } from "./modules/fake-links.js"
import { runMigrations } from "./modules/migrations.js"
import { settingsCustomLink1IconUploader, settingsCustomLink1IconUploaderAlertWrapper, settingsCustomLink1IconUploaderReal, settingsCustomLink1NameInput, settingsCustomLink1Switch, settingsCustomLink1URLInput, settingsCustomLink2IconUploader, settingsCustomLink2IconUploaderAlertWrapper, settingsCustomLink2IconUploaderReal, settingsCustomLink2NameInput, settingsCustomLink2Switch, settingsCustomLink2URLInput, settingsCustomLink3IconUploader, settingsCustomLink3IconUploaderAlertWrapper, settingsCustomLink3IconUploaderReal, settingsCustomLink3NameInput, settingsCustomLink3Switch, settingsCustomLink3URLInput, settingsCustomLinkCards, settingsEnableCustomLinksSwitch, settingsHideSchoolCalendarSwitch, settingsSaveButton } from "./modules/settings-constants.js"

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerElement => new bootstrap.Tooltip(tooltipTriggerElement))

// URL validation function stolen from https://stackoverflow.com/a/43467144
function isValidURL(string) {
    let url
    try {
        url = new URL(string)
    } catch {
        return false
    }
    return url.protocol === "http:" || url.protocol === "https:"
}

function enableCustomLink1CardContent() {
    settingsCustomLink1IconUploader.classList.remove("disabled")
    settingsCustomLink1IconUploader.removeAttribute("aria-disabled")
    settingsCustomLink1IconUploader.removeAttribute("tabindex")
    settingsCustomLink1NameInput.disabled = false
    settingsCustomLink1URLInput.disabled = false
}

function disableCustomLink1CardContent() {
    settingsCustomLink1IconUploader.classList.add("disabled")
    settingsCustomLink1IconUploader.setAttribute("aria-disabled", "true")
    settingsCustomLink1IconUploader.setAttribute("tabindex", "-1")
    settingsCustomLink1NameInput.disabled = true
    settingsCustomLink1URLInput.disabled = true
}

function enableCustomLink2CardContent() {
    settingsCustomLink2IconUploader.classList.remove("disabled")
    settingsCustomLink2IconUploader.removeAttribute("aria-disabled")
    settingsCustomLink2IconUploader.removeAttribute("tabindex")
    settingsCustomLink2NameInput.disabled = false
    settingsCustomLink2URLInput.disabled = false
}

function disableCustomLink2CardContent() {
    settingsCustomLink2IconUploader.classList.add("disabled")
    settingsCustomLink2IconUploader.setAttribute("aria-disabled", "true")
    settingsCustomLink2IconUploader.setAttribute("tabindex", "-1")
    settingsCustomLink2NameInput.disabled = true
    settingsCustomLink2URLInput.disabled = true
}

function enableCustomLink3CardContent() {
    settingsCustomLink3IconUploader.classList.remove("disabled")
    settingsCustomLink3IconUploader.removeAttribute("aria-disabled")
    settingsCustomLink3IconUploader.removeAttribute("tabindex")
    settingsCustomLink3NameInput.disabled = false
    settingsCustomLink3URLInput.disabled = false
}

function disableCustomLink3CardContent() {
    settingsCustomLink3IconUploader.classList.add("disabled")
    settingsCustomLink3IconUploader.setAttribute("aria-disabled", "true")
    settingsCustomLink3IconUploader.setAttribute("tabindex", "-1")
    settingsCustomLink3NameInput.disabled = true
    settingsCustomLink3URLInput.disabled = true
}

settingsCustomLink1Switch.addEventListener("change", () => {
    disableCustomLink1CardContent()
    if (settingsCustomLink1Switch.checked) {
        enableCustomLink1CardContent()
    }
})

settingsCustomLink2Switch.addEventListener("change", () => {
    disableCustomLink2CardContent()
    if (settingsCustomLink2Switch.checked) {
        enableCustomLink2CardContent()
    }
})

settingsCustomLink3Switch.addEventListener("change", () => {
    disableCustomLink3CardContent()
    if (settingsCustomLink3Switch.checked) {
        enableCustomLink3CardContent()
    }
})

settingsEnableCustomLinksSwitch.addEventListener("change", () => {
    settingsCustomLinkCards.hidden = true
    if (settingsEnableCustomLinksSwitch.checked) {
        settingsCustomLinkCards.hidden = false
    }
})

settingsCustomLink1IconUploader.addEventListener("click", () => {
    if (settingsCustomLink1IconUploader.classList.contains("disabled")) {
        console.error("Icon uploader clicked while being disabled, this should not be happening!")
        return
    }
    settingsCustomLink1IconUploaderReal.click()
})

settingsCustomLink2IconUploader.addEventListener("click", () => {
    if (settingsCustomLink2IconUploader.classList.contains("disabled")) {
        console.error("Icon uploader clicked while being disabled, this should not be happening!")
        return
    }
    settingsCustomLink2IconUploaderReal.click()
})

settingsCustomLink3IconUploader.addEventListener("click", () => {
    if (settingsCustomLink3IconUploader.classList.contains("disabled")) {
        console.error("Icon uploader clicked while being disabled, this should not be happening!")
        return
    }
    settingsCustomLink3IconUploaderReal.click()
})

settingsCustomLink1IconUploaderReal.addEventListener("change", async () => {
    settingsSaveButton.disabled = true
    settingsCustomLink1Switch.disabled = true
    settingsCustomLink1IconUploader.classList.add("disabled")
    settingsCustomLink1IconUploader.setAttribute("aria-disabled", "true")
    settingsCustomLink1IconUploader.setAttribute("tabindex", "-1")
    let iconURL
    if (validateCustomLink1IconUploaderFileList() === true) {
        iconURL = await constructCustomLinkIconURL(settingsCustomLink1IconUploaderReal.files[0])
        settingsCustomLink1IconUploader.querySelector("img").src = iconURL
    }
    settingsCustomLink1IconUploaderReal.value = ""
    settingsSaveButton.disabled = false
    settingsCustomLink1Switch.disabled = false
    settingsCustomLink1IconUploader.classList.remove("disabled")
    settingsCustomLink1IconUploader.removeAttribute("aria-disabled")
    settingsCustomLink1IconUploader.removeAttribute("tabindex")
})

settingsCustomLink2IconUploaderReal.addEventListener("change", async () => {
    settingsSaveButton.disabled = true
    settingsCustomLink2Switch.disabled = true
    settingsCustomLink2IconUploader.classList.add("disabled")
    settingsCustomLink2IconUploader.setAttribute("aria-disabled", "true")
    settingsCustomLink2IconUploader.setAttribute("tabindex", "-1")
    let iconURL
    if (validateCustomLink2IconUploaderFileList() === true) {
        iconURL = await constructCustomLinkIconURL(settingsCustomLink2IconUploaderReal.files[0])
        settingsCustomLink2IconUploader.querySelector("img").src = iconURL
    }
    settingsCustomLink2IconUploaderReal.value = ""
    settingsSaveButton.disabled = false
    settingsCustomLink2Switch.disabled = false
    settingsCustomLink2IconUploader.classList.remove("disabled")
    settingsCustomLink2IconUploader.removeAttribute("aria-disabled")
    settingsCustomLink2IconUploader.removeAttribute("tabindex")
})

settingsCustomLink3IconUploaderReal.addEventListener("change", async () => {
    settingsSaveButton.disabled = true
    settingsCustomLink3Switch.disabled = true
    settingsCustomLink3IconUploader.classList.add("disabled")
    settingsCustomLink3IconUploader.setAttribute("aria-disabled", "true")
    settingsCustomLink3IconUploader.setAttribute("tabindex", "-1")
    let iconURL
    if (validateCustomLink3IconUploaderFileList() === true) {
        iconURL = await constructCustomLinkIconURL(settingsCustomLink3IconUploaderReal.files[0])
        settingsCustomLink3IconUploader.querySelector("img").src = iconURL
    }
    settingsCustomLink3IconUploaderReal.value = ""
    settingsSaveButton.disabled = false
    settingsCustomLink3Switch.disabled = false
    settingsCustomLink3IconUploader.classList.remove("disabled")
    settingsCustomLink3IconUploader.removeAttribute("aria-disabled")
    settingsCustomLink3IconUploader.removeAttribute("tabindex")
})

settingsSaveButton.addEventListener("click", () => {
    saveSettings()
})

function validateCustomLink1IconUploaderFileList() {
    settingsCustomLink1IconUploaderAlertWrapper.innerHTML = ""
    if (settingsCustomLink1IconUploaderReal.files.length === 0) {
        console.log("Custom link (1) icon validator: No files selected.")
        return false
    }
    if (settingsCustomLink1IconUploaderReal.files[0].size > 512000) {
        console.error(`Custom link (1) icon validator: File "${settingsCustomLink1IconUploaderReal.files[0].name}" is larger than 512000 bytes!`)
        settingsCustomLink1IconUploaderAlertWrapper.innerHTML = `<div class="alert alert-danger alert-dismissible fade show mt-3" role="alert"><div><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> <span>File is larger than 512 kilobytes! Reduce the file size of your image before trying again.</span></div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
        return false
    }
    return true
}

function validateCustomLink2IconUploaderFileList() {
    settingsCustomLink2IconUploaderAlertWrapper.innerHTML = ""
    if (settingsCustomLink2IconUploaderReal.files.length === 0) {
        console.log("Custom link (2) icon validator: No files selected.")
        return false
    }
    if (settingsCustomLink2IconUploaderReal.files[0].size > 512000) {
        console.error(`Custom link (2) icon validator: File "${settingsCustomLink2IconUploaderReal.files[0].name}" is larger than 512000 bytes!`)
        settingsCustomLink2IconUploaderAlertWrapper.innerHTML = `<div class="alert alert-danger alert-dismissible fade show mt-3" role="alert"><div><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> <span>File is larger than 512 kilobytes! Reduce the file size of your image before trying again.</span></div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
        return false
    }
    return true
}

function validateCustomLink3IconUploaderFileList() {
    settingsCustomLink3IconUploaderAlertWrapper.innerHTML = ""
    if (settingsCustomLink3IconUploaderReal.files.length === 0) {
        console.log("Custom link (3) icon validator: No files selected.")
        return false
    }
    if (settingsCustomLink3IconUploaderReal.files[0].size > 512000) {
        console.error(`Custom link (3) icon validator: File "${settingsCustomLink3IconUploaderReal.files[0].name}" is larger than 512000 bytes!`)
        settingsCustomLink3IconUploaderAlertWrapper.innerHTML = `<div class="alert alert-danger alert-dismissible fade show mt-3" role="alert"><div><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> <span>File is larger than 512 kilobytes! Reduce the file size of your image before trying again.</span></div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
        return false
    }
    return true
}

async function constructCustomLinkIconURL(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.addEventListener("load", () => {
            resolve(fileReader.result)
        })
        fileReader.addEventListener("error", () => {
            reject()
        })
        fileReader.readAsDataURL(file)
    })
}

async function loadSettings() {
    const storedHideSchoolCalendarSelection = (await chrome.storage.local.get(["settings_hideSchoolCalendarSelection"]))["settings_hideSchoolCalendarSelection"]
    const storedEnableCustomLinksSelection = (await chrome.storage.local.get(["settings_enableCustomLinksSelection"]))["settings_enableCustomLinksSelection"]
    if (storedHideSchoolCalendarSelection === true) {
        settingsHideSchoolCalendarSwitch.checked = true
    }
}

async function saveSettings() {
    settingsHideSchoolCalendarSwitch.disabled = true
    settingsEnableCustomLinksSwitch.disabled = true
    disableCustomLink1CardContent()
    disableCustomLink2CardContent()
    disableCustomLink3CardContent()
    settingsSaveButton.disabled = true
    settingsSaveButton.innerHTML = "<span class=\"spinner-border spinner-border-sm\" aria-hidden=\"true\"></span> <span role=\"status\">Saving...</span>"
    if (settingsHideSchoolCalendarSwitch.checked = true) {
        await chrome.storage.local.set({ settings_hideSchoolCalendarSelection: settingsHideSchoolCalendarSwitch.checked })
    } else {
        await chrome.storage.remove(["settings_hideSchoolCalendarSelection"])
    }
    chrome.runtime.reload()
}

async function loadStuff() {
    await runMigrations()
    handleFakeLinks()
    await loadSettings()
}

loadStuff()
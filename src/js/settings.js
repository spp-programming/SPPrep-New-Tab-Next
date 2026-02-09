"use strict"
import { handleFakeLinks } from "./modules/fake-links.js"
import { runMigrations } from "./modules/migrations.js"
import { settingsClockModeRadio12hour, settingsClockModeRadio24hour, settingsClockModeRadioAmPm, settingsContent, settingsCustomLink1Card, settingsCustomLink1IconResetter, settingsCustomLink1IconUploader, settingsCustomLink1IconUploaderAlertWrapper, settingsCustomLink1IconUploaderReal, settingsCustomLink1NameInput, settingsCustomLink1Switch, settingsCustomLink1URLInput, settingsCustomLink1URLInputAlertWrapper, settingsCustomLink2Card, settingsCustomLink2IconResetter, settingsCustomLink2IconUploader, settingsCustomLink2IconUploaderAlertWrapper, settingsCustomLink2IconUploaderReal, settingsCustomLink2NameInput, settingsCustomLink2Switch, settingsCustomLink2URLInput, settingsCustomLink2URLInputAlertWrapper, settingsCustomLink3Card, settingsCustomLink3IconResetter, settingsCustomLink3IconUploader, settingsCustomLink3IconUploaderAlertWrapper, settingsCustomLink3IconUploaderReal, settingsCustomLink3NameInput, settingsCustomLink3Switch, settingsCustomLink3URLInput, settingsCustomLink3URLInputAlertWrapper, settingsCustomLinkCards, settingsEnableCustomLinksAlertWrapper, settingsEnableCustomLinksSwitch, settingsEnableSplitLayoutSwitch, settingsHideClubHubSwitch, settingsHideSchoolCalendarSwitch, settingsSaveButton } from "./modules/settings-constants.js"

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerElement => new bootstrap.Tooltip(tooltipTriggerElement))

let changesWereMade = false
let aboutToReload = false

// URL validation function stolen from https://stackoverflow.com/a/43467144
function isValidURL(string) {
    let url
    try {
        url = new URL(string)
    } catch {
        return false
    }
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "steam:"
}

function enableCustomLink1CardContent() {
    settingsCustomLink1IconUploader.classList.remove("disabled")
    settingsCustomLink1IconUploader.removeAttribute("aria-disabled")
    settingsCustomLink1IconUploader.removeAttribute("tabindex")
    settingsCustomLink1IconResetter.parentElement.hidden = false
    settingsCustomLink1NameInput.disabled = false
    settingsCustomLink1URLInput.disabled = false
}

function disableCustomLink1CardContent() {
    settingsCustomLink1IconUploader.classList.add("disabled")
    settingsCustomLink1IconUploader.setAttribute("aria-disabled", "true")
    settingsCustomLink1IconUploader.setAttribute("tabindex", "-1")
    settingsCustomLink1IconResetter.parentElement.hidden = true
    settingsCustomLink1NameInput.disabled = true
    settingsCustomLink1URLInput.disabled = true
    settingsCustomLink1URLInput.classList.remove("is-invalid")
    settingsCustomLink1URLInputAlertWrapper.innerHTML = ""
}

function enableCustomLink2CardContent() {
    settingsCustomLink2IconUploader.classList.remove("disabled")
    settingsCustomLink2IconUploader.removeAttribute("aria-disabled")
    settingsCustomLink2IconUploader.removeAttribute("tabindex")
    settingsCustomLink2IconResetter.parentElement.hidden = false
    settingsCustomLink2NameInput.disabled = false
    settingsCustomLink2URLInput.disabled = false
}

function disableCustomLink2CardContent() {
    settingsCustomLink2IconUploader.classList.add("disabled")
    settingsCustomLink2IconUploader.setAttribute("aria-disabled", "true")
    settingsCustomLink2IconUploader.setAttribute("tabindex", "-1")
    settingsCustomLink2IconResetter.parentElement.hidden = true
    settingsCustomLink2NameInput.disabled = true
    settingsCustomLink2URLInput.disabled = true
    settingsCustomLink2URLInput.classList.remove("is-invalid")
    settingsCustomLink2URLInputAlertWrapper.innerHTML = ""
}

function enableCustomLink3CardContent() {
    settingsCustomLink3IconUploader.classList.remove("disabled")
    settingsCustomLink3IconUploader.removeAttribute("aria-disabled")
    settingsCustomLink3IconUploader.removeAttribute("tabindex")
    settingsCustomLink3IconResetter.parentElement.hidden = false
    settingsCustomLink3NameInput.disabled = false
    settingsCustomLink3URLInput.disabled = false
}

function disableCustomLink3CardContent() {
    settingsCustomLink3IconUploader.classList.add("disabled")
    settingsCustomLink3IconUploader.setAttribute("aria-disabled", "true")
    settingsCustomLink3IconUploader.setAttribute("tabindex", "-1")
    settingsCustomLink3IconResetter.parentElement.hidden = true
    settingsCustomLink3NameInput.disabled = true
    settingsCustomLink3URLInput.disabled = true
    settingsCustomLink3URLInput.classList.remove("is-invalid")
    settingsCustomLink3URLInputAlertWrapper.innerHTML = ""
}
settingsEnableSplitLayoutSwitch.addEventListener("change", () => {
    handleBeforeUnload()
})

settingsHideSchoolCalendarSwitch.addEventListener("change", () => {
    handleBeforeUnload()
})

settingsHideClubHubSwitch.addEventListener("change", () => {
    handleBeforeUnload()
})

settingsCustomLink1Switch.addEventListener("change", () => {
    handleBeforeUnload()
    disableCustomLink1CardContent()
    if (settingsCustomLink1Switch.checked) {
        enableCustomLink1CardContent()
    }
})

settingsCustomLink2Switch.addEventListener("change", () => {
    handleBeforeUnload()
    disableCustomLink2CardContent()
    if (settingsCustomLink2Switch.checked) {
        enableCustomLink2CardContent()
    }
})

settingsCustomLink3Switch.addEventListener("change", () => {
    handleBeforeUnload()
    disableCustomLink3CardContent()
    if (settingsCustomLink3Switch.checked) {
        enableCustomLink3CardContent()
    }
})

settingsEnableCustomLinksSwitch.addEventListener("change", () => {
    handleBeforeUnload()
    if (settingsEnableCustomLinksSwitch.checked) {
        settingsCustomLinkCards.hidden = false
        settingsEnableCustomLinksAlertWrapper.innerHTML = ""
    } else {
        settingsCustomLinkCards.hidden = true
        settingsEnableCustomLinksAlertWrapper.innerHTML = `<div class="alert alert-info alert-dismissible fade show mt-3" role="alert"><div><i class="bi bi-info-circle" aria-hidden="true"></i> <span>Turning the custom links option off will delete all of your custom links when you save.</span></div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    }
})

settingsCustomLink1IconUploader.addEventListener("click", () => {
    handleBeforeUnload()
    if (settingsCustomLink1IconUploader.classList.contains("disabled")) {
        console.error("Icon uploader clicked while being disabled, this should not be happening!")
        return
    }
    settingsCustomLink1IconUploaderReal.click()
})

settingsCustomLink2IconUploader.addEventListener("click", () => {
    handleBeforeUnload()
    if (settingsCustomLink2IconUploader.classList.contains("disabled")) {
        console.error("Icon uploader clicked while being disabled, this should not be happening!")
        return
    }
    settingsCustomLink2IconUploaderReal.click()
})

settingsCustomLink3IconUploader.addEventListener("click", () => {
    handleBeforeUnload()
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

settingsCustomLink1IconResetter.addEventListener("click", () => {
    handleBeforeUnload()
    settingsCustomLink1IconUploader.querySelector("img").src = "./img/icons/globe2.svg"
})

settingsCustomLink2IconResetter.addEventListener("click", () => {
    handleBeforeUnload()
    settingsCustomLink2IconUploader.querySelector("img").src = "./img/icons/globe2.svg"
})

settingsCustomLink3IconResetter.addEventListener("click", () => {
    handleBeforeUnload()
    settingsCustomLink3IconUploader.querySelector("img").src = "./img/icons/globe2.svg"
})

settingsCustomLink1NameInput.addEventListener("input", () => {
    handleBeforeUnload()
})

settingsCustomLink2NameInput.addEventListener("input", () => {
    handleBeforeUnload()
})

settingsCustomLink3NameInput.addEventListener("input", () => {
    handleBeforeUnload()
})

settingsCustomLink1URLInput.addEventListener("input", () => {
    handleBeforeUnload()
    settingsCustomLink1URLInput.classList.remove("is-invalid")
})

settingsCustomLink2URLInput.addEventListener("input", () => {
    handleBeforeUnload()
    settingsCustomLink2URLInput.classList.remove("is-invalid")
})

settingsCustomLink3URLInput.addEventListener("input", () => {
    handleBeforeUnload()
    settingsCustomLink3URLInput.classList.remove("is-invalid")
})

settingsClockModeRadio12hour.addEventListener("change", () => {
    handleBeforeUnload()
})

settingsClockModeRadioAmPm.addEventListener("change", () => {
    handleBeforeUnload()
})

settingsClockModeRadio24hour.addEventListener("change", () => {
    handleBeforeUnload()
})

settingsSaveButton.addEventListener("click", () => {
    handleBeforeUnload()
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
    try {
        const storedEnableSplitLayoutSelection = (await chrome.storage.local.get())["settings_enableSplitLayoutSelection"]
        const storedHideSchoolCalendarSelection = (await chrome.storage.local.get())["settings_hideSchoolCalendarSelection"]
        const storedHideClubHubSelection = (await chrome.storage.local.get())["settings_hideClubHubSelection"]
        const storedEnableCustomLinksSelection = (await chrome.storage.local.get())["settings_enableCustomLinksSelection"]
        const storedCustomLink1Enabled = (await chrome.storage.local.get())["settings_customLink1Enabled"]
        const storedCustomLink2Enabled = (await chrome.storage.local.get())["settings_customLink2Enabled"]
        const storedCustomLink3Enabled = (await chrome.storage.local.get())["settings_customLink3Enabled"]
        const storedCustomLink1IconURL = (await chrome.storage.local.get())["settings_customLink1IconURL"]
        const storedCustomLink2IconURL = (await chrome.storage.local.get())["settings_customLink2IconURL"]
        const storedCustomLink3IconURL = (await chrome.storage.local.get())["settings_customLink3IconURL"]
        const storedCustomLink1Name = (await chrome.storage.local.get())["settings_customLink1Name"]
        const storedCustomLink2Name = (await chrome.storage.local.get())["settings_customLink2Name"]
        const storedCustomLink3Name = (await chrome.storage.local.get())["settings_customLink3Name"]
        const storedCustomLink1URL = (await chrome.storage.local.get())["settings_customLink1URL"]
        const storedCustomLink2URL = (await chrome.storage.local.get())["settings_customLink2URL"]
        const storedCustomLink3URL = (await chrome.storage.local.get())["settings_customLink3URL"]
        const storedClockModeSelection = (await chrome.storage.local.get())["settings_clockModeSelection"]
        if (storedEnableSplitLayoutSelection === true) {
            settingsEnableSplitLayoutSwitch.checked = true
        }
        if (storedHideSchoolCalendarSelection === true) {
            settingsHideSchoolCalendarSwitch.checked = true
        }
        if (storedHideClubHubSelection === true) {
            settingsHideClubHubSwitch.checked = true
        }
        if (storedEnableCustomLinksSelection === true) {
            settingsEnableCustomLinksSwitch.checked = true
            settingsCustomLinkCards.hidden = false
        }
        if (storedCustomLink1Enabled === true) {
            settingsCustomLink1Switch.checked = true
            enableCustomLink1CardContent()
        }
        if (storedCustomLink2Enabled === true) {
            settingsCustomLink2Switch.checked = true
            enableCustomLink2CardContent()
        }
        if (storedCustomLink3Enabled === true) {
            settingsCustomLink3Switch.checked = true
            enableCustomLink3CardContent()
        }
        if (typeof(storedCustomLink1IconURL) === "string") {
            settingsCustomLink1IconUploader.querySelector("img").src = storedCustomLink1IconURL
        }
        if (typeof(storedCustomLink2IconURL) === "string") {
            settingsCustomLink2IconUploader.querySelector("img").src = storedCustomLink2IconURL
        }
        if (typeof(storedCustomLink3IconURL) === "string") {
            settingsCustomLink3IconUploader.querySelector("img").src = storedCustomLink3IconURL
        }
        if (typeof(storedCustomLink1Name) === "string") {
            settingsCustomLink1NameInput.value = storedCustomLink1Name
        }
        if (typeof(storedCustomLink2Name) === "string") {
            settingsCustomLink2NameInput.value = storedCustomLink2Name
        }
        if (typeof(storedCustomLink3Name) === "string") {
            settingsCustomLink3NameInput.value = storedCustomLink3Name
        }
        if (typeof(storedCustomLink1URL) === "string") {
            settingsCustomLink1URLInput.value = storedCustomLink1URL
        }
        if (typeof(storedCustomLink2URL) === "string") {
            settingsCustomLink2URLInput.value = storedCustomLink2URL
        }
        if (typeof(storedCustomLink3URL) === "string") {
            settingsCustomLink3URLInput.value = storedCustomLink3URL
        }
        switch (storedClockModeSelection) {
            case "12hour":
                settingsClockModeRadio12hour.checked = true
                break
            case "ampm":
                settingsClockModeRadioAmPm.checked = true
                break
            case "24hour":
                settingsClockModeRadio24hour.checked = true
                break
        }
        settingsContent.hidden = false
    } catch (error) {
        console.error(error)
        alert(`Oops, something went wrong while loading settings. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}`)
    }
}

async function saveSettings() {
    try {
        settingsEnableSplitLayoutSwitch.disabled = true
        settingsHideSchoolCalendarSwitch.disabled = true
        settingsHideClubHubSwitch.disabled = true
        settingsEnableCustomLinksSwitch.disabled = true
        settingsCustomLink1Switch.disabled = true
        settingsCustomLink2Switch.disabled = true
        settingsCustomLink3Switch.disabled = true
        disableCustomLink1CardContent()
        disableCustomLink2CardContent()
        disableCustomLink3CardContent()
        settingsClockModeRadio12hour.disabled = true
        settingsClockModeRadioAmPm.disabled = true
        settingsClockModeRadio24hour.disabled = true
        settingsSaveButton.disabled = true
        settingsSaveButton.innerHTML = "<span class=\"spinner-border spinner-border-sm\" aria-hidden=\"true\"></span> <span role=\"status\">Saving...</span>"
        if (settingsCustomLink1Switch.checked === true) {
            if (isValidURL(settingsCustomLink1URLInput.value) === false) {
                settingsClockModeRadio12hour.disabled = false
                settingsClockModeRadioAmPm.disabled = false
                settingsClockModeRadio24hour.disabled = false
                settingsCustomLink1Switch.disabled = false
                settingsCustomLink2Switch.disabled = false
                settingsCustomLink3Switch.disabled = false
                settingsCustomLink1URLInputAlertWrapper.innerHTML = `<div class="alert alert-danger alert-dismissible fade show mt-3" role="alert"><div><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> <span>Invalid URL! Please make sure that the URL contains <code>http://</code> or <code>https://</code> at the beginning.</span></div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
                settingsCustomLink1URLInput.classList.add("is-invalid")
                settingsHideSchoolCalendarSwitch.disabled = false
                settingsEnableCustomLinksSwitch.disabled = false
                settingsEnableSplitLayoutSwitch.disabled = false
                enableCustomLink1CardContent()
                enableCustomLink2CardContent()
                enableCustomLink3CardContent()
                settingsSaveButton.disabled = false
                settingsSaveButton.innerHTML = "<i class=\"bi bi-floppy\" aria-hidden=\"true\"></i> <span>Save</span>"
                settingsCustomLink1URLInput.select()
                settingsCustomLink1Card.scrollIntoView({ behavior: "smooth" })
                return
            }
            let iconURL = "./icons/globe2.svg"
            let name = "Custom link #1"
            let url = "#"
            iconURL = settingsCustomLink1IconUploader.querySelector("img").src
            if (settingsCustomLink1NameInput.value.trim() !== "") {
                name = settingsCustomLink1NameInput.value.trim()
            }
            url = settingsCustomLink1URLInput.value
            await chrome.storage.local.set({ settings_customLink1IconURL: iconURL })
            await chrome.storage.local.set({ settings_customLink1Name: name })
            await chrome.storage.local.set({ settings_customLink1URL: url })
            await chrome.storage.local.set({ settings_customLink1Enabled: true })
        } else {
            await chrome.storage.local.set({ settings_customLink1Enabled: false })
        }
        if (settingsCustomLink2Switch.checked === true) {
            if (isValidURL(settingsCustomLink2URLInput.value) === false) {
                settingsClockModeRadio12hour.disabled = false
                settingsClockModeRadioAmPm.disabled = false
                settingsClockModeRadio24hour.disabled = false
                settingsCustomLink1Switch.disabled = false
                settingsCustomLink2Switch.disabled = false
                settingsCustomLink3Switch.disabled = false
                settingsCustomLink2URLInputAlertWrapper.innerHTML = `<div class="alert alert-danger alert-dismissible fade show mt-3" role="alert"><div><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> <span>Invalid URL! Please make sure that the URL contains <code>http://</code> or <code>https://</code> at the beginning.</span></div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
                settingsCustomLink2URLInput.classList.add("is-invalid")
                settingsHideSchoolCalendarSwitch.disabled = false
                settingsEnableCustomLinksSwitch.disabled = false
                settingsEnableSplitLayoutSwitch.disabled = false
                enableCustomLink1CardContent()
                enableCustomLink2CardContent()
                enableCustomLink3CardContent()
                settingsSaveButton.disabled = false
                settingsSaveButton.innerHTML = "<i class=\"bi bi-floppy\" aria-hidden=\"true\"></i> <span>Save</span>"
                settingsCustomLink2URLInput.select()
                settingsCustomLink2Card.scrollIntoView({ behavior: "smooth" })
                return
            }
            let iconURL = "./icons/globe2.svg"
            let name = "Custom link #2"
            let url = "#"
            iconURL = settingsCustomLink2IconUploader.querySelector("img").src
            if (settingsCustomLink2NameInput.value.trim() !== "") {
                name = settingsCustomLink2NameInput.value.trim()
            }
            url = settingsCustomLink2URLInput.value
            await chrome.storage.local.set({ settings_customLink2IconURL: iconURL })
            await chrome.storage.local.set({ settings_customLink2Name: name })
            await chrome.storage.local.set({ settings_customLink2URL: url })
            await chrome.storage.local.set({ settings_customLink2Enabled: true })
        } else {
            await chrome.storage.local.set({ settings_customLink2Enabled: false })
        }
        if (settingsCustomLink3Switch.checked === true) {
            if (isValidURL(settingsCustomLink3URLInput.value) === false) {
                settingsClockModeRadio12hour.disabled = false
                settingsClockModeRadioAmPm.disabled = false
                settingsClockModeRadio24hour.disabled = false
                settingsCustomLink1Switch.disabled = false
                settingsCustomLink2Switch.disabled = false
                settingsCustomLink3Switch.disabled = false
                settingsCustomLink3URLInputAlertWrapper.innerHTML = `<div class="alert alert-danger alert-dismissible fade show mt-3" role="alert"><div><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> <span>Invalid URL! Please make sure that the URL contains <code>http://</code> or <code>https://</code> at the beginning.</span></div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
                settingsCustomLink3URLInput.classList.add("is-invalid")
                settingsHideSchoolCalendarSwitch.disabled = false
                settingsEnableCustomLinksSwitch.disabled = false
                settingsEnableSplitLayoutSwitch.disabled = false
                enableCustomLink1CardContent()
                enableCustomLink2CardContent()
                enableCustomLink3CardContent()
                settingsSaveButton.disabled = false
                settingsSaveButton.innerHTML = "<i class=\"bi bi-floppy\" aria-hidden=\"true\"></i> <span>Save</span>"
                settingsCustomLink3URLInput.select()
                settingsCustomLink3Card.scrollIntoView({ behavior: "smooth" })
                return
            }
            let iconURL = "./icons/globe2.svg"
            let name = "Custom link #3"
            let url = "#"
            iconURL = settingsCustomLink3IconUploader.querySelector("img").src
            if (settingsCustomLink3NameInput.value.trim() !== "") {
                name = settingsCustomLink3NameInput.value.trim()
            }
            url = settingsCustomLink3URLInput.value
            await chrome.storage.local.set({ settings_customLink3IconURL: iconURL })
            await chrome.storage.local.set({ settings_customLink3Name: name })
            await chrome.storage.local.set({ settings_customLink3URL: url })
            await chrome.storage.local.set({ settings_customLink3Enabled: true })
        } else {
            await chrome.storage.local.set({ settings_customLink3Enabled: false })
        }
        if (settingsEnableSplitLayoutSwitch.checked === true) {
            await chrome.storage.local.set({ settings_enableSplitLayoutSelection: settingsEnableSplitLayoutSwitch.checked })
        } else {
            await chrome.storage.local.remove(["settings_enableSplitLayoutSelection"])
        }
        if (settingsHideSchoolCalendarSwitch.checked === true) {
            await chrome.storage.local.set({ settings_hideSchoolCalendarSelection: settingsHideSchoolCalendarSwitch.checked })
        } else {
            await chrome.storage.local.remove(["settings_hideSchoolCalendarSelection"])
        }
        if (settingsHideClubHubSwitch.checked === true) {
            await chrome.storage.local.set({ settings_hideClubHubSelection: settingsHideClubHubSwitch.checked })
        } else {
            await chrome.storage.local.remove(["settings_hideClubHubSelection"])
        }
        if (settingsEnableCustomLinksSwitch.checked === true) {
            await chrome.storage.local.set({ settings_enableCustomLinksSelection: settingsEnableCustomLinksSwitch.checked })
        } else {
            await chrome.storage.local.remove(["settings_enableCustomLinksSelection"])
            await chrome.storage.local.remove(["settings_customLink1IconURL"])
            await chrome.storage.local.remove(["settings_customLink1Name"])
            await chrome.storage.local.remove(["settings_customLink1URL"])
            await chrome.storage.local.remove(["settings_customLink1Enabled"])
            await chrome.storage.local.remove(["settings_customLink2IconURL"])
            await chrome.storage.local.remove(["settings_customLink2Name"])
            await chrome.storage.local.remove(["settings_customLink2URL"])
            await chrome.storage.local.remove(["settings_customLink2Enabled"])
            await chrome.storage.local.remove(["settings_customLink3IconURL"])
            await chrome.storage.local.remove(["settings_customLink3Name"])
            await chrome.storage.local.remove(["settings_customLink3URL"])
            await chrome.storage.local.remove(["settings_customLink3Enabled"])
        }
        if (settingsClockModeRadio12hour.checked === true) {
            await chrome.storage.local.set({ settings_clockModeSelection: "12hour" })
        }
        if (settingsClockModeRadioAmPm.checked === true) {
            await chrome.storage.local.set({ settings_clockModeSelection: "ampm" })
        }
        if (settingsClockModeRadio24hour.checked === true) {
            await chrome.storage.local.set({ settings_clockModeSelection: "24hour" })
        }
        aboutToReload = true
        chrome.runtime.reload()
    } catch (error) {
        console.error(error)
        alert(`Oops, something went wrong while saving settings. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}`)
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
    await loadSettings()
}

loadStuff()
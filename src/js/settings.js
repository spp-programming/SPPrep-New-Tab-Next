"use strict"
import { handleFakeLinks } from "./modules/fake-links.js"
import { runMigrations } from "./modules/migrations.js"
import { settingsCustomLink1NameInput, settingsCustomLink1Switch, settingsCustomLink1URLInput, settingsCustomLink2NameInput, settingsCustomLink2Switch, settingsCustomLink2URLInput, settingsCustomLink3NameInput, settingsCustomLink3Switch, settingsCustomLink3URLInput, settingsCustomLinkCards, settingsEnableCustomLinksSwitch } from "./modules/settings-constants.js"

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
    settingsCustomLink1NameInput.disabled = false
    settingsCustomLink1URLInput.disabled = false
}

function disableCustomLink1CardContent() {
    settingsCustomLink1NameInput.disabled = true
    settingsCustomLink1URLInput.disabled = true
}

function enableCustomLink2CardContent() {
    settingsCustomLink2NameInput.disabled = false
    settingsCustomLink2URLInput.disabled = false
}

function disableCustomLink2CardContent() {
    settingsCustomLink2NameInput.disabled = true
    settingsCustomLink2URLInput.disabled = true
}

function enableCustomLink3CardContent() {
    settingsCustomLink3NameInput.disabled = false
    settingsCustomLink3URLInput.disabled = false
}

function disableCustomLink3CardContent() {
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

async function loadStuff() {
    await runMigrations()
    handleFakeLinks()
}

loadStuff()
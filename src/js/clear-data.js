"use strict"
import { clearEverythingModalButton } from "./modules/clear-data-constants.js"
import { handleFakeLinks } from "./modules/fake-links.js"

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerElement => new bootstrap.Tooltip(tooltipTriggerElement))

async function clearExtensionData() {
    await chrome.storage.local.clear()
    console.log("cleared extension storage!")
    await localStorage.clear() // Clearing out localStorage can fix issues with migrations, so that's why we do this.
    console.log("cleared localStorage!")
    chrome.runtime.reload()
}

clearEverythingModalButton.addEventListener("click", () => {
    clearExtensionData()
})

handleFakeLinks()
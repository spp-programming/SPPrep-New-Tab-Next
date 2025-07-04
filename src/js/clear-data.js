"use strict"
import { clearEverythingModalButton } from "./modules/clear-data-constants.js"
import { handleFakeLinks } from "./modules/fake-links.js"

async function clearExtensionData() {
    await chrome.storage.local.clear()
    console.log("cleared extension storage!")
    chrome.runtime.reload()
}

clearEverythingModalButton.addEventListener("click", () => {
    clearExtensionData()
})

handleFakeLinks()
"use strict"
import { clearEverythingModalButton } from "./modules/clear-data-constants.js"
import { handleFakeLinks } from "./modules/fake-links.js"

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
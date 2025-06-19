"use strict"
import { clearEverythingModalButton } from "./modules/clear-data-constants.js"
import { handleFakeLinks } from "./modules/fake-links.js"

function clearExtensionData() {
    localStorage.clear()
    console.log("cleared localStorage!")
    chrome.runtime.reload()
}

clearEverythingModalButton.addEventListener("click", () => {
    clearExtensionData()
})

handleFakeLinks()
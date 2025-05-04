"use strict";
import { clearEverythingModalButton, extensionDataClearedAlert } from "./modules/options-constants.js"
import { handleFakeLinks } from "./modules/fake-links.js"

handleFakeLinks()

function clearExtensionData() {
    localStorage.clear()
    console.log("cleared localStorage!")
    location.href = "#extension-data-cleared"
    location.reload()
}

if (location.hash === "#extension-data-cleared") {
    extensionDataClearedAlert.hidden = false
    extensionDataClearedAlert.scrollIntoView({ behavior: "smooth" })
    history.replaceState(null, "", window.location.pathname)
}

clearEverythingModalButton.addEventListener("click", () => {
    clearExtensionData()
})
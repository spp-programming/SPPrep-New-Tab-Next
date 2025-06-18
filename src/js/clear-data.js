import { clearEverythingModalButton } from "./modules/clear-data-constants.js"

function clearExtensionData() {
    localStorage.clear()
    console.log("cleared localStorage!")
    chrome.runtime.reload()
}


clearEverythingModalButton.addEventListener("click", () => {
    clearExtensionData()
})
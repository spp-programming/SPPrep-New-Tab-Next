"use strict"
import { clearCloudDialog, clearCloudDialogButton, clearEverythingDialogButton } from "./modules/clear-data-constants.js"
import { handleFakeLinks } from "./modules/fake-links.js"
import * as bootstrap from "./thirdparty/bootstrap.bundle.min.js"

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerElement => new bootstrap.Tooltip(tooltipTriggerElement))

async function clearExtensionData() {
    try {
        await chrome.storage.local.clear()
        console.log("cleared extension storage!")
        localStorage.clear() // Clearing out localStorage can fix issues with migrations, so that's why we do this.
        console.log("cleared localStorage!")
        chrome.runtime.reload()
    } catch (error) {
        console.error(error)
        alert(`Oops, something went wrong while clearing extension data. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}`)
    }
}

async function clearCloudData() {
    try {
        await chrome.storage.sync.clear()
        console.log("cleared sync storage!")
    } catch (error) {
        console.error(error)
        alert(`Oops, something went wrong while clearing extension data. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}`)
    }
}

clearEverythingDialogButton.addEventListener("click", () => {
    clearExtensionData()
})

clearCloudDialogButton.addEventListener("click", async() => {
    await clearCloudData()
    bootstrap.Dialog.getOrCreateInstance(clearCloudDialog).hide()
})

handleFakeLinks()
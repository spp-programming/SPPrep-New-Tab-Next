"use strict"
import { troubleshootReloadExtensionButton } from "./modules/troubleshoot-constants.js"

troubleshootReloadExtensionButton.addEventListener("click", (event) => {
    chrome.runtime.reload()
})
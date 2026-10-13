"use strict"
import { troubleshootReloadExtensionButton } from "./modules/troubleshoot-constants.js"
import * as bootstrap from "./thirdparty/bootstrap.v6.bundle.min.js"

troubleshootReloadExtensionButton.addEventListener("click", (event) => {
    chrome.runtime.reload()
})
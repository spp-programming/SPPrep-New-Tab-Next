"use strict";
import { codeEntryInput, codeEntryAlert, codeEntryActualCode, secretSettingsArea, codeEntryArea } from "./popup-constants.js"
// Modified from https://getbootstrap.com/docs/5.3/components/alerts/#live-example
function createCodeEntryAlert() {
    const codeEntryAlertWrapper = document.createElement("div")
    codeEntryAlertWrapper.innerHTML = [
        '<div class="alert alert-danger alert-dismissible fade show" role="alert">',
        '<i class="bi bi-exclamation-triangle" aria-hidden="true"></i> Invalid code. You can try entering it again.',
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join("")

    codeEntryAlert.append(codeEntryAlertWrapper)
}

function codeEntryError(visible) {
    if (visible) {
        createCodeEntryAlert()
    } else {
        codeEntryAlert.innerHTML = ""
    }
}

export function codeEntryVerify() {
    if (codeEntryInput.value == codeEntryActualCode) {
        console.log("code verified")
        codeEntryError(false)
        secretSettingsArea.hidden = false
        codeEntryArea.hidden = true
    } else {
        console.log("code NOT verified")
        codeEntryError(false)
        codeEntryError(true)
    }
}
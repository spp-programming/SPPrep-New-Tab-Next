"use strict"
import * as bootstrap from "../thirdparty/bootstrap.bundle.min.js"
import { startListeningOnGamepads, stopListeningOnGamepads } from "./gamepad-handler.js"
import { passcodeDialog, passcodeDialogInput, passcodeDialogInputClearButton, passcodeDialogControllerButtons, passcodeDialogVerifyButton, passcodeDialogPasscode, passcodeDialogTitle, passcodeDialogBody, passcodeDialogAlertWrapper } from "./global-constants.js"
const passcodeDialogBS = new bootstrap.Dialog(passcodeDialog)

export async function openPasscodeDialog() {
    const secretSettingsVisible = (await chrome.storage.local.get())["secretSettingsVisible"]
    if (secretSettingsVisible === true) {
        showSecretSettingsContent()
    } else {
        startListeningOnGamepads()
        document.addEventListener("gamepad-pressed", handleGamepadPressed)
    }
    passcodeDialogBS.show()
}

export async function enableSecretSettings() {
    await chrome.storage.local.set({ secretSettingsVisible: true })
}

function handleGamepadPressed(event) {
    passcodeDialogInput.value += event.detail?.code + " "
    passcodeDialogInput.scrollLeft = passcodeDialogInput.scrollWidth
}

function showSecretSettingsContent() {
    passcodeDialogTitle.innerText = "Secret Settings"
    passcodeDialogBody.innerHTML = "<h2>Secret Settings are enabled!</h2><p>They have been moved to a dedicated page.<br><a href=\"./secret-settings.html\">Check it out</a>.</p>"
    passcodeDialogVerifyButton.hidden = true
}

passcodeDialog.addEventListener("shown.bs.dialog", () => {
    console.log("resizing image map...")
    imageMapResize()
})

passcodeDialog.addEventListener("hidden.bs.dialog", () => {
    stopListeningOnGamepads()
    document.removeEventListener("gamepad-pressed", handleGamepadPressed)
})

Array.from(passcodeDialogControllerButtons).forEach(element => {
    element.addEventListener("click", () => {
        passcodeDialogInput.value += element.dataset.buttonCode + " "
        passcodeDialogInput.scrollLeft = passcodeDialogInput.scrollWidth
    })
})

passcodeDialogInputClearButton.addEventListener("click", () => {
    passcodeDialogInput.value = ""
})

passcodeDialogVerifyButton.addEventListener("click", () => {
    if (passcodeDialogInput.value === passcodeDialogPasscode) {
        console.log("passcode verified!")
        stopListeningOnGamepads()
        document.removeEventListener("gamepad-pressed", handleGamepadPressed)
        enableSecretSettings()
        showSecretSettingsContent()
    } else {
        console.log("passcode NOT verified!")
        passcodeDialogAlertWrapper.innerHTML = '<div class="alert theme-danger mt-5 mb-0" role="alert"><span><h4 class="alert-heading"><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> Incorrect passcode</h4><p>You can try entering the passcode again.</p></span><button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    }
})
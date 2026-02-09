"use strict"
import { passcodeModal, passcodeModalInput, passcodeModalInputClearButton, passcodeModalControllerButtons, passcodeModalVerifyButton, passcodeModalPasscode, passcodeModalTitle, passcodeModalBody, passcodeModalAlertWrapper } from "./global-constants.js"
const passcodeModalBS = new bootstrap.Modal(passcodeModal)

export async function openPasscodeModal() {
    const secretSettingsVisible = (await chrome.storage.local.get())["secretSettingsVisible"]
    if (secretSettingsVisible === true) {
        showSecretSettingsContent()
    }
    passcodeModalBS.show()
}

export async function enableSecretSettings() {
    await chrome.storage.local.set({ secretSettingsVisible: true })
}

function showSecretSettingsContent() {
    passcodeModalTitle.innerText = "Secret Settings"
    passcodeModalBody.innerHTML = "<h2>Secret Settings are enabled!</h2><p>They have been moved to a dedicated page.<br><a href=\"./secret-settings.html\">Check it out</a>.</p>"
    passcodeModalVerifyButton.hidden = true
}

passcodeModal.addEventListener("shown.bs.modal", () => {
    console.log("resizing image map...")
    imageMapResize()
})

Array.from(passcodeModalControllerButtons).forEach(element => {
    element.addEventListener("click", () => {
        passcodeModalInput.value += element.dataset.buttonCode + " "
    })
})

passcodeModalInputClearButton.addEventListener("click", () => {
    passcodeModalInput.value = ""
})

passcodeModalVerifyButton.addEventListener("click", () => {
    if (passcodeModalInput.value === passcodeModalPasscode) {
        console.log("passcode verified!")
        enableSecretSettings()
        showSecretSettingsContent()
    } else {
        console.log("passcode NOT verified!")
        passcodeModalAlertWrapper.innerHTML = '<div class="alert alert-danger alert-dismissible fade show mt-3 mb-0" role="alert"><h4 class="alert-heading"><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> Incorrect passcode</h4><p>You can try entering the passcode again.</p><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    }
})
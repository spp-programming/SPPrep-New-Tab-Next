"use strict"
import { passcodeModal, passcodeModalInput, passcodeModalInputClearButton, passcodeModalControllerButtons, passcodeModalVerifyButton, passcodeModalPasscode, passcodeModalTitle, passcodeModalBody } from "./global-constants.js"
const passcodeModalBS = new bootstrap.Modal(passcodeModal)

export function openPasscodeModal() {
    if (localStorage.getItem("secretSettingsVisible") === "true") {
        showSecretSettingsContent()
    }
    passcodeModalBS.show()
}

export function enableSecretSettings() {
    localStorage.setItem("secretSettingsVisible", "true")
}

function showSecretSettingsContent() {
    passcodeModalTitle.innerText = "Secret Settings"
    passcodeModalBody.innerHTML = "<h2>Secret Settings are enabled!</h2><p>Secret Settings have been moved to its own page.<br><a href=\"./secret-settings.html\">Check it out</a>.</p>"
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
    }
})
"use strict";
import { codeEntryVerify } from "./modules/secret-settings.js"
import { titleTextElement, codeConfirmButton, codeEntryArea, secretSettingsArea } from "./modules/popup-constants.js"

console.log(titleTextElement)
console.log(secretSettingsArea)

titleTextElement.addEventListener("dblclick", () => {
    if (secretSettingsArea.hidden === true) {
        codeEntryArea.hidden = false
    } else {
        secretSettingsArea.hidden = true
        localStorage.removeItem("secretSettingsVisible")
    }
})

codeConfirmButton.addEventListener("click", () => {
    console.log("code confirm button clicked!")
    codeEntryVerify()
    localStorage.setItem("secretSettingsVisible", "true")
})

if (localStorage.getItem("secretSettingsVisible") === "true") {
    secretSettingsArea.hidden = false
}
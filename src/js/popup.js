"use strict";
import { codeEntryVerify } from "./modules/secret-settings.js"
import { codeConfirmButton, codeEntryArea, secretSettingsArea } from "./modules/popup-constants.js"

codeConfirmButton.addEventListener("click", () => {
    console.log("code confirm button clicked!")
    codeEntryVerify()
})

if (localStorage.getItem("secretSettingsVisible")) {
    secretSettingsArea.hidden = false
} else {
    codeEntryArea.hidden = false
}
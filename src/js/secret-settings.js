"use strict";
import { secretSettingsContent, secretSettingsDisabledContent } from "./modules/secret-settings-constants.js"
import { handleFakeLinks } from "./modules/fake-links.js"

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerElement => new bootstrap.Tooltip(tooltipTriggerElement))

if (localStorage.getItem("secretSettingsVisible") === "true") {
    secretSettingsContent.hidden = false
} else {
    secretSettingsDisabledContent.hidden = false
}

handleFakeLinks()
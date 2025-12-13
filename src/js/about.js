"use strict"
import { handleFakeLinks } from "./modules/fake-links.js"
import { internalConfigModeText } from "./modules/about-constants.js"
import { getInternalConfigMode } from "./modules/config-mode.js"

handleFakeLinks()

switch (await getInternalConfigMode()) {
    case "student":
        internalConfigModeText.innerHTML = "Student"
        internalConfigModeText.title = "You're running the student version of the extension."
        break;
    case "staff":
        internalConfigModeText.innerHTML = "Staff"
        internalConfigModeText.title = "You're running the staff version of the extension."
        break;
    default:
        internalConfigModeText.innerHTML = "⚠️ Unknown"
        internalConfigModeText.title = "Unable to determine internal config mode, you may experience issues."
        break;
}

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerElement => new bootstrap.Tooltip(tooltipTriggerElement))
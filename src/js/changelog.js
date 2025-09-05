"use strict"
import { handleFakeLinks } from "./modules/fake-links.js"

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerElement => new bootstrap.Tooltip(tooltipTriggerElement))
const secretItems = document.getElementsByClassName("secret-item")

handleFakeLinks()
async function handleSecretSettingsVisibility() {
    const secretSettingsVisible = (await chrome.storage.local.get())["secretSettingsVisible"]

    if (secretSettingsVisible === "true") {
        Array.from(secretItems).forEach(element => {
            element.hidden = false
        })
    }
}
handleSecretSettingsVisibility()
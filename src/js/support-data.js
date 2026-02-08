"use strict"
import { collectSupportDataButton, githubNavLink } from "./modules/support-data-constants.js"

let internalConfigMode = ""
const errorsEncountered = []

try {
    new bootstrap.Tooltip(githubNavLink)
    let globalConstants
    let internalConfigFileData
    try {
        globalConstants = await import("./modules/global-constants.js")
        internalConfigFileData = await import(globalConstants.internalConfigFile, { with: { type: "json" } })
    } catch (error) {
        throw Error(`Could not import internalConfigFile: ${error}`)
    }
    if (typeof(internalConfigFileData.default.configMode) !== "string") {
        throw Error(`Invalid configMode type: ${typeof(internalConfigFileData.default.configMode)}`)
    }
    switch (internalConfigFileData.default.configMode) {
        case "student":
            console.log("internalConfigMode is \"student\"")
            internalConfigMode = "student"
            break
        case "staff":
            console.log("internalConfigMode is \"staff\"")
            internalConfigMode = "staff"
            break
        default:
            throw Error(`Invalid configMode value: ${internalConfigFileData.default.configMode}`)
    }
} catch (error) {
    alert(`Oops, something went wrong. This is not supposed to be happening! You can still collect support data by pressing the button below, you can submit the support data file to help us troubleshoot this issue.\n\n${error}`)
    console.error(error)
    errorsEncountered.push(JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))))
}

collectSupportDataButton.addEventListener("click", () => {
    try {
        // Stolen from https://stackoverflow.com/a/23167789
        chrome.storage.local.get(null, async (items) => {
            const data = {
                supportDataVersion: 2,
                extensionVersion: chrome.runtime.getManifest().version,
                extensionId: chrome.runtime.id,
                platformInfo: await chrome.runtime.getPlatformInfo(),
                internalConfigMode: internalConfigMode,
                date: Date.now(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                extensionStorage: items,
                localStorage: localStorage,
                errorsEncountered: errorsEncountered
            }
            const result = JSON.stringify(data)
            const url = "data:application/json;base64," + btoa(result)
            const bogusAnchor = document.createElement("a")
            bogusAnchor.href = url
            bogusAnchor.download = "supportData.json"
            bogusAnchor.style.display = "none"
            document.body.appendChild(bogusAnchor)
            bogusAnchor.click()
            bogusAnchor.remove()
        })
    } catch (error) {
        alert(`Oops, something went wrong while collecting support data. This is not supposed to be happening! Please include the message that is displayed below in your issue report.\n\n${error}`)
        console.error(error)
    }
})

window.addEventListener("unhandledrejection", (error) => {
    alert(`Oops, something went wrong while collecting support data. This is not supposed to be happening! Please include the message that is displayed below in your issue report.\n\nUnhandled promise rejection:\n${error.reason}`)
})
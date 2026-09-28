"use strict"
import { handleFakeLinks } from "./modules/fake-links.js"
import { buildInfoCommit, buildInfoCommitURLBase, buildInfoEdition, buildInfoError, buildInfoName, buildInfoRevision, buildInfoVersion, internalConfigModeText } from "./modules/about-constants.js"
import { getInternalConfigMode } from "./modules/config-mode.js"
import { getBuildInfo } from "./modules/build-info.js"

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

let buildInfo
try {
    buildInfo = await getBuildInfo()
    buildInfoVersion.innerHTML = ""
    if (typeof buildInfo.version === "string") {
        buildInfoVersion.innerText = buildInfo.version
    } else {
        buildInfoVersion.innerText = "(not available)"
    }
    buildInfoName.innerHTML = ""
    const versionName = chrome.runtime.getManifest().version_name
    if (typeof versionName === "string") {
        buildInfoName.innerText = chrome.runtime.getManifest().version_name
    } else {
        buildInfoName.innerText = "(not available)"
    }
    buildInfoEdition.innerHTML = ""
    if (typeof buildInfo.edition) {
        buildInfoEdition.innerText = buildInfo.edition
    } else {
        buildInfoEdition.innerText = "(not available)"
    }
    buildInfoRevision.innerHTML = ""
    if (typeof buildInfo.revision === "string") {
        buildInfoRevision.innerText = buildInfo.revision
    } else {
        buildInfoRevision.innerText = "(not available)"
    }
    buildInfoCommit.innerHTML = ""
    if (typeof buildInfo.fullRevision === "string") {
        const buildInfoCommitLink = document.createElement("a")
        buildInfoCommitLink.target = "_blank"
        buildInfoCommitLink.href = (new URL(buildInfo.fullRevision, buildInfoCommitURLBase)).toString()
        buildInfoCommitLink.innerText = `${buildInfo.fullRevision} (opens in GitHub)`
        buildInfoCommit.appendChild(buildInfoCommitLink)
    } else {
        buildInfoCommit.innerText = "(not available)"
    }
} catch (error) {
    console.error(error)
    buildInfoError.hidden = false
    buildInfoVersion.parentElement.hidden = true
    buildInfoName.parentElement.hidden = true
    buildInfoEdition.parentElement.hidden = true
    buildInfoRevision.parentElement.hidden = true
    buildInfoCommit.parentElement.hidden = true
}
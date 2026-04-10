"use strict"
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerElement => new bootstrap.Popover(popoverTriggerElement))

/**
 * This function sets the content of a Bootstrap popover.
 * @param {(HTMLElement | string)} triggerElement HTML element (`HTMLElement`) or a CSS selector (`string`) that represents the popover's trigger element
 * @param {string} content The content of the popover in question
 */
export function setPopoverText(triggerElement, content) {
    const popover = bootstrap.Popover.getInstance(triggerElement)
    popover._config.content = content
    popover.setContent()
}

import { getTodaysEvents, dateString, getCurrentDateString } from "./modules/calendar-api.js"
import { getLetterDay } from "./modules/letter-day-extractor.js"
import { updateTime12hour, updateTime24hour, updateTimeAmPm } from "./modules/clock-manager.js"
import { letterDayElement, sealElement, errorToast, currentTimeZone, errorToastContent, powerSchoolButton, powerSchoolTeacherURL, powerSchoolStudentURL, backgroundBliss, backgroundOsxLeopard, backgroundOsxTiger, backgroundOsxLion, backgroundOsxYosemite, backgroundMscBuilding, backgroundSnow, backgroundSnowLowQuality, backgroundStaffStaring, backgroundStreetView, backgroundStreetViewBetter, backgroundRainbow, validFonts, schoolCalendarButton, customLinkTemplate, buttonContainer, previewLayoutToastSelected, previewLayoutToast, clubHubButton, clockElement, contentElement, backgroundElement, backgroundOverlay, backgroundMissingTexture } from "./modules/global-constants.js"
import { openPasscodeModal } from "./modules/passcode-modal.js"
import { handleFakeLinks } from "./modules/fake-links.js"
import { runMigrations } from "./modules/migrations.js"
import { getInternalConfigMode } from "./modules/config-mode.js"
import { getSeasonalBackground } from "./modules/seasonal-backgrounds.js"
import { handleTourButton } from "./tour.js"

let checkLetterDayChangeInterval

async function loadLetterDay() {
    try {
        const todaysEvents = await getTodaysEvents()
        let letterDay = getLetterDay(todaysEvents)
        console.log(`Current Letter Day: ${letterDay}`)
        switch (letterDay) {
            case "🤷‍♂️":
                // "US/Eastern" and "EST5EDT" are linked to "America/New_York" so we have to check for them too. This may not be necessary, but I don't care. https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
                if (currentTimeZone == "America/New_York" || currentTimeZone == "US/Eastern" || currentTimeZone == "EST5EDT") {
                    setPopoverText(letterDayElement, `No letter day found for today.<div class="form-text">Last updated on ${(new Date()).toLocaleString("en-US")}. Refresh the page to check again.</div>`)
                } else {
                    setPopoverText(letterDayElement, `<div class="form-text">⚠️ This letter day is based on Prep's time zone, which doesn't match yours (${currentTimeZone}). <a href="https://github.com/spp-programming/SPPrep-New-Tab-Next/wiki/Handling-time-zone-issues">Learn more</a></div>No letter day found for today.<div class="form-text">Last updated on ${(new Date()).toLocaleString("en-US")} in your local time zone. Refresh the page to check again.</div>`)
                    letterDay = `⚠️ ${letterDay}`
                }
                break
            case "😐":
                setPopoverText(letterDayElement, "Multiple letter days were found for today.<br>This is most probably a bug.")
                break
            default:
                // "US/Eastern" and "EST5EDT" are linked to "America/New_York" so we have to check for them too. This may not be necessary, but I don't care. https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
                if (currentTimeZone == "America/New_York" || currentTimeZone == "US/Eastern" || currentTimeZone == "EST5EDT") {
                    setPopoverText(letterDayElement, `The current letter day is ${letterDay}-DAY.<div class="form-text">Last updated on ${(new Date()).toLocaleString("en-US")}. Refresh the page to check again.</div>`)
                } else {
                    setPopoverText(letterDayElement, `<div class="form-text">⚠️ This letter day is based on Prep's time zone, which doesn't match yours (${currentTimeZone}). <a href="https://github.com/spp-programming/SPPrep-New-Tab-Next/wiki/Handling-time-zone-issues">Learn more</a></div>The current letter day is ${letterDay}-DAY.<div class="form-text">Last updated on ${(new Date()).toLocaleString("en-US")} in your local time zone. Refresh the page to check again.</div>`)
                    letterDay = `⚠️ ${letterDay}`
                }
            letterDay = `${letterDay}-DAY`
        }
        letterDayElement.innerHTML = letterDay
        checkLetterDayChangeInterval = setInterval(checkLetterDayChange, 1)
    } catch (error) {
        console.log(error)
        letterDayElement.innerHTML = "🤯"
        if (navigator.onLine === false) {
            setPopoverText(letterDayElement, "No internet connection!<br>Hit refresh to try again.")
            errorToastContent.innerHTML = "🤯 Couldn't query School Calendar.<div class=\"form-text\">Check your internet connection. To try querying it again, refresh the page.</div>"
        } else {
            setPopoverText(letterDayElement, "Woah! Something went wrong.<br>Hit refresh to try again.")
            errorToastContent.innerHTML = "🤯 Couldn't query School Calendar.<div class=\"form-text\">To try querying it again, refresh the page.</div>"
        }
        bootstrap.Toast.getOrCreateInstance(errorToast).show()
    }
}

function checkLetterDayChange() {
    if (getCurrentDateString() !== dateString) {
        console.log("date changed!")
        console.log(`start date: ${dateString}`)
        console.log(`current date: ${getCurrentDateString()}`)
        letterDayElement.innerHTML = "⚠️"
        setPopoverText(letterDayElement, "Date changed!<br><span class=\"form-text\">To load the letter day, refresh the page.</span>")
        clearInterval(checkLetterDayChangeInterval)
    }
}

async function applyInternalConfigModeChanges() {
    const internalConfigMode = await getInternalConfigMode()
    switch (internalConfigMode) {
        case "student":
            powerSchoolButton.href = powerSchoolStudentURL
            break
        case "staff":
            powerSchoolButton.href = powerSchoolTeacherURL
            break
    }
}

async function loadLayoutSettings() {
    try {
        const storedSettingsEnableSplitLayoutSelection = (await chrome.storage.local.get())["settings_enableSplitLayoutSelection"]
        if (new URLSearchParams(document.location.search).get("preview-layout") === "split") {
            previewLayoutToastSelected.innerText = "split"
            bootstrap.Toast.getOrCreateInstance(previewLayoutToast).show()
        }
        if (new URLSearchParams(document.location.search).get("preview-layout") === "stacked") {
            previewLayoutToastSelected.innerText = "stacked"
            bootstrap.Toast.getOrCreateInstance(previewLayoutToast).show()
        } else if (storedSettingsEnableSplitLayoutSelection === true || new URLSearchParams(document.location.search).get("preview-layout") === "split") {
            backgroundOverlay.hidden = true
            contentElement.classList.add("split-layout")
            buttonContainer.classList.add("split-layout")
        }
    } catch (error) {
        console.error(error)
        alert(`Oops, something went wrong while loading layout settings. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}`)
    }
}

async function loadFontSettings() {
    try {
        const storedSecretSettingsFontSelection = (await chrome.storage.local.get())["secretSettings_fontSelection"]
        if (validFonts.includes(storedSecretSettingsFontSelection)) {
            document.documentElement.classList.add(`font-${storedSecretSettingsFontSelection}`)
        } else {
            document.documentElement.classList.add("font-azeret-mono")
        }
        clockElement.classList.add("fade-in")
        letterDayElement.classList.add("fade-in")
    } catch (error) {
        console.error(error)
        alert(`Oops, something went wrong while loading font settings. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}`)
    }
}

async function loadButtonSettings() {
    try {
        const storedSettingsHideSchoolCalendarSelection = (await chrome.storage.local.get())["settings_hideSchoolCalendarSelection"]
        const storedSettingsHideClubHubSelection = (await chrome.storage.local.get())["settings_hideClubHubSelection"]
        const storedSettingsEnableCustomLinksSelection = (await chrome.storage.local.get())["settings_enableCustomLinksSelection"]
        const storedSettingsCustomLink1Enabled = (await chrome.storage.local.get())["settings_customLink1Enabled"]
        const storedSettingsCustomLink2Enabled = (await chrome.storage.local.get())["settings_customLink2Enabled"]
        const storedSettingsCustomLink3Enabled = (await chrome.storage.local.get())["settings_customLink3Enabled"]
        const storedSettingsCustomLink1IconURL = (await chrome.storage.local.get())["settings_customLink1IconURL"]
        const storedSettingsCustomLink2IconURL = (await chrome.storage.local.get())["settings_customLink2IconURL"]
        const storedSettingsCustomLink3IconURL = (await chrome.storage.local.get())["settings_customLink3IconURL"]
        const storedSettingsCustomLink1Name = (await chrome.storage.local.get())["settings_customLink1Name"]
        const storedSettingsCustomLink2Name = (await chrome.storage.local.get())["settings_customLink2Name"]
        const storedSettingsCustomLink3Name = (await chrome.storage.local.get())["settings_customLink3Name"]
        const storedSettingsCustomLink1URL = (await chrome.storage.local.get())["settings_customLink1URL"]
        const storedSettingsCustomLink2URL = (await chrome.storage.local.get())["settings_customLink2URL"]
        const storedSettingsCustomLink3URL = (await chrome.storage.local.get())["settings_customLink3URL"]
        if (storedSettingsHideSchoolCalendarSelection === true) {
            schoolCalendarButton.hidden = true
        }
        if (storedSettingsHideClubHubSelection === true) {
            clubHubButton.hidden = true
        }
        if (storedSettingsEnableCustomLinksSelection === true) {
            if (storedSettingsCustomLink1Enabled === true && typeof(storedSettingsCustomLink1URL) === "string") {
                let name = "Custom link #1"
                let iconURL = "./img/icons/globe2.svg"
                const url = storedSettingsCustomLink1URL
                if (typeof(storedSettingsCustomLink1Name) === "string" && storedSettingsCustomLink1Name.trim() !== "") {
                    name = storedSettingsCustomLink1Name.trim()
                }
                if (typeof(storedSettingsCustomLink1IconURL) === "string") {
                    iconURL = storedSettingsCustomLink1IconURL
                }
                const content = customLinkTemplate.content.firstElementChild.cloneNode(true)
                content.title = name
                content.href = url
                content.querySelector("img").src = iconURL
                buttonContainer.appendChild(content)
                new bootstrap.Tooltip(content)
            }
            if (storedSettingsCustomLink2Enabled === true && typeof(storedSettingsCustomLink1URL) === "string") {
                let name = "Custom link #2"
                let iconURL = "./img/icons/globe2.svg"
                const url = storedSettingsCustomLink2URL
                if (typeof(storedSettingsCustomLink2Name) === "string" && storedSettingsCustomLink2Name.trim() !== "") {
                    name = storedSettingsCustomLink2Name.trim()
                }
                if (typeof(storedSettingsCustomLink2IconURL) === "string") {
                    iconURL = storedSettingsCustomLink2IconURL
                }
                const content = customLinkTemplate.content.firstElementChild.cloneNode(true)
                content.title = name
                content.href = url
                content.querySelector("img").src = iconURL
                buttonContainer.appendChild(content)
                new bootstrap.Tooltip(content)
            }
            if (storedSettingsCustomLink3Enabled === true && typeof(storedSettingsCustomLink1URL) === "string") {
                let name = "Custom link #3"
                let iconURL = "./img/icons/globe2.svg"
                const url = storedSettingsCustomLink3URL
                if (typeof(storedSettingsCustomLink3Name) === "string" && storedSettingsCustomLink3Name.trim() !== "") {
                    name = storedSettingsCustomLink3Name.trim()
                }
                if (typeof(storedSettingsCustomLink3IconURL) === "string") {
                    iconURL = storedSettingsCustomLink3IconURL
                }
                const content = customLinkTemplate.content.firstElementChild.cloneNode(true)
                content.title = name
                content.href = url
                content.querySelector("img").src = iconURL
                buttonContainer.appendChild(content)
                new bootstrap.Tooltip(content)
            }
        }
        buttonContainer.classList.add("fade-in")
    } catch (error) {
        console.error(error)
        alert(`Oops, something went wrong while loading button settings. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}`)
    }
}

async function loadBackgroundSettings() {
    try {
        const storedSecretSettingsBackgroundSelection = (await chrome.storage.local.get())["secretSettings_backgroundSelection"]
        const storedSecretSettingsCustomBackground = (await chrome.storage.local.get())["secretSettings_customBackground"]
        const storedSecretSettingsGradientSelection = (await chrome.storage.local.get())["secretSettings_gradientSelection"]
        const storedSecretSettingsGradientDisabled = (await chrome.storage.local.get())["secretSettings_gradientDisabled"]
        const staticBackground = document.createElement("img")
        staticBackground.id = "static-background"
        staticBackground.alt = ""
        staticBackground.ariaHidden = true
        switch (storedSecretSettingsBackgroundSelection) {
            case "custom":
                if (storedSecretSettingsCustomBackground !== undefined) {
                    try {
                        const backgroundData = await fetch(storedSecretSettingsCustomBackground)
                        const contentType = backgroundData.headers.get("Content-Type")
                        if (contentType.startsWith("image/") === true) {
                            const backgroundBlob = await backgroundData.blob()
                            staticBackground.src = URL.createObjectURL(backgroundBlob)
                            backgroundElement.appendChild(staticBackground)
                        }
                        if (contentType.startsWith("video/") === true) {
                            const videoBackground = document.createElement("video")
                            videoBackground.id = "video-background"
                            videoBackground.autoplay = true
                            videoBackground.muted = true
                            videoBackground.loop = true
                            videoBackground.playsInline = true
                            videoBackground.tabIndex = -1
                            videoBackground.ariaHidden = true
                            const videoBackgroundSource = document.createElement("source")
                            const backgroundBlob = await backgroundData.blob()
                            videoBackgroundSource.src = URL.createObjectURL(backgroundBlob)
                            videoBackground.appendChild(videoBackgroundSource)
                            backgroundElement.appendChild(videoBackground)
                        }
                    } catch (error) {
                        // If fetch() fails for whatever reason (for example, on an invalid data URL), just log the error but move on with the rest of the function.
                        console.error(error)
                    }
                }
                break
            // Yes, the extra dot in the URL is intentional. This shit is so stupid
            case "seasonal":
                staticBackground.src = `.${getSeasonalBackground((new Date()).getMonth(), (new Date()).getDate())}`
                backgroundElement.appendChild(staticBackground)
                break
            case "bliss":
                staticBackground.src = `.${backgroundBliss}`
                backgroundElement.appendChild(staticBackground)
                break
            case "osx-tiger":
                staticBackground.src = `.${backgroundOsxTiger}`
                backgroundElement.appendChild(staticBackground)
                break
            case "osx-leopard":
                staticBackground.src = `.${backgroundOsxLeopard}`
                backgroundElement.appendChild(staticBackground)
                break
            case "osx-lion":
                staticBackground.src = `.${backgroundOsxLion}`
                backgroundElement.appendChild(staticBackground)
                break
            case "osx-yosemite":
                staticBackground.src = `.${backgroundOsxYosemite}`
                backgroundElement.appendChild(staticBackground)
                break
            case "msc-building":
                staticBackground.src = `.${backgroundMscBuilding}`
                backgroundElement.appendChild(staticBackground)
                break
            case "snow":
                staticBackground.src = `.${backgroundSnow}`
                backgroundElement.appendChild(staticBackground)
                break
            case "snow-low-quality":
                staticBackground.src = `.${backgroundSnowLowQuality}`
                backgroundElement.appendChild(staticBackground)
                break
            case "original-fall-winter":
                staticBackground.src = `.${backgroundStaffStaring}`
                backgroundElement.appendChild(staticBackground)
                break
            case "street-view":
                staticBackground.src = `.${backgroundStreetView}`
                backgroundElement.appendChild(staticBackground)
                break
            case "street-view-better":
                staticBackground.src = `.${backgroundStreetViewBetter}`
                backgroundElement.appendChild(staticBackground)
                break
            case "rainbow":
                staticBackground.src = `.${backgroundRainbow}`
                backgroundElement.appendChild(staticBackground)
                break
            case "missing-texture":
                staticBackground.src = `.${backgroundMissingTexture}`
                backgroundElement.appendChild(staticBackground)
                break
            default:
                staticBackground.src = `.${getSeasonalBackground((new Date()).getMonth(), (new Date()).getDate())}`
                backgroundElement.appendChild(staticBackground)
        }
        if (/^#[0-9A-F]{6}$/i.test(storedSecretSettingsGradientSelection)) {
            document.documentElement.style.setProperty("--gradient-color", storedSecretSettingsGradientSelection)
        } else {
            document.documentElement.style.setProperty("--gradient-color", "#9b042a")
        }
        if (storedSecretSettingsGradientDisabled === true) {
            backgroundOverlay.hidden = true
        }
        backgroundElement.classList.add("fade-in")
    } catch (error) {
        console.error(error)
        alert(`Oops, something went wrong while loading background settings. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}`)
    }
}

async function handleClock() {
    try {
        const storedSettingsClockModeSelection = (await chrome.storage.local.get())["settings_clockModeSelection"]
        switch (storedSettingsClockModeSelection) {
            case "12hour":
                console.log("Using the \"12hour\" clock mode. (set from extension storage)")
                updateTime12hour()
                setInterval(updateTime12hour, 1)
                break
            case "ampm":
                console.log("Using the \"ampm\" clock mode. (set from extension storage)")
                updateTimeAmPm()
                setInterval(updateTimeAmPm, 1)
                break
            case "24hour":
                console.log("Using the \"24hour\" clock mode. (set from extension storage)")
                updateTime24hour()
                setInterval(updateTime24hour, 1)
                break
            default:
                console.log("Using the default clock mode.")
                updateTime12hour()
                setInterval(updateTime12hour, 1)
        }
    } catch (error) {
        console.error(error)
        alert(`Oops, something went wrong while loading clock settings. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}`)
    }
}

async function loadStuff() {
    await runMigrations()
    handleFakeLinks()
    loadLetterDay() // Don't use await here, we don't want to wait for this to finish before continuing.
    applyInternalConfigModeChanges()
    handleClock()
    loadLayoutSettings()
    loadButtonSettings()
    loadFontSettings()
    loadBackgroundSettings()
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerElement => new bootstrap.Tooltip(tooltipTriggerElement))
    handleTourButton()
}

sealElement.addEventListener("dblclick", () => {
    console.log("open passcode modal")
    openPasscodeModal()
})

loadStuff()
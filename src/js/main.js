"use strict"
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerElement => new bootstrap.Popover(popoverTriggerElement))

function setPopoverText(triggerElement, content) {
    const popover = bootstrap.Popover.getInstance(triggerElement)
    popover._config.content = content
    popover.setContent()
}

import { getTodaysEvents, dateString, getCurrentDateString } from "./modules/calendar-api.js"
import { getLetterDay } from "./modules/letter-day-extractor.js"
import { updateTime } from "./modules/clock-manager.js"
import { clockElement, letterDayElement, emblemElement, errorToast, currentTimeZone, errorToastContent, powerSchoolButton, powerSchoolTeacherURL, powerSchoolStudentURL, backgroundBliss, backgroundOsxLeopard, backgroundOsxTiger, backgroundOsxLion, backgroundOsxYosemite, backgroundMscBuilding, backgroundSnow, backgroundSnowLowQuality, backgroundStaffStaring, backgroundStreetView, backgroundStreetViewBetter, backgroundRainbow, validFonts, schoolCalendarButton, customLinkTemplate, buttonContainer } from "./modules/global-constants.js"
import { openPasscodeModal } from "./modules/passcode-modal.js"
import { handleFakeLinks } from "./modules/fake-links.js"
import { runMigrations } from "./modules/migrations.js"
import { getInternalConfigMode } from "./modules/config-mode.js"
import { getSeasonalBackground } from "./modules/seasonal-backgrounds.js"

let checkLetterDayChangeInterval

async function loadLetterDay() {
    try {
        const todaysEvents = await getTodaysEvents()
        let letterDay = getLetterDay(todaysEvents)
        console.log(`Current Letter Day: ${letterDay}`)
        switch (letterDay) {
            case "🤷‍♂️":
                setPopoverText(letterDayElement, "No letter day found for today.<br>Hit refresh to try again.")
                break
            case "😐":
                setPopoverText(letterDayElement, "Multiple letter days were found for today.<br>This is most probably a bug.")
                break
            default:
                // "US/Eastern" and "EST5EDT" are linked to "America/New_York" so we have to check for them too. This may not be necessary, but I don't care. https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
                if (currentTimeZone == "America/New_York" || currentTimeZone == "US/Eastern" || currentTimeZone == "EST5EDT") {
                    setPopoverText(letterDayElement, `The current letter day is ${letterDay}-DAY. Last updated on: ${(new Date()).toLocaleString("en-US")} (refresh to update)`)
                } else {
                    setPopoverText(letterDayElement, `⚠️ This letter day is based on Prep's time zone, which doesn't match yours (${currentTimeZone})<br>The current letter day is ${letterDay}-DAY.<br>Last updated on: ${(new Date()).toLocaleString()} (your local time, refresh to update)`)
                    letterDay = `⚠️ ${letterDay}`
                }
            letterDay = `${letterDay}-DAY`
        }
        letterDayElement.innerHTML = letterDay
        checkLetterDayChangeInterval = setInterval(checkLetterDayChange, 1)
    } catch (e) {
        console.log(e)
        letterDayElement.innerHTML = "🤯"
        setPopoverText(letterDayElement, "Woah! Something went wrong.<br>Hit refresh to try again.")
        errorToastContent.innerHTML = "Couldn't query School Calendar.<br>Refresh the page to try again"
        bootstrap.Toast.getOrCreateInstance(errorToast).show()
    }
}

function checkLetterDayChange() {
    if (getCurrentDateString() !== dateString) {
        console.log("date changed!")
        console.log(`start date: ${dateString}`)
        console.log(`current date: ${getCurrentDateString()}`)
        letterDayElement.innerHTML = "⚠️"
        setPopoverText(letterDayElement, "Date changed.<br>Refresh the page to load today's letter day.")
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
    if (internalConfigMode === "staff") {
        powerSchoolButton.href = powerSchoolTeacherURL
    }
}

async function loadAllSettings() {
    const storedSettingsHideSchoolCalendarSelection = (await chrome.storage.local.get())["settings_hideSchoolCalendarSelection"]
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
    const storedSecretSettingsBackgroundSelection = (await chrome.storage.local.get())["secretSettings_backgroundSelection"]
    const storedSecretSettingsCustomBackground = (await chrome.storage.local.get())["secretSettings_customBackground"]
    const storedSecretSettingsFontSelection = (await chrome.storage.local.get())["secretSettings_fontSelection"]
    const storedSecretSettingsGradientSelection = (await chrome.storage.local.get())["secretSettings_gradientSelection"]
    if (storedSettingsHideSchoolCalendarSelection === true) {
        schoolCalendarButton.hidden = true
    }
    if (storedSettingsEnableCustomLinksSelection === true) {
        if (storedSettingsCustomLink1Enabled === true && storedSettingsCustomLink1URL !== undefined) {
            let name = "Custom link #1"
            let iconURL = "./img/icons/globe2.svg"
            const url = storedSettingsCustomLink1URL
            if (storedSettingsCustomLink1Name !== undefined && storedSettingsCustomLink1Name.trim() !== "") {
                name = storedSettingsCustomLink1Name.trim()
            }
            if (storedSettingsCustomLink1IconURL !== undefined) {
                iconURL = storedSettingsCustomLink1IconURL
            }
            const content = customLinkTemplate.content.firstElementChild.cloneNode(true)
            content.title = name
            content.href = url
            content.querySelector("img").src = iconURL
            buttonContainer.appendChild(content)
        }
        if (storedSettingsCustomLink2Enabled === true && storedSettingsCustomLink2URL !== undefined) {
            let name = "Custom link #2"
            let iconURL = "./img/icons/globe2.svg"
            const url = storedSettingsCustomLink2URL
            if (storedSettingsCustomLink2Name !== undefined && storedSettingsCustomLink2Name.trim() !== "") {
                name = storedSettingsCustomLink2Name.trim()
            }
            if (storedSettingsCustomLink2IconURL !== undefined) {
                iconURL = storedSettingsCustomLink2IconURL
            }
            const content = customLinkTemplate.content.firstElementChild.cloneNode(true)
            content.title = name
            content.href = url
            content.querySelector("img").src = iconURL
            buttonContainer.appendChild(content)
        }
        if (storedSettingsCustomLink3Enabled === true && storedSettingsCustomLink3URL !== undefined) {
            let name = "Custom link #3"
            let iconURL = "./img/icons/globe2.svg"
            const url = storedSettingsCustomLink3URL
            if (storedSettingsCustomLink3Name !== undefined && storedSettingsCustomLink3Name.trim() !== "") {
                name = storedSettingsCustomLink3Name.trim()
            }
            if (storedSettingsCustomLink3IconURL !== undefined) {
                iconURL = storedSettingsCustomLink3IconURL
            }
            const content = customLinkTemplate.content.firstElementChild.cloneNode(true)
            content.title = name
            content.href = url
            content.querySelector("img").src = iconURL
            buttonContainer.appendChild(content)
        }
    }
    switch (storedSecretSettingsBackgroundSelection) {
        case "custom":
            if (storedSecretSettingsCustomBackground !== undefined) {
                try {
                    const backgroundBlob = (await (await fetch(storedSecretSettingsCustomBackground)).blob())
                    document.documentElement.style.setProperty("--selected-background", `url("${URL.createObjectURL(backgroundBlob)}")`)
                } catch (error) {
                    // If fetch() fails for whatever reason (for example, on an invalid data URL), just log the error but move on with the rest of the function.
                    console.error(error)
                }
            }
            break
        // Yes, the extra dot in the URL is intentional. This shit is so stupid
        case "seasonal":
            document.documentElement.style.setProperty("--selected-background", `url(".${getSeasonalBackground((new Date()).getMonth(), (new Date()).getDate())}")`)
            break
        case "bliss":
            document.documentElement.style.setProperty("--selected-background", `url(".${backgroundBliss}")`)
            break
        case "osx-tiger":
            document.documentElement.style.setProperty("--selected-background", `url(".${backgroundOsxTiger}")`)
            break
        case "osx-leopard":
            document.documentElement.style.setProperty("--selected-background", `url(".${backgroundOsxLeopard}")`)
            break
        case "osx-lion":
            document.documentElement.style.setProperty("--selected-background", `url(".${backgroundOsxLion}")`)
            break
        case "osx-yosemite":
            document.documentElement.style.setProperty("--selected-background", `url(".${backgroundOsxYosemite}")`)
            break
        case "msc-building":
            document.documentElement.style.setProperty("--selected-background", `url(".${backgroundMscBuilding}")`)
            break
        case "snow":
            document.documentElement.style.setProperty("--selected-background", `url(".${backgroundSnow}")`)
            break
        case "snow-low-quality":
            document.documentElement.style.setProperty("--selected-background", `url(".${backgroundSnowLowQuality}")`)
            break
        case "original-fall-winter":
            document.documentElement.style.setProperty("--selected-background", `url(".${backgroundStaffStaring}")`)
            break
        case "street-view":
            document.documentElement.style.setProperty("--selected-background", `url(".${backgroundStreetView}")`)
            break
        case "street-view-better":
            document.documentElement.style.setProperty("--selected-background", `url(".${backgroundStreetViewBetter}")`)
            break
        case "rainbow":
            document.documentElement.style.setProperty("--selected-background", `url(".${backgroundRainbow}")`)
            break
        default:
            document.documentElement.style.setProperty("--selected-background", `url(".${getSeasonalBackground((new Date()).getMonth(), (new Date()).getDate())}")`)
    }
    if (validFonts.includes(storedSecretSettingsFontSelection)) {
        document.documentElement.classList.add(`font-${storedSecretSettingsFontSelection}`)
    } else {
        document.documentElement.classList.add("font-azeret-mono")
    }
    if (/^#[0-9A-F]{6}$/i.test(storedSecretSettingsGradientSelection)) {
        document.documentElement.style.setProperty("--gradient-color", storedSecretSettingsGradientSelection)
    } else {
        document.documentElement.style.setProperty("--gradient-color", "#9b042a")
    }
}

function updateTimeHere() {
    // This function serves as a CORS workaround when used in setInterval.
    updateTime(clockElement)
}

async function loadStuff() {
    await runMigrations()
    handleFakeLinks()
    loadLetterDay() // Don't use await here, we don't want to wait for this to finish before continuing.
    applyInternalConfigModeChanges()
    updateTimeHere()
    setInterval(updateTimeHere, 1) // Calling updateTime every 1000 ms causes noticeable lag (many milliseconds) so it is called every millisecond to avoid this problem
    await loadAllSettings()
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerElement => new bootstrap.Tooltip(tooltipTriggerElement))
}

emblemElement.addEventListener("dblclick", () => {
    console.log("open passcode modal")
    openPasscodeModal()
})

loadStuff()
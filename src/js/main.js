"use strict";
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerElement => new bootstrap.Popover(popoverTriggerElement))

function setPopoverText(triggerElement, content) {
    const popover = bootstrap.Popover.getInstance(triggerElement)
    popover._config.content = content
    popover.setContent()
}

import { getTodaysEvents } from "./modules/calendar-api.js"
import { getLetterDay } from "./modules/letter-day-extractor.js"
import { updateTime } from "./modules/clock-manager.js"
import { clockElement, letterDayElement, emblemElement, errorToast, currentTimeZone, errorToastContent } from "./modules/global-constants.js"

async function loadLetterDay() {
    try {
        const todaysEvents = await getTodaysEvents()
        let letterDay = getLetterDay(todaysEvents)
        console.log(`Current Letter Day: ${letterDay}`)
        switch (letterDay) {
            case "🤷‍♂️":
                setPopoverText(letterDayElement, "No letter day found for today. Hit refresh to try again.")
                break
            case "😐":
                setPopoverText(letterDayElement, "Multiple letter days were found for today. This is most probably a bug.")
                break
            default:
                // "US/Eastern" and "EST5EDT" are linked to "America/New_York" so we have to check for them too. This may not be necessary, but I don't care. https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
                if (currentTimeZone == "America/New_York" || currentTimeZone == "US/Eastern" || currentTimeZone == "EST5EDT") {
                    setPopoverText(letterDayElement, `The current letter day is ${letterDay}-DAY. Last updated on: ${(new Date()).toLocaleString("en-US")} (refresh to update)`)
                } else {
                    setPopoverText(letterDayElement, `⚠️ This letter day is based on Prep's time zone, which doesn't match yours (${currentTimeZone})\nThe current letter day is ${letterDay}-DAY. Last updated on: ${(new Date()).toLocaleString()} (your local time, refresh to update)`)
                    letterDay = `⚠️ ${letterDay}`
                }
            letterDay = `${letterDay}-DAY`
        }
        letterDayElement.innerHTML = letterDay
    } catch (e) {
        console.log(e)
        letterDayElement.innerHTML = "🤯"
        setPopoverText(letterDayElement, "Woah! Something went wrong. Hit refresh to try again.")
        errorToastContent.innerText = "Couldn't query School Calendar. Refresh the page to try again"
        bootstrap.Toast.getOrCreateInstance(errorToast).show()
    }
}

function updateTimeHere() {
    // This function serves as a CORS workaround when used in setInterval.
    updateTime(clockElement)
}

emblemElement.addEventListener("dblclick", () => {
    console.log("open secret settings")
})

loadLetterDay()
updateTimeHere()
setInterval(updateTimeHere, 1) // Calling updateTime every 1000 ms causes noticeable lag (many milliseconds) so it is called every millisecond to avoid this problem
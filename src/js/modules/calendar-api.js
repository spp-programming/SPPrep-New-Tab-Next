"use strict";
import { calendarApiKey, calendarApiId, primaryTimeZone } from "./global-constants.js"

// Get the current date in UTC
const currentDateUTC = new Date()

// Get the time zone offset in minutes for the current date
const timeZoneOffsetMinutes = getTimeZoneOffsetFromName(primaryTimeZone)

// Convert the current date to EST by adjusting according to timezone offset
const timeZoneOffset = -timeZoneOffsetMinutes // EST offset in minutes
const currentDateEST = new Date(currentDateUTC.getTime() + timeZoneOffset * 60 * 1000)

// Extract the date parts for the EST Timezone
const year = currentDateEST.getFullYear()
const month = String(currentDateEST.getMonth()+1).padStart(2, "0") // Months are 0-based in JS
const day = String(currentDateEST.getDate()).padStart(2, "0")

const timeZoneOffsetISO = convertOffsetToISO(timeZoneOffsetMinutes)
const timeMin = `${year}-${month}-${day}T00:00:00${timeZoneOffsetISO}` // Start of the day in EST
const timeMax = `${year}-${month}-${day}T23:59:59${timeZoneOffsetISO}` // End of the day in EST

console.log(`timeMin is ${timeMin}`)
console.log(`timeMax is ${timeMax}`)

export async function getTodaysEvents() {
    // You need to define this function based on your application logic.
    // Assuming it fetches events from Google Calendar API or similar
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarApiId}/events?key=${calendarApiKey}&timeMin=${timeMin}&timeMax=${timeMax}&timeZone=${primaryTimeZone}`)
    const data = await response.json()
    return data.items
}

// Stolen from https://stackoverflow.com/a/68593283
function getTimeZoneOffsetFromName(timeZone) {
    const date = new Date()
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }))
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone }))
    // This is the worst code I have written.
    if (-(tzDate.getTime() - utcDate.getTime()) === -0) {
        return 0
    } else {
        return -(tzDate.getTime() - utcDate.getTime()) / 6e4
    }
}

function convertOffsetToISO(offsetSeconds) {
    let newOffset
    let offsetAbsoluteSeconds = Math.abs(offsetSeconds)
    switch (Math.sign(offsetSeconds)) {
        case -1:
            newOffset = "+"
            break
        case 0:
            newOffset = "+"
            break
        case 1:
            newOffset = "-"
            break
    }
    let hours = Math.floor(offsetAbsoluteSeconds / 60)
    let minutes = offsetAbsoluteSeconds % 60
    hours = String(hours).padStart(2, "0")
    minutes = String(minutes).padStart(2, "0")
    newOffset = newOffset.concat(`${hours}:${minutes}`)
    return newOffset
}
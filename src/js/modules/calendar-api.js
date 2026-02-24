"use strict"
import { calendarApiKey, calendarApiId, primaryTimeZone } from "./global-constants.js"

// Get the current date in UTC
const currentDateUTC = new Date()

// Get the time zone offset in minutes for the current date
const timeZoneOffsetMinutes = getTimeZoneOffsetFromName(primaryTimeZone)

// Extract the date parts for the EST Timezone
const year = new Intl.DateTimeFormat("en-US", {timeZone: primaryTimeZone, year: "numeric"}).format(currentDateUTC)
const month = new Intl.DateTimeFormat("en-US", {timeZone: primaryTimeZone, month: "2-digit"}).format(currentDateUTC)
const day = new Intl.DateTimeFormat("en-US", {timeZone: primaryTimeZone, day: "2-digit"}).format(currentDateUTC)

const timeZoneOffsetISO = convertOffsetToISO(timeZoneOffsetMinutes)
const timeMin = `${year}-${month}-${day}T00:00:00${timeZoneOffsetISO}` // Start of the day in EST
const timeMax = `${year}-${month}-${day}T23:59:59${timeZoneOffsetISO}` // End of the day in EST
export const dateString = `${month}/${day}/${year}` // Date string is used in several places (probably) and is compared against the current date in those places

console.log(`timeMin is ${timeMin}`)
console.log(`timeMax is ${timeMax}`)

/**
 * Not inclusive of all parameters! Only the ones that are relevant are included. See {@link https://developers.google.com/workspace/calendar/api/v3/reference/events#resource-representations} for more details.
 * @typedef {Object} CalendarEvent
 * @property {"calendar#event"} kind This property isn't checked, but if it isn't exactly `calendar#event`, expect problems.
 * @property {string} summary Summary of the calendar event.
 */
/**
 * This function fetches the calendar events for today from the Google Calendar API.
 * Fun fact! This is one of the only pieces of code that (somewhat) dates back to version 2.0 (in the original codebase).
 * @returns {CalendarEvent[]}
 */
export async function getTodaysEvents() {
    // You need to define this function based on your application logic.
    // Assuming it fetches events from Google Calendar API or similar
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarApiId}/events?key=${calendarApiKey}&timeMin=${timeMin}&timeMax=${timeMax}&timeZone=${primaryTimeZone}`)
    const data = await response.json()
    return data.items
}

// Stolen from https://stackoverflow.com/a/68593283
/**
 * This function gets the offset of a time zone based on its IANA tz database name.
 * @param {string} timeZone IANA tz database time zone to get the offset for
 * @returns {number} 
 */
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

/**
 * This function gets the ISO 8601 formatted offset from a minute value (`offsetMinutes`).
 * @param {number} offsetMinutes Number of minutes offset from UTC, probably taken from `getTimeZoneOffsetFromName()`.
 * @returns {string} ISO 8601 formatted offset, relative to UTC.
 */
function convertOffsetToISO(offsetMinutes) {
    let newOffset
    let offsetAbsoluteSeconds = Math.abs(offsetMinutes)
    switch (Math.sign(offsetMinutes)) {
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

/**
 * This function returns the _current_ date, formatted as MM/DD/YYYY
 * @returns {string} The current date, formatted as MM/DD/YYYY
 */
export function getCurrentDateString() {
    // Get the current date in UTC
    const currentDateUTC = new Date()

    // Extract the date parts for the EST Timezone
    const year = new Intl.DateTimeFormat("en-US", {timeZone: primaryTimeZone, year: "numeric"}).format(currentDateUTC)
    const month = new Intl.DateTimeFormat("en-US", {timeZone: primaryTimeZone, month: "2-digit"}).format(currentDateUTC)
    const day = new Intl.DateTimeFormat("en-US", {timeZone: primaryTimeZone, day: "2-digit"}).format(currentDateUTC)
    return `${month}/${day}/${year}`
}
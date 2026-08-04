"use strict"
import { calendarApiKey, calendarApiId, primaryTimeZone } from "./global-constants.js"

const timeMin = Temporal.Now.zonedDateTimeISO("America/New_York").startOfDay().toString({calendarName: "never", smallestUnit: "seconds", timeZoneName: "never"}) // Start of the day in New York time
const timeMax = Temporal.Now.zonedDateTimeISO("America/New_York").startOfDay().add({days: 1}).startOfDay().subtract({nanoseconds: 1}).toString({calendarName: "never", smallestUnit: "seconds", timeZoneName: "never"}) // End of the day in New York time
export const dateString = getCurrentDateString() // Date string is used in several places (probably) and is compared against the current date in those places

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
 * @returns {Promise<CalendarEvent[]>}
 */
export async function getTodaysEvents() {
    // You need to define this function based on your application logic.
    // Assuming it fetches events from Google Calendar API or similar
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarApiId}/events?key=${calendarApiKey}&timeMin=${timeMin}&timeMax=${timeMax}&timeZone=${primaryTimeZone}`)
    const data = await response.json()
    return data.items
}

/**
 * This function returns the _current_ date, formatted in RFC 9557 format with the time set to midnight.
 * @returns {string} The current date, formatted in RFC 9557 format with the time set to midnight.
 */
export function getCurrentDateString() {
    // By including the time zone in this string, time zone changes are now accounted for and will be treated as if the date changed, without any extra code
    return Temporal.Now.zonedDateTimeISO().startOfDay().toString({smallestUnit: "seconds", calendarName: "always"})
}
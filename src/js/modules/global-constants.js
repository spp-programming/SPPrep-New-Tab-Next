"use strict";
export const primaryTimeZone = "America/New_York"
export const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
export const calendarApiKey = "AIzaSyD3GwU8oQO5OEgUO6DbwgdsaO8SShJYkQ8"
export const calendarApiId = "144grand@gmail.com"
export const clockElement = document.getElementById("clock")
export const letterDayElement = document.getElementById("letter-day")
export const emblemElement = document.getElementById("emblem")
export const errorToast = document.getElementById("error-toast")
export const errorToastContent = document.getElementById("error-toast-content")
export const migrationToast = document.getElementById("migration-toast")
export const passcodeModal = document.getElementById("passcode-modal")

// DO NOT touch this unless you also change the version number. It should match the extension's version number, only using decimals when necessary. Example: version 4.0 ==> 4, version 3.2 ==> 3.2
export const migrationVersion = 4
"use strict"
import { clockElement } from "./global-constants.js"

export function updateTime12hour() {
    const date = new Date()
    const currentTime = date.toLocaleTimeString("en-US").replace(/ AM| PM/,"")
    // Although updateTime is called every millisecond, we should only update the DOM when it's needed
    if (clockElement.textContent !== currentTime) {
        clockElement.innerHTML = currentTime
    }
}

export function updateTimeAmPm() {
    const date = new Date()
    const currentTime = date.toLocaleTimeString("en-US")
    // Although updateTime is called every millisecond, we should only update the DOM when it's needed
    if (clockElement.textContent !== currentTime) {
        clockElement.innerHTML = currentTime
    }
}

export function updateTime24hour() {
    const date = new Date()
    const currentTime = date.toLocaleTimeString("en-GB")
    // Although updateTime is called every millisecond, we should only update the DOM when it's needed
    if (clockElement.textContent !== currentTime) {
        clockElement.innerHTML = currentTime
    }
}
"use strict"

import { backgroundList } from "./global-constants.js"

/**
 * Gets the current seasonal background.
 * @returns {string} Absolute URL that points to this season's background.
 */
export function getSeasonalBackground() {
    const month = Temporal.Now.plainDateISO().month
    const day = Temporal.Now.plainDateISO().day
    let imageUrl
    if (month == 12 || month <= 2) {
        // WINTER
        imageUrl = backgroundList.seasonal.seasons.winter.file
    } else if (month >= 3 && month <= 5) {
        // SPRING
        imageUrl = backgroundList.seasonal.seasons.spring.file
    } else if (month >= 6 && month <= 9) {
        // SUMMER
        imageUrl = backgroundList.seasonal.seasons.summer.file
    } else {
        // FALL
        imageUrl = backgroundList.seasonal.seasons.autumn.file
    }
    // April Fools functionality
    if (month === 4 && day === 1) {
        console.log("rainbow mode activated")
        imageUrl = backgroundList.rainbow.file
    }
    return imageUrl
}
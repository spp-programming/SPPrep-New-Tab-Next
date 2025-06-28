"use strict"

import { backgroundMscBuilding, backgroundRainbow, backgroundSnow } from "./global-constants.js"

export function getSeasonalBackground(month, day) {
    month += 1
    let imageUrl
    if (month == 12 || month <= 2) {
        // WINTER
        imageUrl = backgroundSnow
    } else if (month >= 3 && month <= 5) {
        // SPRING
        imageUrl = backgroundMscBuilding
    } else if (month >= 6 && month <= 9) {
        // SUMMER
        imageUrl = backgroundMscBuilding
    } else {
        // FALL
        imageUrl = backgroundSnow
    }
    // April Fools functionality
    if (month == 4 && day == 1) {
        console.log("rainbow mode activated")
        imageUrl = backgroundRainbow
    }
    return imageUrl
}
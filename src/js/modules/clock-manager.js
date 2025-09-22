"use strict"
export function updateTime(clockElement) {
    const d = new Date()
    const currentTime = `${d.getHours() % 12 == 0 ? 12 : d.getHours() % 12}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`
    // Although updateTime is called every millisecond, we should only update the DOM when it's needed
    if (clockElement.textContent != currentTime) {
        clockElement.innerHTML = currentTime
    }
}
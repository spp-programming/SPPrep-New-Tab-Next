"use strict"
/**
 * This function adds event listeners for any element with the class `fake-link`, which will immediately call `preventDefault()`. Usually called on page load.
 */
export function handleFakeLinks() {
    const fakeLinks = document.getElementsByClassName("fake-link")
    Array.from(fakeLinks).forEach(fakeLink => {
        fakeLink.addEventListener("click", (event) => {
            event.preventDefault()
        })
    })
}
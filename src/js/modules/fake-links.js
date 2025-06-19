"use strict"
export function handleFakeLinks() {
    const fakeLinks = document.getElementsByClassName("fake-link")
    Array.from(fakeLinks).forEach(fakeLink => {
        fakeLink.addEventListener("click", (event) => {
            event.preventDefault()
        })
    })
}
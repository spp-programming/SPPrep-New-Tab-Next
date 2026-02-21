"use strict"
import { setPopoverText } from "./main.js"
import { bellScheduleButtonTourTarget, buttonContainer, changelogButtonTourTarget, clockElement, letterDayTourTarget, sealElement, toggleTourButton } from "./modules/global-constants.js"

let isTourActive = false
let tourCurrentIndex = 0
let tourButtonOriginalContent = ""
let tourButtonOriginalTitle = ""

const tourData = [
    {
        name: "intro",
        element: sealElement,
        html: "<strong>Welcome to the SPP New Tab tour!</strong><p class=\"form-text\">Before we start, if you need to stop the tour at any time, just click on the <span class=\"text-body-emphasis\"><i class=\"bi bi-list\" aria-hidden=\"true\"></i> Menu</span> at the top left and choose <span class=\"text-body-emphasis\"><i class=\"bi bi-door-open\" aria-hidden=\"true\"></i> End tour</span>.</p><p class=\"form-text\">To continue, click the blue button:</p><a href=\"#\" role=\"button\" class=\"btn btn-primary btn-sm float-end mb-3 tour-next-button\">Next ></a>"
    },
    {
        name: "clock",
        element: clockElement,
        html: "<strong>Here's the time.</strong><p class=\"form-text\"> You can change the clock format (24 hour or AM/PM) in Settings.</p><a href=\"#\" role=\"button\" class=\"btn btn-primary btn-sm float-end mb-3 tour-next-button\">Next ></a>"
    },
    {
        name: "quick-links",
        element: buttonContainer,
        html: "<strong>These are your quick links.</strong><p class=\"form-text\"> You can use these to quickly access the sites that you use most. You can add more in Settings.</p><a href=\"#\" role=\"button\" class=\"btn btn-primary btn-sm float-end mb-3 tour-next-button\">Next ></a>"
    },
    {
        name: "changelog",
        element: changelogButtonTourTarget,
        html: "<strong>Click this button to see what's new.</strong><p class=\"form-text\">Before version 4.0, this button was grouped in with the other quick links. It has been moved here to have the quick links be less of a mess.</p><a href=\"#\" role=\"button\" class=\"btn btn-primary btn-sm float-end mb-3 tour-next-button\">Next ></a>"
    },
    {
        name: "bell-schedule",
        element: bellScheduleButtonTourTarget,
        html: "<strong>Click this button to view the Bell Schedule.</strong><p class=\"form-text\">Before version 4.0, this button was grouped in with the other quick links. It has been moved here to have the quick links be less of a mess.</p><a href=\"#\" role=\"button\" class=\"btn btn-primary btn-sm float-end mb-3 tour-next-button\">Next ></a>"
    },
    {
        name: "letter-day",
        element: letterDayTourTarget,
        html: "<strong>Here's the letter day.</strong><p class=\"form-text\">You can click on it to see when it was last updated. It may display these emojis in place of the letter day when:</p><ul class=\"form-text list-unstyled\"><li>🤔: The letter day is still being loaded.</li><li>🤷‍♂️: No letter day could be found for today.</li><li>⚠️: The date has changed, which means the letter day has probably changed.</li><li>🤯: An error was encountered while loading the letter day. This is usually network related.</li><li>😐: Multiple letter days were found for today. You should not ever see this, if you do please report it.</li></ul><a href=\"#\" role=\"button\" class=\"btn btn-success btn-sm float-end mb-3 tour-next-button tour-end-button\"><i class=\"bi bi-flag\" aria-hidden=\"true\"></i> Done!</a>"
    },
]

export function handleTourButton() {
    toggleTourButton.addEventListener("click", (event) => {
        event.preventDefault()
        if (isTourActive === false) {
            isTourActive = true
            tourButtonOriginalContent = toggleTourButton.innerHTML
            toggleTourButton.innerHTML = '<i class="bi bi-door-open" aria-hidden="true"></i> End tour'
            tourButtonOriginalTitle = toggleTourButton.dataset.bsOriginalTitle
            bootstrap.Tooltip.getInstance(toggleTourButton).dispose()
            toggleTourButton.title = "Click this button to end the current tour."
            new bootstrap.Tooltip(toggleTourButton)
            const tour = tourData.find((tour) => tour.name === "intro")
            const popover = new bootstrap.Popover(tour.element, {
                trigger: "manual",
                html: true
            })
            tour.element.addEventListener("inserted.bs.popover", () => {
                const tourNextButton = document.querySelector(".tour-next-button")
                tourNextButton.addEventListener("click", (event) => {
                    event.preventDefault()
                    popover.dispose()
                    handleTourNextButton(tour.name)
                }, { once: true })
            }, { once: true })
            setPopoverText(tour.element, tour.html)
            popover.show()
            tourCurrentIndex = tourData.findIndex((tour) => tour.name === tour.name)
        } else {
            handleTourEnd()
        }
    })
}

/**
 * 
 * @param {string} currentTour 
 */
function handleTourNextButton(currentTour) {
    let tourCurrentIndexHere = tourData.findIndex((tour) => tour.name === currentTour)
    let tourNextIndex = tourCurrentIndexHere + 1
    if (isTourActive === false) {
        throw Error("Tour next button clicked while tour is inactive!")
    }
    const tour = tourData[tourNextIndex]
    const popover = new bootstrap.Popover(tour.element, {
        trigger: "manual",
        html: true
    })
    tour.element.addEventListener("inserted.bs.popover", () => {
        const tourNextButton = document.querySelector(".tour-next-button")
        tourNextButton.addEventListener("click", (event) => {
            event.preventDefault()
            if (tourNextButton.classList.contains("tour-end-button") === true) {
                handleTourEnd()
                return
            }
            popover.dispose()
            handleTourNextButton(tour.name)
        }, { once: true })
    }, { once: true })
    setPopoverText(tour.element, tour.html)
    popover.show()
    tourCurrentIndex = tourNextIndex
}

function handleTourEnd() {
    isTourActive = false
    toggleTourButton.innerHTML = tourButtonOriginalContent
    bootstrap.Tooltip.getInstance(toggleTourButton).dispose()
    toggleTourButton.title = tourButtonOriginalTitle
    new bootstrap.Tooltip(toggleTourButton)
    bootstrap.Popover.getInstance(tourData[tourCurrentIndex].element).dispose()
}
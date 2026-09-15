"use strict"
/**
 * @typedef {Object} LastButtons
 * @property {[number]?} lastButtons Array of numbers representing the last buttons that were held down
 * @typedef {Gamepad & LastButtons} GamepadExtended
 */
/**
 * @type {GamepadExtended[]?}
 */
const gamepads = []
let gamepadLoopID

export function startListeningOnGamepads() {
    console.log("Now listening for gamepad events. Press any button on your controller to connect!")
    gamepadLoop()
    function gamepadLoop() {
        if (gamepads.length !== 0) {
            gamepads.forEach(gamepad => {
                const gamepadReChecked = navigator.getGamepads()[gamepad.index] // For some reason gamepad doesn't update so I have to query it again every time we poll for changes
                if (gamepadReChecked?.buttons[12]?.pressed === true) {
                    console.log("up is being pressed")
                    gamepads[gamepad.index].lastButtons = gamepads[gamepad.index].lastButtons.filter(button => button !== 12).concat([12])
                }
                if (gamepadReChecked?.buttons[12]?.pressed === false && gamepads[gamepad.index].lastButtons.includes(12) === true) {
                    console.log("up was released, sending event")
                    gamepads[gamepad.index].lastButtons = gamepads[gamepad.index].lastButtons.filter(button => button !== 12)
                    document.dispatchEvent(new CustomEvent("gamepad-pressed", { detail: { button: "up", code: "\u{1F53C}" } }))
                }
                if (gamepadReChecked?.buttons[13]?.pressed === true) {
                    console.log("down is being pressed")
                    gamepads[gamepad.index].lastButtons = gamepads[gamepad.index].lastButtons.filter(button => button !== 13).concat([13])
                }
                if (gamepadReChecked?.buttons[13]?.pressed === false && gamepads[gamepad.index].lastButtons.includes(13) === true) {
                    console.log("down was released, sending event")
                    gamepads[gamepad.index].lastButtons = gamepads[gamepad.index].lastButtons.filter(button => button !== 13)
                    document.dispatchEvent(new CustomEvent("gamepad-pressed", { detail: { button: "down", code: "\u{1F53D}" } }))
                }
                if (gamepadReChecked?.buttons[14]?.pressed === true) {
                    console.log("left is being pressed")
                    gamepads[gamepad.index].lastButtons = gamepads[gamepad.index].lastButtons.filter(button => button !== 14).concat([14])
                }
                if (gamepadReChecked?.buttons[14]?.pressed === false && gamepads[gamepad.index].lastButtons.includes(14) === true) {
                    console.log("left was released, sending event")
                    gamepads[gamepad.index].lastButtons = gamepads[gamepad.index].lastButtons.filter(button => button !== 14)
                    document.dispatchEvent(new CustomEvent("gamepad-pressed", { detail: { button: "left", code: "\u{25C0}\u{FE0F}" } }))
                }
                if (gamepadReChecked?.buttons[15]?.pressed === true) {
                    console.log("right is being pressed")
                    gamepads[gamepad.index].lastButtons = gamepads[gamepad.index].lastButtons.filter(button => button !== 15).concat([15])
                }
                if (gamepadReChecked?.buttons[15]?.pressed === false && gamepads[gamepad.index].lastButtons.includes(15) === true) {
                    console.log("right was released, sending event")
                    gamepads[gamepad.index].lastButtons = gamepads[gamepad.index].lastButtons.filter(button => button !== 15)
                    document.dispatchEvent(new CustomEvent("gamepad-pressed", { detail: { button: "right", code: "\u{25B6}\u{FE0F}" } }))
                }
                if (gamepadReChecked?.buttons[0]?.pressed === true) {
                    console.log("Button A is being pressed")
                    gamepads[gamepad.index].lastButtons = gamepads[gamepad.index].lastButtons.filter(button => button !== 0).concat([0])
                }
                if (gamepadReChecked?.buttons[0]?.pressed === false && gamepads[gamepad.index].lastButtons.includes(0) === true) {
                    console.log("Button A was released, sending event")
                    gamepads[gamepad.index].lastButtons = gamepads[gamepad.index].lastButtons.filter(button => button !== 0)
                    document.dispatchEvent(new CustomEvent("gamepad-pressed", { detail: { button: "a", code: "\u{1F170}\u{FE0F}" } }))
                }
                if (gamepadReChecked?.buttons[1]?.pressed === true) {
                    console.log("Button B is being pressed")
                    gamepads[gamepad.index].lastButtons = gamepads[gamepad.index].lastButtons.filter(button => button !== 1).concat([1])
                }
                if (gamepadReChecked?.buttons[1]?.pressed === false && gamepads[gamepad.index].lastButtons.includes(1) === true) {
                    console.log("Button B was released, sending event")
                    gamepads[gamepad.index].lastButtons = gamepads[gamepad.index].lastButtons.filter(button => button !== 1)
                    document.dispatchEvent(new CustomEvent("gamepad-pressed", { detail: { button: "b", code: "\u{1F171}\u{FE0F}" } }))
                }
                if (gamepadReChecked?.buttons[8]?.pressed === true) {
                    console.log("Select is being pressed")
                    gamepads[gamepad.index].lastButtons = gamepads[gamepad.index].lastButtons.filter(button => button !== 8).concat([8])
                }
                if (gamepadReChecked?.buttons[8]?.pressed === false && gamepads[gamepad.index].lastButtons.includes(8) === true) {
                    console.log("Select was released, sending event")
                    gamepads[gamepad.index].lastButtons = gamepads[gamepad.index].lastButtons.filter(button => button !== 8)
                    document.dispatchEvent(new CustomEvent("gamepad-pressed", { detail: { button: "select", code: "\u{1F914}" } }))
                }
                if (gamepadReChecked?.buttons[9]?.pressed === true) {
                    console.log("Start is being pressed")
                    gamepads[gamepad.index].lastButtons = gamepads[gamepad.index].lastButtons.filter(button => button !== 9).concat([9])
                }
                if (gamepadReChecked?.buttons[9]?.pressed === false && gamepads[gamepad.index].lastButtons.includes(9) === true) {
                    console.log("Start was released, sending event")
                    gamepads[gamepad.index].lastButtons = gamepads[gamepad.index].lastButtons.filter(button => button !== 9)
                    document.dispatchEvent(new CustomEvent("gamepad-pressed", { detail: { button: "start", code: "\u{1F3C3}\u{200D}\u{27A1}\u{FE0F}" } }))
                }
            })
        }
        gamepadLoopID = requestAnimationFrame(gamepadLoop)
    }
}

export function stopListeningOnGamepads() {
    if (typeof gamepadLoopID !== "undefined") {
        cancelAnimationFrame(gamepadLoopID)
    }
    console.log("Stopped listening for gamepad events.")
}

window.addEventListener("gamepadconnected", (event) => {
    console.log(`A gamepad was connected! (index ${event.gamepad.index}, id "${event.gamepad.id}")`)
    gamepads[event.gamepad.index] = event.gamepad
    gamepads[event.gamepad.index].lastButtons = []
    console.log(gamepads)
})
window.addEventListener("gamepaddisconnected", (event) => {
    console.log(`A gamepad was disconnected! (index ${event.gamepad.index}, id "${event.gamepad.id}")`)
    delete gamepads[event.gamepad.index]
    console.log(gamepads)
})
console.log("Gamepad connection event listeners initialized!")
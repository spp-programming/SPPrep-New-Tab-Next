"use strict"
/**
 * @type {Gamepad[]?}
 */
const gamepads = []
let gamepadLoopID

export function startListeningOnGamepads() {
    console.log("Now listening for gamepad events. Press any button on your controller to connect!")
    gamepadLoop()
    function gamepadLoop() {
        if (gamepads.length !== 0) {
            gamepads.forEach(gamepad => {
                if (gamepad.buttons[12]?.pressed === true) {
                    console.log("up was pressed")
                    gamepads[gamepad.index].lastButton = 12
                }
                if (gamepad.buttons[12]?.pressed === false && gamepad.lastButton === 12) {
                    console.log("up was released, sending event")
                    gamepad.lastButton = null
                    document.dispatchEvent(new CustomEvent("gamepad-pressed", { detail: { button: "up", code: "\u{1F53C}" } }))
                }
                if (gamepad.buttons[13]?.pressed === true) {
                    console.log("down was pressed")
                    gamepads[gamepad.index].lastButton = 13
                }
                if (gamepad.buttons[13]?.pressed === false && gamepad.lastButton === 13) {
                    console.log("down was released, sending event")
                    gamepad.lastButton = null
                    document.dispatchEvent(new CustomEvent("gamepad-pressed", { detail: { button: "down", code: "\u{1F53D}" } }))
                }
                if (gamepad.buttons[14]?.pressed === true) {
                    console.log("left was pressed")
                    gamepads[gamepad.index].lastButton = 14
                }
                if (gamepad.buttons[14]?.pressed === false && gamepad.lastButton === 14) {
                    console.log("left was released, sending event")
                    gamepad.lastButton = null
                    document.dispatchEvent(new CustomEvent("gamepad-pressed", { detail: { button: "left", code: "\u{25C0}\u{FE0F}" } }))
                }
                if (gamepad.buttons[15]?.pressed === true) {
                    console.log("right was pressed")
                    gamepads[gamepad.index].lastButton = 15
                }
                if (gamepad.buttons[15]?.pressed === false && gamepad.lastButton === 15) {
                    console.log("right was released, sending event")
                    gamepad.lastButton = null
                    document.dispatchEvent(new CustomEvent("gamepad-pressed", { detail: { button: "right", code: "\u{25B6}\u{FE0F}" } }))
                }
                if (gamepad.buttons[0]?.pressed === true) {
                    console.log("Button A was pressed")
                    gamepads[gamepad.index].lastButton = 0
                }
                if (gamepad.buttons[0]?.pressed === false && gamepad.lastButton === 0) {
                    console.log("Button A was released, sending event")
                    gamepad.lastButton = null
                    document.dispatchEvent(new CustomEvent("gamepad-pressed", { detail: { button: "a", code: "\u{1F170}\u{FE0F}" } }))
                }
                if (gamepad.buttons[1]?.pressed === true) {
                    console.log("Button B was pressed")
                    gamepads[gamepad.index].lastButton = 1
                }
                if (gamepad.buttons[1]?.pressed === false && gamepad.lastButton === 1) {
                    console.log("Button B was released, sending event")
                    gamepad.lastButton = null
                    document.dispatchEvent(new CustomEvent("gamepad-pressed", { detail: { button: "b", code: "\u{1F171}\u{FE0F}" } }))
                }
                if (gamepad.buttons[8]?.pressed === true) {
                    console.log("Select was pressed")
                    gamepads[gamepad.index].lastButton = 8
                }
                if (gamepad.buttons[8]?.pressed === false && gamepad.lastButton === 8) {
                    console.log("Select was released, sending event")
                    gamepad.lastButton = null
                    document.dispatchEvent(new CustomEvent("gamepad-pressed", { detail: { button: "select", code: "\u{1F914}" } }))
                }
                if (gamepad.buttons[9]?.pressed === true) {
                    console.log("Start was pressed")
                    gamepads[gamepad.index].lastButton = 9
                }
                if (gamepad.buttons[9]?.pressed === false && gamepad.lastButton === 9) {
                    console.log("Start was released, sending event")
                    gamepad.lastButton = null
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
    console.log(gamepads)
})
window.addEventListener("gamepaddisconnected", (event) => {
    console.log(`A gamepad was disconnected! (index ${event.gamepad.index}, id "${event.gamepad.id}")`)
    delete gamepads[event.gamepad.index]
    console.log(gamepads)
})
console.log("Gamepad connection event listeners initialized!")
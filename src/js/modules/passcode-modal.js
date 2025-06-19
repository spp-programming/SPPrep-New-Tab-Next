"use strict"
import { passcodeModal } from "./global-constants.js"
const passcodeModalBS = new bootstrap.Modal(passcodeModal)

export function openPasscodeModal() {
    passcodeModalBS.show()
}

passcodeModal.addEventListener("shown.bs.modal", () => {
    console.log("resizing image map...")
    imageMapResize()
})
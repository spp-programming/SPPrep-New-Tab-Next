"use strict"
import { internalConfigFile } from "./global-constants.js"
export async function getInternalConfigMode() {
    let internalConfigResponse
    try {
        internalConfigResponse = await fetch(internalConfigFile)
    } catch (error) {
        alert(`Oops, something went wrong. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\nCouldn't fetch internalConfigFile: ${error}\n\nSome features will be unavailable.`)
        throw Error(`Response status: ${error}`)
    }
    if (!internalConfigResponse.ok) {
        alert(`Oops, something went wrong. This is not supposed to be happening!\nIf you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\nCouldn't fetch internalConfigFile: Response status ${internalConfigResponse.status}\n\nSome features will be unavailable.`)
        throw Error(`Response status: ${internalConfigResponse.status}`)
    }
    const internalConfigJSON = await internalConfigResponse.json()
    switch (internalConfigJSON["configMode"]) {
        case "student":
            console.log("internalConfigMode is \"student\"")
            return "student"
        case "staff":
            console.log("internalConfigMode is \"staff\"")
            return "staff"
        default:
            alert(`Oops, something went wrong. This is not supposed to be happening!\nIf you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\nInvalid configMode value: ${internalConfigJSON["configMode"]}\n\nSome features will be unavailable.`)
            throw Error(`Invalid configMode value: ${internalConfigJSON["configMode"]}`)
    }
}
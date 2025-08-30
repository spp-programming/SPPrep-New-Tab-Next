"use strict"
import { internalConfigFile } from "./global-constants.js"
export async function getInternalConfigMode() {
    try {
        let internalConfigFileData
        try {
            internalConfigFileData = await import(internalConfigFile, { with: { type: "json" } })
        } catch (error) {
            throw Error(`Could not import internalConfigFile: ${error}`)
        }
        if (typeof(internalConfigFileData.default.configMode) !== "string") {
            throw Error(`Invalid configMode type: ${typeof(internalConfigFileData.default.configMode)}`)
        }
        switch (internalConfigFileData.default.configMode) {
            case "student":
                console.log("internalConfigMode is \"student\"")
                return "student"
            case "staff":
                console.log("internalConfigMode is \"staff\"")
                return "staff"
            default:
                throw Error(`Invalid configMode value: ${internalConfigFileData.default.configMode}`)
        }
    } catch (error) {
        alert(`Oops, something went wrong. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}\n\nSome features will be unavailable.`)
        console.error(error)
    }
}
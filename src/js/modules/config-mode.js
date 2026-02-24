"use strict"
import { internalConfigFile } from "./global-constants.js"
/**
 * This function returns the current config mode, as defined in `config-mode.json`.
 * @returns {Promise<"student"|"staff"|undefined>} String of `student` if the config mode is set to student, or `staff` if the config mode is set to staff. Returns `undefined` on an error.
 */
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
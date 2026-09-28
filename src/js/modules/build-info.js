"use strict"
import { buildInfoFile } from "./global-constants.js"
/**
 * This function returns the build info, as defined in `build-info.json`.
 * @returns {Promise<{version: string?, edition: string?, revision: string?, fullRevision: string?}>} The contents of the `build-info.json` file
 */
export async function getBuildInfo() {
    let buildInfoFileData
    try {
        buildInfoFileData = await import(buildInfoFile, { with: { type: "json" } })
    } catch (error) {
        throw Error(`Could not import buildInfoFile: ${error}`)
    }
    return buildInfoFileData.default
}
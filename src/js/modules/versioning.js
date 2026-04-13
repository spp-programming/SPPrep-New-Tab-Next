"use strict"

/**
 * @typedef {Object} VersionParts
 * @property {string} version The normalized version string. This allows versions to be compared using a consistent format.
 * @property {number} major Major version part. Large feature updates should increment this value.
 * @property {number} minor Minor version part. Smaller updates in between major updates should increment this value.
 * @property {number} patch Patch version part. Even smaller updates that only fix specific issues should increment this value.
 */
/**
 * Get the individual parts of a specified version string, along with a normalized version string.
 * @param {string} version Version string to get the parts of.
 * @returns {VersionParts}
 */
export function getVersionParts(version) {
    if (typeof version !== "string") {
        throw Error("Specified version is not a string")
    }
    if (version.includes(".") === false && /^\d+$/.test(version.trim()) === false) {
        throw Error("Specified version has no \".\" separators")
    }
    const splitVersion = version.trim().split(".")
    if (splitVersion.length > 3) {
        throw Error("Specified version has more than 3 parts")
    }
    if (splitVersion.length < 1) {
        throw Error("Specified version has less than 1 part")
    }
    splitVersion.forEach(part => {
        if (/^\d+$/.test(part) === false) {
            throw Error("Specified version has non-numeric and/or negative parts")
        }
    })
    if (splitVersion.length === 3 && Number(splitVersion[2]) !== 0) {
        return {
            version: `${splitVersion[0]}.${splitVersion[1]}.${splitVersion[2]}`,
            major: Number(splitVersion[0]),
            minor: Number(splitVersion[1]),
            patch: Number(splitVersion[2])
        }
    }
    if (splitVersion.length === 3 && Number(splitVersion[2]) === 0) {
        return {
            version: `${splitVersion[0]}.${splitVersion[1]}`,
            major: Number(splitVersion[0]),
            minor: Number(splitVersion[1]),
            patch: 0
        }
    }
    if (splitVersion.length === 2) {
        return {
            version: `${splitVersion[0]}.${splitVersion[1]}`,
            major: Number(splitVersion[0]),
            minor: Number(splitVersion[1]),
            patch: 0
        }
    }
    return {
        version: `${splitVersion[0]}.0`,
        major: Number(splitVersion[0]),
        minor: 0,
        patch: 0
    }
}

/**
 * Check if one version string is newer than the other.
 * @param {string} newVersion Version string that you expect to be the newer one
 * @param {string} oldVersion Version string that you expect to be the older one
 * @returns {boolean} Returns `true` when `newVersion` is newer than `oldVersion`, otherwise returns `false`.
 */
export function isNewerVersion(newVersion, oldVersion) {
    try {
        const oldVersionParts = getVersionParts(oldVersion)
        const newVersionParts = getVersionParts(newVersion)
        if (newVersionParts.major > oldVersionParts.major) {
            return true
        }
        if (newVersionParts.minor > oldVersionParts.minor) {
            return true
        }
        if (newVersionParts.patch > oldVersionParts.patch) {
            return true
        }
        return false
    } catch (error) {
        console.error(error)
        return false
    }
}

/**
 * Compare two version strings to see if they are equal, even if they aren't literally the same string
 * @param {string} firstVersion One version string you want to compare
 * @param {string} secondVersion Another version string you want to compare
 * @returns {boolean} Returns `true` when both specified versions are identical, otherwise returns `false`.
 */
export function isSameVersion(firstVersion, secondVersion) {
    try {
        const firstVersionNormalized = getVersionParts(firstVersion).version
        const secondVersionNormalized = getVersionParts(secondVersion).version
        if (firstVersionNormalized === secondVersionNormalized) {
            return true
        }
        return false
    } catch (error) {
        console.error(error)
        return false
    }
}
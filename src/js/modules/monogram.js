"use strict"
/**
 * Create a monogram image based on a provided letter.
 * @param {string} letter A single letter, uppercase or lowercase.
 * @returns {Promise<string>} Returns a `data:` URL containing an SVG image of the monogram.
 */
export async function createMonogram(letter) {
    const backgroundColors = [
        "lightcoral",
        "lightcyan",
        "lightgreen",
        "plum",
        "lightgoldenrodyellow",
        "white"
    ]
    if (typeof letter !== "string") {
        throw Error("letter is not a string")
    }
    if (/^[a-zA-Z0-9]$/.test(letter) === false) {
        throw Error("only one letter is allowed")
    }
    const domParser = new DOMParser()
    const serializer = new XMLSerializer()
    const monogramBaseRequest = await fetch("/img/resources/monogram_base.svg")
    const monogramBaseData = await monogramBaseRequest.text()
    const monogramBase = domParser.parseFromString(monogramBaseData, "image/svg+xml")
    const monogramLetter = monogramBase.getElementById("monogram-letter")
    const monogramBackground = monogramBase.getElementById("monogram-background")
    monogramLetter.textContent = letter
    monogramBackground.setAttribute("fill", backgroundColors[Math.floor(Math.random() * backgroundColors.length)])
    return `data:image/svg+xml;base64,${btoa(serializer.serializeToString(monogramBase))}`
}

/**
 * Gets the significant letter of a given URL. Normally used when creating a monogram image.
 * @param {string|URL} url The URL you want to get the significant letter of.
 * @returns {string} The significant letter of the given URL.
 */
export function getSignificantLetter(url) {
    const urlObject = new URL(url)
    const hostnameSplit = urlObject.hostname.split(".")
    if (hostnameSplit[0] === "www" && hostnameSplit[1] !== undefined) {
        return hostnameSplit[1][0]
    }
    return hostnameSplit[0][0]
}
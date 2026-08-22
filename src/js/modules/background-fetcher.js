"use strict"
const fetchWorker = new Worker("./js/modules/background-fetcher-worker.js")

/**
 * Gets the blob: URL associated with the stored custom background and its content type. This uses a web worker to avoid blocking the main thread.
 * @returns {Promise<{type: string, url?: string}>}
 */
export async function getCustomBackgroundData() {
    const dataUrl = (await chrome.storage.local.get())["secretSettings_customBackground"]
    return new Promise((resolve, reject) => {
        fetchWorker.postMessage(dataUrl)
        fetchWorker.addEventListener("message", (event) => {
            resolve(event.data)
        })
        fetchWorker.addEventListener("error", (event) => {
            reject(event.error)
        })
    })
}
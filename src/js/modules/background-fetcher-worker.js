"use strict"
self.addEventListener("message", async (event) => {
    try {
        if (event.data !== undefined) {
            const backgroundData = await fetch(event.data)
            const contentType = backgroundData.headers.get("Content-Type")
            const backgroundBlob = await backgroundData.blob()
            let computedType = "none"
            if (contentType.startsWith("image/") === true) {
                computedType = "image"
            }
            if (contentType.startsWith("video/") === true) {
                computedType = "video"
            }
            self.postMessage({ type: computedType, url: URL.createObjectURL(backgroundBlob)})
        } else {
            console.log("The custom background doesn't seem to exist!")
            self.postMessage({ type: "none" })
        }
    } catch (error) {
        console.error(error)
        self.postMessage({ type: "none" })
    }
})
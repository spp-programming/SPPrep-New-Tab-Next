"use strict"
import { secretSettingsContent, secretSettingsDisabledContent, secretSettingsDisableSwitch } from "./modules/secret-settings-constants.js"
import { handleFakeLinks } from "./modules/fake-links.js"
import { runMigrations } from "./modules/migrations.js"
import { getSeasonalBackground } from "./modules/seasonal-backgrounds.js"
import { secretSettingsFontSelection, secretSettingsFontPreview, secretSettingsBackgroundPreview, secretSettingsBackgroundSelection, secretSettingsBackgroundPreviewNotes, secretSettingsGradientSelection, secretSettingsGradientSelectionReset} from "./modules/secret-settings-constants.js"
import { backgroundBliss, backgroundMscBuilding, backgroundOsxLeopard, backgroundOsxLion, backgroundOsxTiger, backgroundOsxYosemite, backgroundSnow, backgroundStaffStaring, backgroundStreetView } from "./modules/global-constants.js"

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerElement => new bootstrap.Tooltip(tooltipTriggerElement))

let changesWereMade = false

runMigrations()

if (localStorage.getItem("secretSettingsVisible") === "true") {
    secretSettingsContent.hidden = false
} else {
    secretSettingsDisabledContent.hidden = false
}

handleFakeLinks()

secretSettingsDisableSwitch.addEventListener("change", () => {
    handleBeforeUnload()
})

secretSettingsGradientSelection.addEventListener("change", () => {
    handleBeforeUnload()
})

secretSettingsGradientSelectionReset.addEventListener("click", () => {
    handleBeforeUnload()
    secretSettingsGradientSelection.value = "#9b042a"
})

secretSettingsBackgroundSelection.addEventListener("change", () => {
    secretSettingsBackgroundPreview.hidden = false
    secretSettingsBackgroundPreviewNotes.hidden = false
    handleBeforeUnload()
    updateBackgroundPreview()
})

secretSettingsFontSelection.addEventListener("change", () => {
    handleBeforeUnload()
    updateFontPreview()
})

function updateBackgroundPreview() {
    handleBeforeUnload()
    switch (secretSettingsBackgroundSelection.value) {
        case "seasonal":
            secretSettingsBackgroundPreview.setAttribute("src", getSeasonalBackground((new Date()).getMonth(), (new Date()).getDate()))
            secretSettingsBackgroundPreviewNotes.innerHTML = "This background will change automatically based on the seasons. There are only two images we can use, so a given image is actually used for two seasons."
            break
        case "bliss":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundBliss)
            secretSettingsBackgroundPreviewNotes.innerHTML = "I added this in because nostalgia."
            break
        case "osx-tiger":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundOsxTiger)
            secretSettingsBackgroundPreviewNotes.innerHTML = "I added the OS X Leopard one, so there was no reason not to include this one too.<br>Image attribution: &copy; 2024 Apple<br>Source: <a href=\"https://512pixels.net/projects/default-mac-wallpapers-in-5k/\" target=\"_blank\">512pixels.net</a>"
            break
        case "osx-leopard":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundOsxLeopard)
            secretSettingsBackgroundPreviewNotes.innerHTML = "One of the people in the Programming Club Discord server suggested this one.<br>Image attribution: &copy; 2024 Apple<br>Source: <a href=\"https://512pixels.net/projects/default-mac-wallpapers-in-5k/\" target=\"_blank\">512pixels.net</a>"
            break
        case "osx-lion":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundOsxLion)
            secretSettingsBackgroundPreviewNotes.innerHTML = "I think the same guy who suggested the OS X Leopard one would like this one too.<br>Image attribution: &copy; 2024 Apple<br>Source: <a href=\"https://512pixels.net/projects/default-mac-wallpapers-in-5k/\" target=\"_blank\">512pixels.net</a>"
            break
        case "osx-yosemite":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundOsxYosemite)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This one is the most different from the rest of the OS X wallpapers. It's also actually the largest wallpaper (by file size) in here!<br>Image attribution: &copy; 2024 Apple<br>Source: <a href=\"https://512pixels.net/projects/default-mac-wallpapers-in-5k/\" target=\"_blank\">512pixels.net</a>"
            break
        case "msc-building":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundMscBuilding)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This background was brought over from the older version of the extension. There is no higher quality version because I couldn't get AI upscaling to get usable results."
            break
        case "snow":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundSnow)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This background was introduced in version 3.0. It's also AI upscaled, but you can also use the original, low quality version instead if you want."
            break
        case "snow-low-quality":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundSnow)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This background was introduced in version 3.0. This version of the image was shared on the Programming Club Discord server and is included as-is."
            break
        case "original-fall-winter":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundStaffStaring)
            secretSettingsBackgroundPreviewNotes.innerHTML = "Although this background was in the older version of the extension, you never actually saw it because the seasonal background feature wasn't functional at the time."
            break
        case "street-view":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundStreetView)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This is a Google Street View screenshot, dating back to 2012. This version of the background was shared on the Programming Club Discord server and is included as-is.<br>Image attribution: &copy; 2024 Google"
            break
        case "street-view-better":
            secretSettingsBackgroundPreview.setAttribute("src", backgroundStaffStaring)
            secretSettingsBackgroundPreviewNotes.innerHTML = "This is a Google Street View screenshot, dating back to 2012. This background has a greater field of view and resolution, compared to the other version.<br>Image attribution: &copy; 2024 Google"
            break
        case "rainbow":
            secretSettingsBackgroundPreview.setAttribute("src", "./img/backgrounds/rainbow.svg")
            secretSettingsBackgroundPreviewNotes.innerHTML = "This background is an SVG. I could've just used CSS to make an animation like this, but the SVG works anywhere images do, which makes this the lazy option."
            break
        default:
            secretSettingsBackgroundPreview.hidden = true
            secretSettingsBackgroundPreviewNotes.hidden = true
    }
}

function updateFontPreview() {
    switch (secretSettingsFontSelection.value) {
        case "azeret-mono":
            secretSettingsFontPreview.style.setProperty("font-family", "Azeret Mono, monospace", "important")
            break
        case "sans-serif":
            secretSettingsFontPreview.style.setProperty("font-family", "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif", "important")
            break
        case "inter":
            secretSettingsFontPreview.style.setProperty("font-family", "Inter, sans-serif", "important")
            break
        case "lato":
            secretSettingsFontPreview.style.setProperty("font-family", "Lato, sans-serif", "important")
            break
        case "montserrat":
            secretSettingsFontPreview.style.setProperty("font-family", "Montserrat, sans-serif", "important")
            break
        case "nunito":
            secretSettingsFontPreview.style.setProperty("font-family", "Nunito, sans-serif", "important")
            break
        case "poppins":
            secretSettingsFontPreview.style.setProperty("font-family", "Poppins, sans-serif", "important")
            break
        case "raleway":
            secretSettingsFontPreview.style.setProperty("font-family", "Raleway, sans-serif", "important")
            break
        case "rubik":
            secretSettingsFontPreview.style.setProperty("font-family", "Rubik, sans-serif", "important")
            break
        default:
            secretSettingsFontPreview.style.setProperty("font-family", "Azeret Mono, monospace", "important")
    }
}

function handleBeforeUnload() {
    if (changesWereMade === false) {
        changesWereMade = true
        window.addEventListener("beforeunload", (event) => {
            event.preventDefault()
        })
    }
}

updateFontPreview()
updateBackgroundPreview()
secretSettingsBackgroundPreview.hidden = false
secretSettingsBackgroundPreviewNotes.hidden = false
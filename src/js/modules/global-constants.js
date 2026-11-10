"use strict"
export const primaryTimeZone = "America/New_York"
export const currentTimeZone = Temporal.Now.timeZoneId()
export const calendarApiKey = "AIzaSyD3GwU8oQO5OEgUO6DbwgdsaO8SShJYkQ8"
export const calendarApiId = "144grand@gmail.com"
export const internalConfigFile = "/internal-config.json"
export const buildInfoFile = "/build-info.json"
export const powerSchoolStudentURL = "https://spprep.powerschool.com/public/"
export const powerSchoolTeacherURL = "https://spprep.powerschool.com/teachers/"
export const contentElement = document.getElementById("content-element")
export const backgroundElement = document.getElementById("background")
export const backgroundOverlay = document.getElementById("background-overlay")
export const clockElement = document.getElementById("clock")
export const letterDayElement = document.getElementById("letter-day")
export const letterDayTourTarget = document.getElementById("letter-day-tour-target")
export const videoBackgroundToggleButton = document.getElementById("video-background-toggle-button")
export const toggleTourButton = document.getElementById("toggle-tour-button")
export const performanceCountersButton = document.getElementById("performance-counters-button")
export const changelogButton = document.getElementById("changelog-button")
export const changelogButtonTourTarget = document.getElementById("changelog-button-tour-target")
export const bellScheduleButton = document.getElementById("bell-schedule-button")
export const bellScheduleButtonTourTarget = document.getElementById("bell-schedule-button-tour-target")
export const bellScheduleOldButton = document.getElementById("bell-schedule-old-button")
export const bellScheduleOldButtonTourTarget = document.getElementById("bell-schedule-old-button-tour-target")
export const bellScheduleButtonOuter = document.getElementsByClassName("bell-schedule-button-outer")
export const bellScheduleDialogSwitchButton = document.getElementById("bell-schedule-dialog-switch-button")
export const bellScheduleNonImageDialogSwitchButton = document.getElementById("bell-schedule-non-image-dialog-switch-button")
export const buttonContainer = document.getElementById("button-container")
export const powerSchoolButton = document.getElementById("powerschool-button")
export const gmailButton = document.getElementById("gmail-button")
export const googleDriveButton = document.getElementById("google-drive-button")
export const canvasButton = document.getElementById("canvas-button")
export const schoolCalendarButton = document.getElementById("school-calendar-button")
export const googleCalendarButton = document.getElementById("google-calendar-button")
export const membeanButton = document.getElementById("membean-button")
export const clubHubButton = document.getElementById("club-hub-button")
export const customLinkTemplate = document.getElementById("custom-link-template")
export const sealElement = document.getElementById("seal")
export const errorToast = document.getElementById("error-toast")
export const errorToastContent = document.getElementById("error-toast-content")
export const previewLayoutToast = document.getElementById("preview-layout-toast")
export const previewLayoutToastContent = document.getElementById("preview-layout-toast-content")
export const previewLayoutToastSelected = document.getElementById("preview-layout-toast-selected")
export const migrationToast = document.getElementById("migration-toast")
export const migrationToastTourLink = document.getElementById("migration-toast-tour-link")
export const passcodeDialog = document.getElementById("passcode-dialog")
export const passcodeDialogTitle = document.querySelector("#passcode-dialog .dialog-title")
export const passcodeDialogBody = document.querySelector("#passcode-dialog .dialog-body")
export const passcodeDialogVerifyButton = document.getElementById("passcode-dialog-verify")
export const passcodeDialogInput = document.getElementById("passcode-dialog-input")
export const passcodeDialogInputClearButton = document.getElementById("passcode-dialog-input-clear")
export const passcodeDialogAlertWrapper = document.getElementById("passcode-dialog-alert-wrapper")
export const passcodeDialogOpenAudio = document.getElementById("passcode-dialog-open-audio")
export const passcodeDialogControllerButtons = document.getElementsByClassName("controller-button")
export const passcodeDialogPasscode = "\u{1F53C} \u{1F53C} \u{1F53D} \u{1F53D} \u{25C0}\u{FE0F} \u{25B6}\u{FE0F} \u{25C0}\u{FE0F} \u{25B6}\u{FE0F} \u{1F171}\u{FE0F} \u{1F170}\u{FE0F} \u{1F3C3}\u{200D}\u{27A1}\u{FE0F} " // The Unicode-escaped emoji sequence representing the passcode. The spaces in between and at the end are very important.
export const selectImageImage = "./img/resources/select_image.svg"
/**
 * The list of every background that's built into the extension
 */
export const backgroundList = {
    custom: {
        name: "custom",
        type: "custom",
        description: "Harrison Green asked for this. Go thank him for that :)"
    },
    seasonal: {
        name: "seasonal",
        type: "seasonal",
        description: "This background will change automatically based on the seasons. There are only two images we can use, so a given image is actually used for two seasons.",
        seasons: {
            spring: {
                name: "spring",
                type: "image",
                file: chrome.runtime.getURL("/img/backgrounds/msc_building.webp")
            },
            summer: {
                name: "summer",
                type: "image",
                file: chrome.runtime.getURL("/img/backgrounds/msc_building.webp")
            },
            autumn: {
                name: "autumn",
                type: "image",
                file: chrome.runtime.getURL("/img/backgrounds/snow.webp")
            },
            winter: {
                name: "winter",
                type: "image",
                file: chrome.runtime.getURL("/img/backgrounds/snow.webp")
            },
        }
    },
    bliss: {
        name: "bliss",
        type: "image",
        description: "I added this in because nostalgia.",
        file: chrome.runtime.getURL("/img/backgrounds/bliss_windows_xp.webp")
    },
    osxTiger: {
        name: "osx-tiger",
        type: "image",
        description: "I added the OS X Leopard one, so there was no reason not to include this one too.<br>Image attribution: &copy; 2024 Apple<br>Source: <a href=\"https://512pixels.net/projects/default-mac-wallpapers-in-5k/\" target=\"_blank\">512pixels.net</a>",
        file: chrome.runtime.getURL("/img/backgrounds/osx_tiger.webp")
    },
    osxLeopard: {
        name: "osx-leopard",
        type: "image",
        description: "One of the people in the Programming Club Discord server suggested this one.<br>Image attribution: &copy; 2024 Apple<br>Source: <a href=\"https://512pixels.net/projects/default-mac-wallpapers-in-5k/\" target=\"_blank\">512pixels.net</a>",
        file: chrome.runtime.getURL("/img/backgrounds/osx_leopard.webp")
    },
    osxLion: {
        name: "osx-lion",
        type: "image",
        description: "I think the same guy who suggested the OS X Leopard one would like this one too.<br>Image attribution: &copy; 2024 Apple<br>Source: <a href=\"https://512pixels.net/projects/default-mac-wallpapers-in-5k/\" target=\"_blank\">512pixels.net</a>",
        file: chrome.runtime.getURL("/img/backgrounds/osx_lion.webp")
    },
    osxYosemite: {
        name: "osx-yosemite",
        type: "image",
        description: "This one is the most different from the rest of the OS X wallpapers. It's also actually the largest wallpaper (by file size) in here!<br>Image attribution: &copy; 2024 Apple<br>Source: <a href=\"https://512pixels.net/projects/default-mac-wallpapers-in-5k/\" target=\"_blank\">512pixels.net</a>",
        file: chrome.runtime.getURL("/img/backgrounds/osx_yosemite.webp")
    },
    mscBuilding: {
        name: "msc-building",
        type: "image",
        description: "This background was brought over from the older version of the extension. There is no higher quality version because I couldn't get AI upscaling to get usable results.",
        file: chrome.runtime.getURL("/img/backgrounds/msc_building.webp")
    },
    snow: {
        name: "snow",
        type: "image",
        description: "This background was introduced in version 3.0. It's also AI upscaled, but you can also use the original, low quality version instead if you want.",
        file: chrome.runtime.getURL("/img/backgrounds/snow.webp")
    },
    snowLowQuality: {
        name: "snow-low-quality",
        type: "image",
        description: "This background was introduced in version 3.0. This version of the image was shared on the Programming Club Discord server and is included as-is.",
        file: chrome.runtime.getURL("/img/backgrounds/snow_low_quality.webp")
    },
    originalFallWinter: {
        name: "original-fall-winter",
        type: "image",
        description: "Although this background was in the older version of the extension, you never actually saw it because the seasonal background feature wasn't functional at the time.",
        file: chrome.runtime.getURL("/img/backgrounds/staff_staring.webp")
    },
    streetView: {
        name: "street-view",
        type: "image",
        description: "This is a Google Street View screenshot, dating back to 2012. This version of the background was shared on the Programming Club Discord server and is included as-is.<br>Image attribution: &copy; 2024 Google",
        file: chrome.runtime.getURL("/img/backgrounds/street_view.webp")
    },
    streetViewBetter: {
        name: "street-view-better",
        type: "image",
        description: "This is a Google Street View screenshot, dating back to 2012. This background has a greater field of view and resolution, compared to the other version.<br>Image attribution: &copy; 2024 Google",
        file: chrome.runtime.getURL("/img/backgrounds/street_view_better.webp")
    },
    rainbow: {
        name: "rainbow",
        type: "image",
        description: "This background is an SVG. I could've just used CSS to make an animation like this, but the SVG works anywhere images do, which makes this the lazy option.",
        file: chrome.runtime.getURL("/img/backgrounds/rainbow.svg")
    },
    missingTexture: {
        name: "missing-texture",
        type: "image",
        description: "Looks like you forgot to install Counter-Strike: Source. I know that it <a href=\"https://store.steampowered.com/news/app/4000/view/521971443730220876?l=english#:~:text=The%20biggest,content,-%2E\">isn't necessary anymore</a> but I really don't care. Also, does anyone else at this school still play Garry's Mod?",
        file: chrome.runtime.getURL("/img/backgrounds/missing_texture.webp")
    }
}
export const validFonts = [ "azeret-mono", "sans-serif", "comic-relief", "ibm-plex-sans", "inconsolata", "inter", "jetbrains-mono", "lato", "lexend", "montserrat", "nunito", "poppins", "raleway", "roboto-mono", "rubik", "source-code-pro", "space-grotesk", "ubuntu" ]

// DO NOT touch this unless you also change the version number. It should match the extension's version number and be a string.
export const migrationVersion = "5.0"
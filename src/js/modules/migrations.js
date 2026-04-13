"use strict"
import { getInternalConfigMode } from "./config-mode.js"
import { migrationVersion, migrationToast } from "./global-constants.js"
import { getVersionParts, isNewerVersion, isSameVersion } from "./versioning.js"

/**
 * This function migrates local storage (used in pre-4.0 versions) to extension storage (which is used in this version). It should not be called directly outside this file, rather only through the `runMigrations()` function.
 */
async function migrateLocalStorage() {
    console.log("🚚 Migrating localStorage to extension storage")
    const lastExecutionDate = localStorage.getItem("lastExecutionDate")
    const secretSettingsFontSelection = localStorage.getItem("secretSettings_fontSelection")
    const secretSettingsGradientSelection = localStorage.getItem("secretSettings_gradientSelection")
    const secretSettingsBackgroundSelection = localStorage.getItem("secretSettings_backgroundSelection")
    if (lastExecutionDate !== null) {
        console.log("📦 lastExecutionDate is NOT null, running localStorage migration: Remove lastExecutionDate entirely")
        localStorage.removeItem("lastExecutionDate")
    }
    if (secretSettingsFontSelection !== null) {
        console.log("📦 secretSettings_fontSelection is NOT null, migrating secretSettings_fontSelection to extension storage and setting secretSettingsVisible")
        await chrome.storage.local.set({ secretSettingsVisible: true })
        await chrome.storage.local.set({ secretSettings_fontSelection: secretSettingsFontSelection })
        localStorage.removeItem("secretSettingsVisible")
        localStorage.removeItem("secretSettings_fontSelection")
    }
    if (secretSettingsGradientSelection !== null) {
        console.log("📦 secretSettings_gradientSelection is NOT null, migrating secretSettings_gradientSelection to extension storage and setting secretSettingsVisible")
        await chrome.storage.local.set({ secretSettingsVisible: true })
        await chrome.storage.local.set({ secretSettings_gradientSelection: secretSettingsGradientSelection })
        localStorage.removeItem("secretSettingsVisible")
        localStorage.removeItem("secretSettings_gradientSelection")
    }
    if (secretSettingsBackgroundSelection !== null) {
        console.log("📦 secretSettings_backgroundSelection is NOT null, migrating secretSettings_backgroundSelection to extension storage and setting secretSettingsVisible")
        await chrome.storage.local.set({ secretSettingsVisible: true })
        await chrome.storage.local.set({ secretSettings_backgroundSelection: secretSettingsBackgroundSelection })
        if (secretSettingsBackgroundSelection === "rickroll") {
            console.log("📦 secretSettings_backgroundSelection is rickroll, setting it to rainbow")
            await chrome.storage.local.set({ secretSettings_backgroundSelection: "rainbow" })
        }
        localStorage.removeItem("secretSettingsVisible")
        localStorage.removeItem("secretSettings_backgroundSelection")
    }
    console.log("📦 Deleting migrationVersion from localStorage (NOT from extension storage)")
    localStorage.removeItem("migrationVersion")
    console.log("✅ Migrated localStorage to extension storage!")
}

/**
 * This function runs migrations, which ensure that settings and other extension data are preserved through extension updates (which may store things in different places and formats). This function should be the (one of) the first things run on page load, to ensure that the migrations are applied _before_ any settings are loaded.
 */
export async function runMigrations() {
    try {
        const timeStart = performance.now()
        console.log("🔍 Running migrations")
        const storedMigrationVersionInitial = (await chrome.storage.local.get())["migrationVersion"]
        if (storedMigrationVersionInitial === undefined) {
            console.log(`💾 migrationVersion is undefined, migrating localStorage to extension storage...`)
            await migrateLocalStorage()
            console.log(`👨‍🔧 Setting default layout mode...`)
            const internalConfigMode = await getInternalConfigMode()
            switch (internalConfigMode) {
                case "student":
                    await chrome.storage.local.set({ settings_enableSplitLayoutSelection: false })
                    console.log("✅ Set default layout mode to \"stacked\"!")
                    break
                case "staff":
                    await chrome.storage.local.set({ settings_enableSplitLayoutSelection: true })
                    console.log("✅ Set the default layout mode to \"split\"!")
                    break
            }
        } else {
            if (typeof storedMigrationVersionInitial === "number") {
                console.log(`📝 storedMigrationVersion is a number, migrating it to a string...`)
                await chrome.storage.local.set({ migrationVersion: storedMigrationVersionInitial.toString() })
            }
            const storedMigrationVersion = (await chrome.storage.local.get())["migrationVersion"]
            if (isSameVersion(storedMigrationVersion, migrationVersion)) {
                console.log(`✅ migrationVersion is ${migrationVersion}, no migrations necessary.`)
                return
            }
            if (isNewerVersion(migrationVersion, storedMigrationVersion)) {
                console.log(`🕒 migrationVersion "${migrationVersion}" is newer than storedMigrationVersion "${storedMigrationVersion}", going to run migrations...`)
            }
        }
        // Run any specific migrations for certain migrationVersion values here. There aren't any right now, but this is just for futureproofing.
        try {
            bootstrap.Toast.getOrCreateInstance(migrationToast).show()
        } catch {
            console.log("🤔 Failed to show migrationToast. This is expected if the current page is not index.html")
        }
        await chrome.storage.local.set({ migrationVersion: migrationVersion })
        const storedMigrationVersionNew = (await chrome.storage.local.get())["migrationVersion"]
        const timeEnd = performance.now()
        console.log(`✅ Migrations finished! migrationVersion is ${storedMigrationVersionNew} and took ${timeEnd - timeStart} ms`)
    } catch (error) {
        console.error(error)
        alert(`Oops, something went wrong while running migrations. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}`)
    }
}

/**
 * This function runs cloud migrations. These are similar to regular migrations, just for cloud (sync) storage.
 */
export async function runCloudMigrations() {
    try {
        const timeStart = performance.now()
        console.log("☁️ Running cloud migrations")
        const storedMigrationVersionInitial = (await chrome.storage.sync.get())["migrationVersion"]
        if (storedMigrationVersionInitial === undefined) {
            console.log(`💾 cloud migrationVersion is undefined, going to set it...`)
            await chrome.storage.sync.set({ migrationVersion: migrationVersion })
        }
        const storedMigrationVersion = (await chrome.storage.sync.get())["migrationVersion"]
        if (isSameVersion(storedMigrationVersion, migrationVersion)) {
            console.log(`✅ cloud migrationVersion is ${migrationVersion}, no migrations necessary.`)
            return
        }
        if (isNewerVersion(migrationVersion, storedMigrationVersion)) {
            console.log(`🕒 cloud migrationVersion "${migrationVersion}" is newer than storedMigrationVersion "${storedMigrationVersion}", going to run migrations...`)
        }
        if (isNewerVersion(storedMigrationVersion, migrationVersion)) {
            console.error(`🕒 cloud migrationVersion "${migrationVersion}" is older than storedMigrationVersion "${storedMigrationVersion}", going to bail out!`)
            return
        }
        // Run any specific migrations for certain migrationVersion values here. There aren't any right now, but this is just for futureproofing.
        await chrome.storage.sync.set({ migrationVersion: migrationVersion })
        const storedMigrationVersionNew = (await chrome.storage.sync.get())["migrationVersion"]
        const timeEnd = performance.now()
        console.log(`✅ Cloud migrations finished! migrationVersion is ${storedMigrationVersionNew} and took ${timeEnd - timeStart} ms`)
    } catch (error) {
        console.error(error)
        alert(`Oops, something went wrong while running cloud migrations. This is not supposed to be happening! If you can reproduce this issue, report it here: https://github.com/spp-programming/SPPrep-New-Tab-Next/issues\n\n${error}`)
    }
}
"use strict"
import { getInternalConfigMode } from "./config-mode.js"
import { migrationVersion, migrationToast } from "./global-constants.js"

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

export async function runMigrations() {
    console.log("🔍 Running migrations")
    const storedMigrationVersion = (await chrome.storage.local.get())["migrationVersion"]
    if (storedMigrationVersion === migrationVersion) {
        console.log(`✅ migrationVersion is ${migrationVersion}, no migrations necessary.`)
        return
    }
    if (storedMigrationVersion === undefined) {
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
    }
    // Run any specific migrations for certain migrationVersion values here. There aren't any right now, but this is just for futureproofing.
    try {
        bootstrap.Toast.getOrCreateInstance(migrationToast).show()
    } catch {
        console.log("🤔 Failed to show migrationToast. This is expected if the current page is not index.html")
    }
    await chrome.storage.local.set({ migrationVersion: migrationVersion })
    const storedMigrationVersionNew = (await chrome.storage.local.get())["migrationVersion"]
    console.log(`✅ Migrations finished! migrationVersion is ${storedMigrationVersionNew}`)
}
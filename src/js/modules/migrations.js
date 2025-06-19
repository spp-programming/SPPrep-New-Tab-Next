"use strict"
import { migrationVersion, migrationToast } from "./global-constants.js"
export function runMigrations() {
    console.log("Running migrations for localStorage")
    if (localStorage.getItem("migrationVersion") == migrationVersion) {
        console.log(`✅ migrationVersion is ${migrationVersion}, no migrations necessary.`)
        return "success"
    }
    if (localStorage.getItem("migrationVersion") === null) {
        console.log(`🤔 migrationVersion is null, going to check if migrations are necessary.`)
    }
    // Run any migrations for migrationVersion 1 and below, if that's even possible, here.
    if (localStorage.getItem("lastExecutionDate") !== null) {
        console.log("lastExecutionDate is NOT null, running migration: Remove lastExecutionDate")
        localStorage.removeItem("lastExecutionDate")
        console.log("lastExecutionDate is now removed, going to get migrationVersion to 2")
        localStorage.setItem("migrationVersion", "2")
    }
    // Run any migrations for migrationVersion 2 here.
    if (localStorage.getItem("secretSettings_fontSelection") !== null) {
        console.log("secretSettings_fontSelection is NOT null, running migration: Add secretSettingsVisible")
        localStorage.setItem("secretSettingsVisible", "true")
        console.log("secretSettingsVisible is now added, going to get migrationVersion to 3")
        localStorage.setItem("migrationVersion", "3")
    }
    if (localStorage.getItem("secretSettings_gradientSelection") !== null) {
        console.log("secretSettings_gradientSelection is NOT null, running migration: Add secretSettingsVisible")
        localStorage.setItem("secretSettingsVisible", "true")
        console.log("secretSettingsVisible is now added, going to get migrationVersion to 3")
        localStorage.setItem("migrationVersion", "3")
    }
    if (localStorage.getItem("secretSettings_backgroundSelection") !== null) {
        console.log("secretSettings_backgroundSelection is NOT null, running migration: Add secretSettingsVisible")
        localStorage.setItem("secretSettingsVisible", "true")
        console.log("secretSettingsVisible is now added, going to get migrationVersion to 3")
        localStorage.setItem("migrationVersion", "3")
    }
    // Run any migrations for migrationVersion 3 here.
    if (~ ["osx-tiger", "osx-leopard", "osx-lion", "osx-yosemite"].indexOf(localStorage.getItem("secretSettings_backgroundSelection"))) {
        console.log("secretSettings_backgroundSelection contains OS X wallpapers, going to set migrationVersion to 3.1")
        localStorage.setItem("migrationVersion", "3.1")
    }
    // Run any migrations for migrationVersion 3.1 here.
    // Migrations for migrationVersion 3.2 are being run below:
    if (localStorage.getItem("secretSettings_backgroundSelection") === "rickroll") {
        console.log("secretSettings_backgroundSelection is rickroll, running migration: Rickroll compatibility fix")
        localStorage.setItem("secretSettings_backgroundSelection", "rainbow")
        console.log("secretSettings_backgroundSelection is now set to rainbow, going to set migrationVersion to 3.2")
        localStorage.setItem("migrationVersion", "3.2")
    }
    // Migrations for migrationVersion 4 are being run below:
    bootstrap.Toast.getOrCreateInstance(migrationToast).show()
    localStorage.setItem("migrationVersion", "4")
    
    console.log(`✅ Migrations finished! migrationVersion is ${localStorage.getItem("migrationVersion")}`)
}
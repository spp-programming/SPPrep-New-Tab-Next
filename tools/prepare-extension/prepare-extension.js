#!/usr/bin/env node
"use strict"
import { argv } from "node:process"
import { join } from "node:path"
import { cpSync, rmSync, statSync } from "node:fs"

let selectedAction
let sanityCounter = 0

const srcFolder = join(import.meta.dirname, "..", "..", "src")
const srcPreparedFolder = join(import.meta.dirname, "..", "..", "src.prepared")
const srcPreparedFolderManifest = join(srcPreparedFolder, "manifest.json")
const srcPreparedFolderManifestStudent = join(srcPreparedFolder, "manifest.student.json")
const srcPreparedFolderManifestStaff = join(srcPreparedFolder, "manifest.staff.json")
const srcPreparedFolderInternalConfig = join(srcPreparedFolder, "internal-config.json")
const srcPreparedFolderInternalConfigStudent = join(srcPreparedFolder, "internal-config.student.json")
const srcPreparedFolderInternalConfigStaff = join(srcPreparedFolder, "internal-config.staff.json")

argv.forEach((val, _index) => {
    if (val === "student") {
        selectedAction = "student"
        sanityCounter++
    }
    if (val === "staff") {
        selectedAction = "staff"
        sanityCounter++
    }
})

if (sanityCounter < 1) {
    throw Error("No valid arguments passed. You should read README.md")
}

if (sanityCounter > 1) {
    throw Error("You can only pass in \"student\" or \"staff\", but not both or multiples of each.")
}

console.log(`selectedAction is \"${selectedAction}\"`)
console.log(`srcFolder is \"${srcFolder}\"`)
console.log(`srcPreparedFolder is \"${srcPreparedFolder}\"`)

if (!statSync(srcFolder).isDirectory()) {
    throw Error("srcFolder \"${srcPreparedFolder}\" isn't a directory!")
}

console.log(`Copying srcFolder \"${srcFolder}\" to srcPreparedFolder \"${srcPreparedFolder}\"`)
cpSync(srcFolder, srcPreparedFolder, {force: true, recursive: true})

switch (selectedAction) {
    case "student":
        console.log(`Copying srcPreparedFolderManifestStudent \"${srcPreparedFolderManifestStudent}\" to srcPreparedFolderManifest \"${srcPreparedFolderManifest}\"`)
        cpSync(srcPreparedFolderManifestStudent, srcPreparedFolderManifest, {force: true})

        console.log(`Copying srcPreparedFolderInternalConfigStudent \"${srcPreparedFolderInternalConfigStudent}\" to srcPreparedFolderInternalConfig \"${srcPreparedFolderInternalConfig}\"`)
        cpSync(srcPreparedFolderInternalConfigStudent, srcPreparedFolderInternalConfig, {force: true})

        break
    case "staff":
        console.log(`Copying srcPreparedFolderManifestStaff \"${srcPreparedFolderManifestStaff}\" to srcPreparedFolderManifest \"${srcPreparedFolderManifest}\"`)
        cpSync(srcPreparedFolderManifestStaff, srcPreparedFolderManifest, {force: true})

        console.log(`Copying srcPreparedFolderInternalConfigStaff \"${srcPreparedFolderInternalConfigStaff}\" to srcPreparedFolderInternalConfig \"${srcPreparedFolderInternalConfig}\"`)
        cpSync(srcPreparedFolderInternalConfigStaff, srcPreparedFolderInternalConfig, {force: true})

        break
    default:
        throw Error(`Unknown value for selectedAction (${selectedAction}). This should not be happening!`)
}

console.log(`Deleting srcPreparedFolderManifestStudent \"${srcPreparedFolderManifestStudent}\"`)
rmSync(srcPreparedFolderManifestStudent)

console.log(`Deleting srcPreparedFolderManifestStaff \"${srcPreparedFolderManifestStaff}\"`)
rmSync(srcPreparedFolderManifestStaff)

console.log(`Deleting srcPreparedFolderInternalConfigStudent \"${srcPreparedFolderInternalConfigStudent}\"`)
rmSync(srcPreparedFolderInternalConfigStudent)

console.log(`Deleting srcPreparedFolderInternalConfigStaff \"${srcPreparedFolderInternalConfigStaff}\"`)
rmSync(srcPreparedFolderInternalConfigStaff)

console.log("All done!")
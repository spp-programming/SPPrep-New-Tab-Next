#!/usr/bin/env node
"use strict"
import { argv } from "node:process"
import { basename, join } from "node:path"
import { cpSync, rmSync, statSync, writeFileSync } from "node:fs"
import { execSync } from "node:child_process"

let selectedAction
let sanityCounter = 0

const srcFolder = join(import.meta.dirname, "..", "..", "src")
const srcPreparedFolder = join(import.meta.dirname, "..", "..", "src.prepared")
const srcPreparedFolderManifest = join(srcPreparedFolder, "manifest.json")
const srcPreparedFolderManifestFirefoxStudent = join(srcPreparedFolder, "manifest.firefox.student.json")
const srcPreparedFolderManifestFirefoxStaff = join(srcPreparedFolder, "manifest.firefox.staff.json")
const srcPreparedFolderManifestStudent = join(srcPreparedFolder, "manifest.student.json")
const srcPreparedFolderManifestStaff = join(srcPreparedFolder, "manifest.staff.json")
const srcPreparedFolderInternalConfig = join(srcPreparedFolder, "internal-config.json")
const srcPreparedFolderInternalConfigStudent = join(srcPreparedFolder, "internal-config.student.json")
const srcPreparedFolderInternalConfigStaff = join(srcPreparedFolder, "internal-config.staff.json")
const srcPreparedFolderBuildInfo = join(srcPreparedFolder, "build-info.json")

function constructRevisionName() {
    let latestRev = ""
    let isDirty = false
    console.log("Running \"git rev-parse --short HEAD\" to find HEAD's rev value")
    try {
        latestRev = execSync(`git -C "${srcFolder}" rev-parse --short HEAD`, {encoding: "utf-8"}).trim()
        console.log(`HEAD's rev value is ${latestRev}`)
        if (/[0-9a-f]/.test(latestRev) === false) {
            throw Error("\"git rev-parse\" returned an invalid rev value!")
        }
    } catch (error) {
        console.error(error)
        console.log("Something went wrong while trying to run \"git rev-parse --short HEAD\". Assuming this is the non_git version.")
        latestRev = "non_git"
    }
    console.log("Running \"git status --porcelain\" to see if the working tree is dirty")
    try {
        const isDirtyCommand = execSync(`git -C "${srcFolder}" status --porcelain`, {encoding: "utf-8"}).trim()
        if (isDirtyCommand !== "") {
            console.log("The working tree is dirty.")
            isDirty = true
        } else {
            console.log("The working tree is clean.")
        }
    } catch (error) {
        console.error(error)
        console.log("Something went wrong while trying to run \"git status --porcelain\". Assuming the working tree is clean.")
    }
    if (isDirty === true) {
        return `${latestRev}-dirty`
    } else {
        return latestRev
    }
}

argv.forEach((val, _index) => {
    if (val === "student") {
        selectedAction = "student"
        sanityCounter++
    }
    if (val === "staff") {
        selectedAction = "staff"
        sanityCounter++
    }
    if (val === "firefox-student") {
        selectedAction = "firefox-student"
        sanityCounter++
    }
    if (val === "firefox-staff") {
        selectedAction = "firefox-staff"
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

console.log(`Removing srcPreparedFolder \"${srcPreparedFolder}\"`)
rmSync(srcPreparedFolder, {force: true, recursive: true})

console.log(`Copying srcFolder \"${srcFolder}\" to srcPreparedFolder \"${srcPreparedFolder}\"`)
cpSync(srcFolder, srcPreparedFolder, {
    force: true,
    recursive: true,
    filter: (srcFileName) => {
        if (basename(srcFileName) === ".DS_Store") {
            console.log(`File was skipped: ${srcFileName}`)
            return false
        }
        return true
    }
})

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
    case "firefox-student":
        console.log(`Copying srcPreparedFolderManifestFirefoxStudent \"${srcPreparedFolderManifestFirefoxStudent}\" to srcPreparedFolderManifest \"${srcPreparedFolderManifest}\"`)
        cpSync(srcPreparedFolderManifestFirefoxStudent, srcPreparedFolderManifest, {force: true})

        console.log(`Copying srcPreparedFolderInternalConfigStudent \"${srcPreparedFolderInternalConfigStudent}\" to srcPreparedFolderInternalConfig \"${srcPreparedFolderInternalConfig}\"`)
        cpSync(srcPreparedFolderInternalConfigStudent, srcPreparedFolderInternalConfig, {force: true})

        break
    case "firefox-staff":
        console.log(`Copying srcPreparedFolderManifestFirefoxStaff \"${srcPreparedFolderManifestFirefoxStaff}\" to srcPreparedFolderManifest \"${srcPreparedFolderManifest}\"`)
        cpSync(srcPreparedFolderManifestFirefoxStaff, srcPreparedFolderManifest, {force: true})

        console.log(`Copying srcPreparedFolderInternalConfigStaff \"${srcPreparedFolderInternalConfigStaff}\" to srcPreparedFolderInternalConfig \"${srcPreparedFolderInternalConfig}\"`)
        cpSync(srcPreparedFolderInternalConfigStaff, srcPreparedFolderInternalConfig, {force: true})

        break
    default:
        throw Error(`Unknown value for selectedAction (${selectedAction}). This should not be happening!`)
}

console.log(`Loading contents of srcPreparedFolderManifest "${srcPreparedFolderManifest}`)
const srcPreparedFolderManifestContent = (await import(srcPreparedFolderManifest, { with: { type: "json" } })).default

if (selectedAction === "student" || selectedAction === "staff") {
    console.log(`Inserting version_name into srcPreparedFolderManifest "${srcPreparedFolderManifest}"`)
    const srcPreparedFolderManifestContentNew = JSON.parse(JSON.stringify(srcPreparedFolderManifestContent))
    srcPreparedFolderManifestContentNew.version_name = `${srcPreparedFolderManifestContentNew.version} (${selectedAction}, ${constructRevisionName()})`
    writeFileSync(srcPreparedFolderManifest, JSON.stringify(srcPreparedFolderManifestContentNew, null, 2))
}

console.log(`Creating srcPreparedFolderBuildInfo "${srcPreparedFolderBuildInfo}"`)
const buildInfo = {
    version: srcPreparedFolderManifestContent.version,
    edition: selectedAction,
    revision: constructRevisionName()
}
writeFileSync(srcPreparedFolderBuildInfo, JSON.stringify(buildInfo, null, 2))

console.log(`Deleting srcPreparedFolderManifestStudent \"${srcPreparedFolderManifestStudent}\"`)
rmSync(srcPreparedFolderManifestStudent)

console.log(`Deleting srcPreparedFolderManifestStaff \"${srcPreparedFolderManifestStaff}\"`)
rmSync(srcPreparedFolderManifestStaff)

console.log(`Deleting srcPreparedFolderManifestFirefoxStudent \"${srcPreparedFolderManifestFirefoxStudent}\"`)
rmSync(srcPreparedFolderManifestFirefoxStudent)

console.log(`Deleting srcPreparedFolderManifestFirefoxStaff \"${srcPreparedFolderManifestFirefoxStaff}\"`)
rmSync(srcPreparedFolderManifestFirefoxStaff)

console.log(`Deleting srcPreparedFolderInternalConfigStudent \"${srcPreparedFolderInternalConfigStudent}\"`)
rmSync(srcPreparedFolderInternalConfigStudent)

console.log(`Deleting srcPreparedFolderInternalConfigStaff \"${srcPreparedFolderInternalConfigStaff}\"`)
rmSync(srcPreparedFolderInternalConfigStaff)

console.log("All done!")
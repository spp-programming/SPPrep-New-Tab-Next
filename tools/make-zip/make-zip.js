#!/usr/bin/env node
import AdmZip from "adm-zip"
import path from "node:path"

const srcFolder = path.join(import.meta.dirname, "..", "..", "src")
const zipLocation = path.join(import.meta.dirname, "out.zip")
const zipFile = new AdmZip()

console.log(`srcFolder is ${srcFolder}`)
console.log(`zipLocation is ${zipLocation}`)

console.log(`Adding local folder: ${srcFolder}`)
zipFile.addLocalFolder(srcFolder)
console.log(`Writing zip file: ${zipLocation}`)
zipFile.writeZip(zipLocation)
console.log("Done!")
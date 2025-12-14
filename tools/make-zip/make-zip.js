#!/usr/bin/env node
"use strict"
import AdmZip from "adm-zip"
import { join } from "node:path"

const srcFolder = join(import.meta.dirname, "..", "..", "src.prepared")
const zipLocation = join(import.meta.dirname, "out.zip")
const zipFile = new AdmZip()

console.log(`srcFolder is ${srcFolder}`)
console.log(`zipLocation is ${zipLocation}`)

console.log(`Adding local folder: ${srcFolder}`)
zipFile.addLocalFolder(srcFolder)
console.log(`Writing zip file: ${zipLocation}`)
zipFile.writeZip(zipLocation)
console.log("Done!")
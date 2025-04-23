"use strict";
export function readStorageEntry(entryName) {
    localStorage.getItem(entryName)
}

export function writeStorageEntry(entryName, value) {
    localStorage.setItem(entryName, value)
}

export function removeStorageEntry(entryName) {
    localStorage.removeItem(entryName)
}
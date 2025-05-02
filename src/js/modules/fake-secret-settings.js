"use strict";
import { secretSettingsModal } from "./global-constants.js"

export function openSecretSettings() {
    const secretSettingsModalBS = new bootstrap.Modal(secretSettingsModal)
    secretSettingsModalBS.show()
}
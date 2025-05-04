"use strict";
import { handleFakeLinks } from "./modules/fake-links.js"

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerElement => new bootstrap.Tooltip(tooltipTriggerElement))

handleFakeLinks()
"use strict"

/**
 * 
 * @param {import("./calendar-api.js").CalendarEvent[]} todaysEvents 
 * @returns {("A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"🤷‍♂️"|"😐")} Returns letters A-H (inclusive) when there is a letter day today (as specified in `todaysEvents`), otherwise returns man shrugging emoji (🤷‍♂️). If there are multiple letter days today, it returns neutral face emoji (😐) instead.
 */
export function getLetterDay(todaysEvents) {
    console.log(todaysEvents)

    // Check if letterDay array is not empty
    if (todaysEvents.length > 0 && todaysEvents[0] && todaysEvents[0].summary) {
        let letterDayExtracted
        let sanityCounter = 0
        todaysEvents.forEach(event => {
            if (extractLetterDay(event.summary) !== "🤷‍♂️") {
                sanityCounter++
                letterDayExtracted = extractLetterDay(event.summary)
            }
        })
        if (letterDayExtracted === undefined) {
            letterDayExtracted = "🤷‍♂️"
        } else if (sanityCounter > 1) {
            console.log(`sanityCounter is ${sanityCounter}`)
            // Handle the edge case where multiple letter days are found.
            console.error("Multiple letter days were found for today. This is most probably a bug.")
            letterDayExtracted = "😐"
        }
        sanityCounter = 0
        return letterDayExtracted
    } else {
        // Handle the case where no matching letter day is found
        console.log("No letter day found in today's events.")
        return "🤷‍♂️"  // or some default value or throw an error
    }
}

/**
 * 
 * @param {string} eventName Event name to extract the letter day from.
 * @returns {("A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"🤷‍♂️")} Returns letters A-H (inclusive) when there is a letter day (as specified in `eventName`), otherwise returns man shrugging emoji (🤷‍♂️).
 */
function extractLetterDay(eventName) {
    const eventNameTrimmed = eventName.trim()
    // Is there any way to optimize this atrocity? Update: Nvm, I actually did optimize it :)
    const exactlyMatchesLetterA = ["A"] 
    const startsWithLetterA = ["A - Assembly", "A- Assembly", "A -Assembly", "A-Assembly", "A (Cycle", "A(Cycle", "A ( Cycle", "A( Cycle", "A (End of MP", "A(End of MP", "A ( End of MP", "A( End of MP"]
    const exactlyMatchesLetterB = ["B"]
    const startsWithLetterB = ["B - Assembly", "B- Assembly", "B -Assembly", "B-Assembly", "B (Cycle", "B(Cycle", "B ( Cycle", "B( Cycle", "B (End of MP", "B(End of MP", "B ( End of MP", "B( End of MP"]
    const exactlyMatchesLetterC = ["C"]
    const startsWithLetterC = ["C - Assembly", "C- Assembly", "C -Assembly", "C-Assembly", "C (Cycle", "C(Cycle", "C ( Cycle", "C( Cycle", "C (End of MP", "C(End of MP", "C ( End of MP", "C( End of MP"]
    const exactlyMatchesLetterD = ["D"]
    const startsWithLetterD = ["D - Assembly", "D- Assembly", "D -Assembly", "D-Assembly", "D (Cycle", "D(Cycle", "D ( Cycle", "D( Cycle", "D (End of MP", "D(End of MP", "D ( End of MP", "D( End of MP"]
    const exactlyMatchesLetterE = ["E"]
    const startsWithLetterE = ["E - Assembly", "E- Assembly", "E -Assembly", "E-Assembly", "E (Cycle", "E(Cycle", "E ( Cycle", "E( Cycle", "E (End of MP", "E(End of MP", "E ( End of MP", "E( End of MP"]
    const exactlyMatchesLetterF = ["F"]
    const startsWithLetterF = ["F - Assembly", "F- Assembly", "F -Assembly", "F-Assembly", "F (Cycle", "F(Cycle", "F ( Cycle", "F( Cycle", "F (End of MP", "F(End of MP", "F ( End of MP", "F( End of MP"]
    const exactlyMatchesLetterG = ["G"]
    const startsWithLetterG = ["G - Assembly", "G- Assembly", "G -Assembly", "G-Assembly", "G (Cycle", "G(Cycle", "G ( Cycle", "G( Cycle", "G (End of MP", "G(End of MP", "G ( End of MP", "G( End of MP"]
    const exactlyMatchesLetterH = ["H"]
    const startsWithLetterH = ["H - Assembly", "H- Assembly", "H -Assembly", "H-Assembly", "H (Cycle", "H(Cycle", "H ( Cycle", "H( Cycle", "H (End of MP", "H(End of MP", "H ( End of MP", "H( End of MP"]
    if (exactlyMatchesLetterA.includes(eventNameTrimmed)) {
        return "A"
    } else if (startsWithLetterA.some(substr => eventNameTrimmed.startsWith(substr))) {
        return "A"
    } else if (exactlyMatchesLetterB.includes(eventNameTrimmed)) {
        return "B"
    } else if (startsWithLetterB.some(substr => eventNameTrimmed.startsWith(substr))) {
        return "B"
    } else if (exactlyMatchesLetterC.includes(eventNameTrimmed)) {
        return "C"
    } else if (startsWithLetterC.some(substr => eventNameTrimmed.startsWith(substr))) {
        return "C"
    } else if (exactlyMatchesLetterD.includes(eventNameTrimmed)) {
        return "D"
    } else if (startsWithLetterD.some(substr => eventNameTrimmed.startsWith(substr))) {
        return "D"
    } else if (exactlyMatchesLetterE.includes(eventNameTrimmed)) {
        return "E"
    } else if (startsWithLetterE.some(substr => eventNameTrimmed.startsWith(substr))) {
        return "E"
    } else if (exactlyMatchesLetterF.includes(eventNameTrimmed)) {
        return "F"
    } else if (startsWithLetterF.some(substr => eventNameTrimmed.startsWith(substr))) {
        return "F"
    } else if (exactlyMatchesLetterG.includes(eventNameTrimmed)) {
        return "G"
    } else if (startsWithLetterG.some(substr => eventNameTrimmed.startsWith(substr))) {
        return "G"
    } else if (exactlyMatchesLetterH.includes(eventNameTrimmed)) {
        return "H"
    } else if (startsWithLetterH.some(substr => eventNameTrimmed.startsWith(substr))) {
        return "H"
    } else {
        // Handle the case where no matching letter day is found
        console.log(`No letter day extracted for description: ${eventName}`)
        return "🤷‍♂️"  // or some default value or throw an error
    }
}
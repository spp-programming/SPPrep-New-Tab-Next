"use strict"
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

function extractLetterDay(eventName) {
    // Is there any way to optimize this atrocity?
    const exactlyMatchesLetterA = ["A", "A ", " A", " A ", "A  ", "  A", "  A  "] 
    const startsWithLetterA = ["A - Assembly", "A- Assembly", " A -Assembly", "A-Assembly", " A - Assembly", " A- Assembly", " A -Assembly", " A-Assembly", "A (Cycle", "A(Cycle", "A ( Cycle", "A( Cycle", " A (Cycle", " A(Cycle", " A (Cycle", " A(Cycle", " A ( Cycle", " A( Cycle", "A (End of MP", "A(End of MP", "A ( End of MP", "A( End of MP", " A (End of MP", " A(End of MP", " A (End of MP", " A(End of MP", " A ( End of MP", " A( End of MP"]
    const exactlyMatchesLetterB = ["B", "B ", " B", " B ", "B  ", "  B", "  B  "]
    const startsWithLetterB = ["B - Assembly", "B- Assembly", " B -Assembly", "B-Assembly", " B - Assembly", " B- Assembly", " B -Assembly", " B-Assembly", "B (Cycle", "B(Cycle", "B ( Cycle", "B( Cycle", " B (Cycle", " B(Cycle", " B (Cycle", " B(Cycle", " B ( Cycle", " B( Cycle", "B (End of MP", "B(End of MP", "B ( End of MP", "B( End of MP", " B (End of MP", " B(End of MP", " B (End of MP", " B(End of MP", " B ( End of MP", " B( End of MP"]
    const exactlyMatchesLetterC = ["C", "C ", " C", " C ", "C  ", "  C", "  C  "]
    const startsWithLetterC = ["C - Assembly", "C- Assembly", " C -Assembly", "C-Assembly", " C - Assembly", " C- Assembly", " C -Assembly", " C-Assembly", "C (Cycle", "C(Cycle", "C ( Cycle", "C( Cycle", " C (Cycle", " C(Cycle", " C (Cycle", " C(Cycle", " C ( Cycle", " C( Cycle", "C (End of MP", "C(End of MP", "C ( End of MP", "C( End of MP", " C (End of MP", " C(End of MP", " C (End of MP", " C(End of MP", " C ( End of MP", " C( End of MP"]
    const exactlyMatchesLetterD = ["D", "D ", " D", " D ", "D  ", "  D", "  D  "]
    const startsWithLetterD = ["D - Assembly", "D- Assembly", " D -Assembly", "D-Assembly", " D - Assembly", " D- Assembly", " D -Assembly", " D-Assembly", "D (Cycle", "D(Cycle", "D ( Cycle", "D( Cycle", " D (Cycle", " D(Cycle", " D (Cycle", " D(Cycle", " D ( Cycle", " D( Cycle", "D (End of MP", "D(End of MP", "D ( End of MP", "D( End of MP", " D (End of MP", " D(End of MP", " D (End of MP", " D(End of MP", " D ( End of MP", " D( End of MP"]
    const exactlyMatchesLetterE = ["E", "E ", " E", " E ", "E  ", "  E", "  E  "]
    const startsWithLetterE = ["E - Assembly", "E- Assembly", " E -Assembly", "E-Assembly", " E - Assembly", " E- Assembly", " E -Assembly", " E-Assembly", "E (Cycle", "E(Cycle", "E ( Cycle", "E( Cycle", " E (Cycle", " E(Cycle", " E (Cycle", " E(Cycle", " E ( Cycle", " E( Cycle", "E (End of MP", "E(End of MP", "E ( End of MP", "E( End of MP", " E (End of MP", " E(End of MP", " E (End of MP", " E(End of MP", " E ( End of MP", " E( End of MP"]
    const exactlyMatchesLetterF = ["F", "F ", " F", " F ", "F  ", "  F", "  F  "]
    const startsWithLetterF = ["F - Assembly", "F- Assembly", " F -Assembly", "F-Assembly", " F - Assembly", " F- Assembly", " F -Assembly", " F-Assembly", "F (Cycle", "F(Cycle", "F ( Cycle", "F( Cycle", " F (Cycle", " F(Cycle", " F (Cycle", " F(Cycle", " F ( Cycle", " F( Cycle", "F (End of MP", "F(End of MP", "F ( End of MP", "F( End of MP", " F (End of MP", " F(End of MP", " F (End of MP", " F(End of MP", " F ( End of MP", " F( End of MP"]
    const exactlyMatchesLetterG = ["G", "G ", " G", " G ", "G  ", "  G", "  G  "]
    const startsWithLetterG = ["G - Assembly", "G- Assembly", " G -Assembly", "G-Assembly", " G - Assembly", " G- Assembly", " G -Assembly", " G-Assembly", "G (Cycle", "G(Cycle", "G ( Cycle", "G( Cycle", " G (Cycle", " G(Cycle", " G (Cycle", " G(Cycle", " G ( Cycle", " G( Cycle", "G (End of MP", "G(End of MP", "G ( End of MP", "G( End of MP", " G (End of MP", " G(End of MP", " G (End of MP", " G(End of MP", " G ( End of MP", " G( End of MP"]
    const exactlyMatchesLetterH = ["H", "H ", " H", " H ", "H  ", "  H", "  H  "]
    const startsWithLetterH = ["H - Assembly", "H- Assembly", " H -Assembly", "H-Assembly", " H - Assembly", " H- Assembly", " H -Assembly", " H-Assembly", "H (Cycle", "H(Cycle", "H ( Cycle", "H( Cycle", " H (Cycle", " H(Cycle", " H (Cycle", " H(Cycle", " H ( Cycle", " H( Cycle", "H (End of MP", "H(End of MP", "H ( End of MP", "H( End of MP", " H (End of MP", " H(End of MP", " H (End of MP", " H(End of MP", " H ( End of MP", " H( End of MP"]
    if (exactlyMatchesLetterA.includes(eventName)) {
        return "A"
    } else if (startsWithLetterA.some(substr => eventName.startsWith(substr))) {
        return "A"
    } else if (exactlyMatchesLetterB.includes(eventName)) {
        return "B"
    } else if (startsWithLetterB.some(substr => eventName.startsWith(substr))) {
        return "B"
    } else if (exactlyMatchesLetterC.includes(eventName)) {
        return "C"
    } else if (startsWithLetterC.some(substr => eventName.startsWith(substr))) {
        return "C"
    } else if (exactlyMatchesLetterD.includes(eventName)) {
        return "D"
    } else if (startsWithLetterD.some(substr => eventName.startsWith(substr))) {
        return "D"
    } else if (exactlyMatchesLetterE.includes(eventName)) {
        return "E"
    } else if (startsWithLetterE.some(substr => eventName.startsWith(substr))) {
        return "E"
    } else if (exactlyMatchesLetterF.includes(eventName)) {
        return "F"
    } else if (startsWithLetterF.some(substr => eventName.startsWith(substr))) {
        return "F"
    } else if (exactlyMatchesLetterG.includes(eventName)) {
        return "G"
    } else if (startsWithLetterG.some(substr => eventName.startsWith(substr))) {
        return "G"
    } else if (exactlyMatchesLetterH.includes(eventName)) {
        return "H"
    } else if (startsWithLetterH.some(substr => eventName.startsWith(substr))) {
        return "H"
    } else {
        // Handle the case where no matching letter day is found
        console.log(`No letter day extracted for description: ${eventName}`)
        return "🤷‍♂️"  // or some default value or throw an error
    }
}
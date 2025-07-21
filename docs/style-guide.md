# The (heavily opinionated) Style Guide
There are certain conventions that should be used within the source code here to keep things consistent.
> [!IMPORTANT]
> Note the use of "should" on the line above. These are suggestions. You are strongly recommended to follow these guidelines, but they aren't absolutely required.
> If you disagree with something here, you should discuss it with other members before making any changes. This ensures that everyone is on the same page with regards to this stuff. Thanks!

## JavaScript
### Use ESM
[ECMAScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) are used extensively. **If you think something should go in a module, it probably does.** Examples of this include `calendar-api.js` and `letter-day-extractor.js`. Things like `main.js` and `popup.js` are **specific to pages** and should be the **only JavaScript file** sourced directly from HTML files, except for third-party dependencies (like Bootstrap).

### Use strict mode
[Strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) should be used on all JavaScript files, unless it is a third-party dependency. To do this, add `"use strict"` at the very top of the file.
> [!NOTE]
> Although ECMAScript modules automatically use strict mode, the explicit `"use strict"` statement should still be used in modules for consistency.

### Semicolons
Semicolons are **absolutely prohibited** unless it is strictly required.

### Naming conventions
Use [camelCase](https://en.wikipedia.org/wiki/Camel_case) for naming functions, variables, among other things.

### Constants
Important `const` statements should be placed in the files with `constants` in the name. You should look at those files to get an idea of what should be there.

### Comments
```javascript
// Use inline comments for most things. You MUST include one space before typing your comment, immediately after the two slashes.

superAmazingFunction("awesome") // Inline comments can either be on a new line, or after a normal line like here.

/*
    Block comments are also okay, but only for multi-line ones.
    You also should indent them with four spaces, like this.
*/
```

### Functions
The functions you make should look like this.
```javascript
function useCamelCaseForNamesHere(amazingParameter, awesomeParameter) {
    // Do stuff here!
}
```

### Arrow Functions
Please do this:
```javascript
somethingElement.doSomething("amazingAction", () => {
    // Note the use of arrow functions here.
})
```
...or this:
```javascript
somethingElement.doSomething("amazingAction", (event) => {
    event.doSomethingElse()
    // Note the use of an event here in the arrow function.
})
```
...but NOT the next two, unless it's strictly necessary:
```javascript
somethingElement.doSomething("amazingAction", function() {
    // Note the LACK of arrow functions here.
})
```
```javascript
somethingElement.doSomething("amazingAction", function(event) {
    // Note the use of an event here WITHOUT an arrow function
})
```

### Equality operators
Use [strict equality operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) if you are able to infer the type of return values of a function. These are `===` for strict equality, and `!==` for strict inequality. Here's a quick example:
```javascript
if ("awesome" === getAwesome()) {
    // Here, we know that getAwesome() is always going to return a string. This means we can use the strict equality operators against another string. This works for other types too, like integers.
}
```
let first = "Robert";
let last = "   Pobert";


function trim(input) {
    for (let i = 0; i < input.length; i++) {
        input[i] = input[i].trim();
    }
    return input;
}

[first, last] = trim([first, last]);

console.log(first, last);

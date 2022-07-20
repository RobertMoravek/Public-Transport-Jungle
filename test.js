let city = "   Berlin";
function deleteSpacesFromBeginning(input) {
    if (input.startsWith(" ")) {
        console.log('if');
        input = input.slice(1);
        console.log('input after slice', input);
        deleteSpacesFromBeginning(input);
        return input;
    } else {
        console.log('else', input);
        city = input;

    }
}
deleteSpacesFromBeginning(city);


    
    console.log("city", city);


let Depluralize = function (input) {
    if (input[input.length - 1] === 's')
        return input.substr(0, input.length - 1);
    return input;
}

let EscapeSpaces = function (input) {
    let allWords = input.split(" ");
    let returnWord = "";
    for (let str of allWords) {
        returnWord += str;
    }
    return returnWord;
}

let RGBToHex = function (red, green, blue) {
    let hexCode = "#";
    hexCode += DecimalToHex(red, 2);
    hexCode += DecimalToHex(green, 2);
    hexCode += DecimalToHex(blue, 2);
    return hexCode;
}

let ColorToHex = function (color) {
    let hexCode = "#";
    hexCode += DecimalToHex(color.levels[0], 2);
    hexCode += DecimalToHex(color.levels[1], 2);
    hexCode += DecimalToHex(color.levels[2], 2);
    return hexCode;
}

let DecimalToHex = function (number, bytes = 4) {
    let maxPower = pow(16, bytes - 1);
    let hexValue = "";
    for (let currPower = maxPower; currPower >= 1; currPower /= 16) {
        let digit = 0;
        if (number >= currPower) {
            digit = Math.floor(number / currPower);
            number -= currPower * digit;
        }
        hexValue += DigitToHex(digit);
    }
    return hexValue;
}

let DigitToHex = function (digit) {
    let unicode = digit > 9 ? 55 + digit : 48 + digit;
    return String.fromCharCode(unicode);
}
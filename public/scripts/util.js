export const createElementWithText = function (elementType, text) {
    let newElem = document.createElement(elementType);
    let textContent = document.createTextNode(text);
    newElem.appendChild(textContent);

    return newElem;
}

export const RGBToHex = function (red, green, blue) {
    let hexCode = "#";
    hexCode += DecimalToHex(red, 2);
    hexCode += DecimalToHex(green, 2);
    hexCode += DecimalToHex(blue, 2);
    return hexCode;
}

export const ColorToHex = function (color) {
    let hexCode = "#";
    hexCode += DecimalToHex(color.levels[0], 2);
    hexCode += DecimalToHex(color.levels[1], 2);
    hexCode += DecimalToHex(color.levels[2], 2);
    return hexCode;
}

export const DecimalToHex = function (number, bytes = 4) {
    let maxPower = Math.pow(16, bytes - 1);
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

export const DigitToHex = function (digit) {
    let unicode = digit > 9 ? 55 + digit : 48 + digit;
    return String.fromCharCode(unicode);
}

export const ConvertRemToPixels = function (rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export const RGBtoHSB = function (red, green, blue) {
    let minVal = Math.min(red, green);
    let maxVal = Math.max(red, green);
    minVal = Math.min(minVal, blue);
    maxVal = Math.max(maxVal, blue);
    let delta = maxVal - minVal;

    let b = maxVal / 255 * 100;
    let s = delta / maxVal * 100;
    let h;
    if (red == maxVal) {
        h = (green - blue) / delta;
    }
    else if (green == maxVal) {
        h = 2 + ((blue - red) / delta);
    }
    else {
        h = 4 + ((red - green) / delta);
    }
    h *= 60;
    return [h, s, b];
}
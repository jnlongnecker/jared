export const createElementWithText = function (elementType, text) {
    let newElem = document.createElement(elementType);
    let textContent = document.createTextNode(text);
    newElem.appendChild(textContent);

    return newElem;
}
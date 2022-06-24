export default class Button extends HTMLElement {
    static get observedAttributes() {
        return ["type", "label"]
    }

    get width() {
        return this.btn.getBoundingClientRect().width;
    }

    get height() {
        return this.btn.getBoundingClientRect().height;
    }

    text;

    connectedCallback() {
        this.btn = this.template.querySelector("button");
        this.addEventListener("click", this.onclick);
        this.updateLabel(this.text);
    }

    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case "type":
                this.updateStyle(newVal);
                break;
            case "label":
                this.updateLabel(newVal);
                break;
        }
    }

    updateStyle(newStyle) {
        this.btn.setAttribute("class", newStyle);
    }

    updateLabel(newLabel) {
        this.text = newLabel;
        if (this.btn && newLabel) {
            this.btn.innerText = newLabel.toUpperCase();
        }
    }

    position(x, y) {
        if (x && y) {
            this.btn.setAttribute("style", `position:absolute;top:${y}px;left:${x}px;`);
        }
        return { x: this.btn.getBoundingClientRect().x + window.scrollX, y: this.btn.getBoundingClientRect().y + window.scrollY };
    }

    onclick() { }
}

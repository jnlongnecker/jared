export default class Button extends HTMLElement {
    static get observedAttributes() {
        return ["type", "label", "toggle", "toggleLabel", "on"]
    }

    get width() {
        return this.btn.getBoundingClientRect().width;
    }

    get height() {
        return this.btn.getBoundingClientRect().height;
    }

    text;

    constructor() {
        this.btn = this.template.querySelector("span");
    }

    connectedCallback() {
        this.btn.addEventListener("click", this.onclick);
    }

    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case "type":
                if (this.getAttribute("toggle")) break;
                this.updateStyle(newVal);
                break;
            case "label":
                this.updateLabel(newVal);
                break;
            case "toggle":
                this.btn.addEventListener("click", () => {
                    this.toggleAttribute("on");
                });
            case "on":
                this.toggle();
                break;
        }
    }

    updateStyle(newStyle) {
        this.btn.setAttribute("class", newStyle);
    }

    updateLabel(newLabel) {
        this.text = newLabel;
        this.btn.firstChild.innerText = newLabel;
    }

    toggle() {
        if (this.getAttribute("on") !== "") {
            this.updateLabel(this.getAttribute("label"));
            this.btn.classList.remove("on");
        }
        else {
            this.updateLabel(this.getAttribute("toggleLabel"));
            this.btn.classList.add("on");
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

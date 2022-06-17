export default class Spinner extends HTMLElement {

    connectedCallback() {
        this.spin = this.template.querySelector(".container");
    }

    position(x, y) {
        let box = this.spin.getBoundingClientRect();
        this.spin.setAttribute("style", `top:${y + window.scrollY - box.height * 0.5}px;left:${x + window.scrollX - box.width * 0.5}px;`);
    }
}

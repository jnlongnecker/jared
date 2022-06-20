export default class ImageCard extends HTMLElement {

    static get observedAttributes() {
        return ["image", "label"];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case "image":
                this.template.querySelector("img").setAttribute("src", newVal);
                break;
            case "label":
                this.template.querySelector("figcaption").innerText = newVal.toUpperCase();
                break;
        }
    }
}

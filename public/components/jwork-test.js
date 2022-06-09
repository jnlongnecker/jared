import { template } from "./header.template.js";

let template = document.createElement("template");
template.innerHTML = `<template><style></style>
    <h1>Hello World!</h1>
</template>`;

export default class JworkTest extends HTMLElement {

    constructor() {
        super();
        let shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(template.content.cloneNode(true));
        
        // test
    }
    
}

customElements.define('jwork-test', JworkTest);
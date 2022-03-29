import JworkHeader from "./jwork-header.js";
import JworkFooter from "./jwork-footer.js";


let template = document.createElement("template");
template.innerHTML = `<style></style>
<link rel="stylesheet" href="../styles/common.css" />
<jwork-header></jwork-header>
<jwork-footer></jwork-footer>`;

export default class JworkMain extends HTMLElement {

    constructor() {
        super();
        this.template = this.attachShadow({ mode: "open" });
        this.template.appendChild(template.content.cloneNode(true));
        }

}

customElements.define('jwork-main', JworkMain);
let template = document.createElement("template");
template.innerHTML = `<style>.footer-item {
  margin: 0 6% 0 6%;
}

.footer-break {
  margin: 3em;
}
</style>
<link rel="stylesheet" href="../styles/common.css" /><footer>
    <a class="footer-item" href="https://github.com/jnlongnecker">
        GitHub</a>
    <a class="footer-item" href="https://github.com/jnlongnecker/jared">Site Repo</a>
    <br />
    <p class="footer-item footer-break">Created By Jared Longnecker</p>
    <br />
    <span class="footer-item">©2021</span>
</footer>`;

export default class JworkFooter extends HTMLElement {

    constructor() {
        super();
        let shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(template.content.cloneNode(true));
        }

}

customElements.define('jwork-footer', JworkFooter);
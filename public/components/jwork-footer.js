import jworkIconButton from "./jwork-icon-button.js";


let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>footer {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  justify-items: stretch;
  background-color: rgba(255,255,255,.06);
  border-top: 2px solid rgba(255,255,255, 0.08);
}

section {
  margin: 0;
  justify-content: stretch;
  align-items: stretch;
  font-size: .8rem;
  padding: 5px 10px;
  color: rgba(255,255,255, 0.65);
  width: 30%;
}

hr {
  width: 0;
  margin: 1rem 0;
  border-left: 1px solid white;
}

p {
  margin: 5px 0;
}

.left {
  text-align: left;
}

.middle {
  text-align: center;
}

.right {
  text-align: right;
}
</style>
<footer>
    <section class="left"></section>
    <hr />
    <section class="middle">
        <a href="https://github.com/jnlongnecker">
            <jwork-icon-button icon="github"></jwork-icon-button>
        </a>
    </section>
    <hr />
    <section class="right">
        <p>Icons by <a target="_blank" href="https://icons8.com/">Icons8</a></p>
        <p>Site <a target="_blank" href="https://github.com/jnlongnecker/jared">source code</a></p>
    </section>
</footer>`;

export default class JworkFooter extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));
	}
 
}

customElements.define('jwork-footer', JworkFooter);
import jworkIconButton from "./jwork-icon-button.js";


let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>/* To Do /*
</style>
<jwork-icon-button icon="settings" variant="secondary"></jwork-icon-button>`;

export default class JworkControls extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));
	}

}

customElements.define('jwork-controls', JworkControls);
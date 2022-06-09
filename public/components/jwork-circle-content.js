let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" href="../styles/common.css" />
<style></style>
<section>
    <h1 class="main-header">Welcome to My Playground</h1>
    <h2 class="italics subheader">I hope you enjoy your stay!</h2>
    <slot name="canvas"></slot>
    <p class="italics">Enjoy the circles</p>
</section>`;

export default class JworkCirclecontent extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));
	}
 
}

customElements.define('jwork-circle-content', JworkCirclecontent);
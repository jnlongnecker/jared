import jworkToolbar from "./jwork-toolbar.js";
import { circle } from "./circleSketch.js";
import { quadTree } from "./quadTreeSketch.js";
import { test } from "./testSketch.js";

let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" href="../styles/common.css" />
<style>input[type=range] {
    -webkit-appearance: slider-vertical;
}

.holder {
    display: inline-block;
    font-size: 0px;
}

.controls {
    display: flex;
    flex-flow: row nowrap;
    gap: 10px;
}

.control-col {
    display: flex;
    flex-direction: column;
}</style>
<jwork-toolbar>
    <div class="holder" slot="item" id="canvas-holder"></div>
</jwork-toolbar>`;

export default class JworkP5canvas extends HTMLElement {

	constructor() {
		super();
	}
	connectedCallback() {
		this.appendChild(template.content.cloneNode(true));
	}


	// The sketch attribute determines the type of sketch to load on the canvas
	static get observedAttributes() {
		return ["sketch"];
	}

	// Update the canvas sketch whenever the attribute changes
	attributeChangedCallback(name, oldVal, newVal) {
		this.setCanvas(newVal);
	}

	// Handles sketch cases
	setCanvas(type) {
		switch (type.toLowerCase()) {
			case "circle":
				this.p5instance = new p5(circle, "canvas-holder");
				break;
			case "quadtree":
				this.p5instance = new p5(quadTree, "canvas-holder");
				break;
		}
	}

}

customElements.define('jwork-p5-canvas', JworkP5canvas);
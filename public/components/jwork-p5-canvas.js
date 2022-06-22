import jworkToolbar from "./jwork-toolbar.js";
import { circle } from "../components/circleSketch.js";
import { quadTree } from "../components/quadTreeSketch.js";
import { wfc } from "../components/wfcSketch.js";
import { boids } from "../components/boidsSketch.js";
import { test } from "../components/testSketch.js";

let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>.slider-vert {
    -webkit-appearance: slider-vertical;
}

.holder {
    display: inline-block;
    font-size: 0px;
}

.controls {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    gap: 10px;
}

.control-col {
    display: flex;
    flex-direction: column;
    align-items: center;
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

		// Loads too fast before the canvas sometimes, this is a fix
		setTimeout(() => {
			switch (type.toLowerCase()) {
				case "circle":
					this.p5instance = new p5(circle, "canvas-holder");
					break;
				case "quadtree":
					this.p5instance = new p5(quadTree, "canvas-holder");
					break;
				case "wfc":
					this.p5instance = new p5(wfc, "canvas-holder");
					break;
				case "boids":
					this.p5instance = new p5(boids, "canvas-holder");
					break;
			}
		}, 0);
	}

}

customElements.define('jwork-p5-canvas', JworkP5canvas);
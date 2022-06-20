import jworkDemoContent from "./jwork-demo-content.js";
import jworkP5Canvas from "./jwork-p5-canvas.js";


let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>/* To Do /*
</style>
<jwork-demo-content>
    <span slot="header">Boids</span>
    <span slot="subheader">Basic animal behaviors</span>
    <jwork-p5-canvas sketch="boids" slot="canvas"></jwork-p5-canvas>
    <span slot="blurb">An algorithm for the simulation of flocking animals</span>
    <div slot="interactivity">
        <h3 class="centered">Interactivity</h3>
        <p class="centered"></p>
    </div>

    <div slot="content">
        <section>
            <div class="section-content">
                <h1 class="main-header">About This Project</h1>
                <p class="info">
                    Work in Progress!
                </p>
                <hr class="main-hr" />
        </section>
    </div>
</jwork-demo-content>`;

export default class JworkBoids extends HTMLElement {

	constructor() {
		super();
	}
	connectedCallback() {
		this.appendChild(template.content.cloneNode(true));
	}

}

customElements.define('jwork-boids', JworkBoids);
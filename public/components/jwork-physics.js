import jworkImageCard from "./jwork-image-card.js";


let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style></style>
<section>
    <h1 class="main-header">Physics Sketches</h1>
    <div class="card-container">
        <a href="circles">
            <jwork-image-card image="../images/previews/circles.png" label="circles"></jwork-image-card>
        </a>
    </div>
</section>`;

export default class JworkPhysics extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));
	}
 
}

customElements.define('jwork-physics', JworkPhysics);
let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" href="../styles/common.css" />
<style>.intro {
    margin-top: 5rem;
    text-align: center;
}</style>
<section>
    <div class="intro">
        <h1 class="main-header">
            <slot name="header"></slot>
        </h1>
        <h2 class="italics subheader">
            <slot name="subheader"></slot>
        </h2>
        <slot name="canvas"></slot>
        <p class="italics">
            <slot name="blurb"></slot>
        </p>
        <slot name="interactivity"></slot>
    </div>
</section>

<slot name="content"></slot>`;

export default class JworkDemocontent extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));
	}
 
}

customElements.define('jwork-demo-content', JworkDemocontent);
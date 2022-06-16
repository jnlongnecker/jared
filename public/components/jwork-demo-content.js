let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>.intro {
    margin-top: 5rem;
    text-align: center;
}

.content {
    display: flex;
    justify-content: center;
    align-items: center;
}

.holder {
    display: inline-block;
}

@media only screen and (max-width:900px) {
    .content {
        padding: 0 1rem;
    }
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
        <div class="interactivity">
            <div class="section-content">
                <slot name="interactivity"></slot>
            </div>
        </div>
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
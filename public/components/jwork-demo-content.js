let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>.intro {
    margin-top: 5rem;
    text-align: center;
}

.content {
    display: flex;
    justify-content: center;
}

.backer {
    padding: 1rem;
    background-color: rgba(255,255,255, 0.06);
    border-radius: 5px;
    display: inline-block;
}
@media screen and (max-width: 900px) {
    
    .backer  {
        padding: 1rem;
        margin: 1rem;
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

<div class="content">
    <div class="backer">
        <slot name="content"></slot>
    </div>
</div>`;

export default class JworkDemocontent extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));
	}
 
}

customElements.define('jwork-demo-content', JworkDemocontent);
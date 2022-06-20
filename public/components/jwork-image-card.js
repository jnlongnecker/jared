let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>figure {
    width: 25vw;
    height: calc(25vw * 0.55);
    overflow: hidden;
    border-radius: 5px;
}

img {
    border-radius: 5px;
    text-align: center;
    width: 100%;
    height: 100%;
}

figcaption {
    --height: 3rem;
    background-color: rgba(12,12,12,.6);
    color: white;
    position: relative;
    height: var(--height);
    top: calc(0px - var(--height) - 5px);
    transition: 0.5s;

    text-align: center;
    font-size: 1.3rem;
    font-family: 'Roboto Mono', monospace;
}

figure:hover figcaption {
    --height: 3.5rem;
    transition: 0.5s;
    font-size: 1.5rem;
}

@media only screen and (max-width: 900px) {
    figure {
        width: 80vw;
        height: calc(80vw * 0.6);
        overflow: hidden;
        border-radius: 5px;
    }
}
</style>
<figure>
    <img />
    <figcaption></figcaption>
</figure>`;

export default class JworkImagecard extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));
	}


	static get observedAttributes() {
		return ["image", "label"];
	}

	attributeChangedCallback(name, oldVal, newVal) {
		switch (name) {
			case "image":
				this.template.querySelector("img").setAttribute("src", newVal);
				break;
			case "label":
				this.template.querySelector("figcaption").innerText = newVal.toUpperCase();
				break;
		}
	}

}

customElements.define('jwork-image-card', JworkImagecard);
let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>button {
    border-radius: 5px;
    font-size: 1.2rem;
    font-family: 'Lato', sans-serif;
    font-weight: 600;
    color: var(--black);
    border: 0;
    vertical-align: middle;
    padding: .2rem 1rem;
}

button:hover {
    cursor: pointer;
}

.primary {
    background-color: var(--palette-primary);
}

.secondary {
    background-color: var(--palette-secondary);
}
</style>
<button></button>`;

export default class JworkButton extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));
	}

	static get observedAttributes() {
		return ["type", "label"]
	}

	get width() {
		return this.btn.getBoundingClientRect().width;
	}

	get height() {
		return this.btn.getBoundingClientRect().height;
	}

	connectedCallback() {
		this.btn = this.template.querySelector("button");
		this.updateStyle("primary");
	}

	attributeChangedCallback(name, oldVal, newVal) {
		switch (name) {
			case "type":
				this.updateStyle(newVal);
				break;
			case "label":
				this.updateLabel(newVal);
				break;
		}
	}

	updateStyle(newStyle) {
		this.btn.setAttribute("class", newStyle);
	}

	updateLabel(newLabel) {
		this.btn.innerText = newLabel.toUpperCase();
	}

	position(x, y) {
		if (x && y) {
			this.btn.setAttribute("style", `position:absolute;top:${y}px;left:${x}px;`);
		}
		return { x: this.btn.getBoundingClientRect().x + window.scrollX, y: this.btn.getBoundingClientRect().y + window.scrollY };
	}

}

customElements.define('jwork-button', JworkButton);
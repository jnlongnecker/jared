let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>span {
    border: 2px solid var(--palette-primary);
    display: inline-block;
    border-radius: 5px;
}

button {
    border-radius: 5px;
    font-size: 1.2rem;
    font-family: 'Lato', sans-serif;
    font-weight: 600;
    color: var(--white);
    border: 0;
    vertical-align: middle;
    padding: .5rem 2rem;
    letter-spacing: 2px;
    background-color: transparent;
}

button:hover {
    cursor: pointer;
    background-color: rgba(255,255,255,.16)
}

.primary {
    background-color: var(--palette-primary);
    border: 0;
}

.secondary {
    background-color: var(--palette-secondary);
    border: 0;
}
</style>
<span><button></button></span>`;

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

	text;

	connectedCallback() {
		this.btn = this.template.querySelector("button");
		this.addEventListener("click", this.onclick);
		this.updateLabel(this.text);
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
		this.text = newLabel;
		if (this.btn && newLabel) {
			this.btn.innerText = newLabel.toUpperCase();
		}
	}

	position(x, y) {
		if (x && y) {
			this.btn.setAttribute("style", `position:absolute;top:${y}px;left:${x}px;`);
		}
		return { x: this.btn.getBoundingClientRect().x + window.scrollX, y: this.btn.getBoundingClientRect().y + window.scrollY };
	}

	onclick() { }

}

customElements.define('jwork-button', JworkButton);
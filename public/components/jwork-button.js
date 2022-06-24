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
    border: 0;
    color: var(--white);
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

.on {
    background-color: var(--palette-primary);
}

.on button {
    color: var(--black);
}
</style>
<span><button></button></span>`;

export default class JworkButton extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));

		this.btn = this.template.querySelector("span");
	}

	static get observedAttributes() {
		return ["type", "label", "toggle", "toggleLabel", "on"]
	}

	get width() {
		return this.btn.getBoundingClientRect().width;
	}

	get height() {
		return this.btn.getBoundingClientRect().height;
	}

	text;

	

	connectedCallback() {
		this.btn.addEventListener("click", this.onclick);
	}

	attributeChangedCallback(name, oldVal, newVal) {
		switch (name) {
			case "type":
				if (this.getAttribute("toggle")) break;
				this.updateStyle(newVal);
				break;
			case "label":
				this.updateLabel(newVal);
				break;
			case "toggle":
				this.btn.addEventListener("click", () => {
					this.toggleAttribute("on");
				});
			case "on":
				this.toggle();
				break;
		}
	}

	updateStyle(newStyle) {
		this.btn.setAttribute("class", newStyle);
	}

	updateLabel(newLabel) {
		this.text = newLabel;
		this.btn.firstChild.innerText = newLabel;
	}

	toggle() {
		if (this.getAttribute("on") !== "") {
			this.updateLabel(this.getAttribute("label"));
			this.btn.classList.remove("on");
		}
		else {
			this.updateLabel(this.getAttribute("toggleLabel"));
			this.btn.classList.add("on");
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
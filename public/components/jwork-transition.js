let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>:host {
    --transition-time: 0.3s;
}

div {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: var(--transition-time);
    background-color: rgba(12,12,12,0);
}

.fade-in {
    background-color: var(--background);
    transition: var(--transition-time);
}
</style>
<div></div>`;

export default class JworkTransition extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));
	}


	static currTransition;
	static cb;

	static get observedAttributes() {
		return ["fade-in", "fade-out"];
	}

	connectedCallback() {
		let elem = this.template.querySelector("div");

		if (this.getAttribute("fade-out")) {
			elem.classList.add("fade-in");
		}

		let translationEvent = this.getTranslationEvent(elem);
		elem.addEventListener(translationEvent, (e) => {
			if (this.getAttribute("fade-out")) {
				document.body.removeChild(JworkTransition.currTransition);
				JworkTransition.currTransition = null;
				JworkTransition.cb();
				return;
			}
			JworkTransition.cb();
			JworkTransition.cb = function () { return; };
		});
	}

	attributeChangedCallback(name, newVal, oldVal) {
		setTimeout(() => {
			switch (name) {
				case "fade-in":
					this.template.querySelector("div").classList.add("fade-in");
					break;
				case "fade-out":
					this.template.querySelector("div").classList.remove("fade-in");
					break;
			}
		}, 100);
	}

	static fadeIn(callback = function () { return; }) {
		if (this.currTransition) return;

		this.cb = callback;
		this.currTransition = document.createElement("jwork-transition", { is: JworkTransition });
		document.body.appendChild(this.currTransition);
		this.currTransition.setAttribute("fade-in", "fade-in");
	}

	static fadeOut(callback = function () { return; }) {
		if (!this.currTransition) {
			return;
		}
		this.cb = callback;
		this.currTransition.setAttribute("fade-out", "fade-out");
	}

	getTranslationEvent(elem) {
		let transitions = {
			'transition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'MozTransition': 'transitionend',
			'WebkitTransition': 'webkitTransitionEnd'
		}

		for (let t in transitions) {
			if (elem.style[t] !== undefined) {
				return transitions[t];
			}
		}
	}

}

customElements.define('jwork-transition', JworkTransition);
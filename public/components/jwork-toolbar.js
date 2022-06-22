import JworkIconButton from "./jwork-icon-button.js";
import JworkNotification from "./jwork-notification.js";

let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>.toolbar {
    display: flex;
    justify-content: center;
    gap: 2rem;
}

@media only screen and (max-width: 900px) {
    .toolbar {
        gap: 1rem;
    }
} 

.controls {
    position: absolute;
    transition: max-width .5s;
    overflow: hidden;
    max-height: 100%;
    max-width: 25%;
}

@media only screen and (max-width: 900px) {
    .controls {
        max-width: 100%;
    }
}

.content-holder {
    background: rgba(0,0,0,0.95);
    color: var(--white);
    transition: 0.5s;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    height: 100%;
    vertical-align: bottom;
}

.padder {
    max-height: 100%;
    transition: 0.5s;
    pointer-events: none;
}

.formatting {
    padding: 1rem;
}

.formatting h1 {
    font-size: 1.3rem;
    color: white;
    font-weight: normal;
    text-decoration:underline;
    margin-bottom: 1rem;
    font-family: 'Roboto Mono', monospace;
}

.hide-horizontal {
    max-height: 0;
    transition: 0.5s;
}

.hide-vertical {
    max-width: 0;
    transition: max-width 0.5s;
}

.notification {
    position: relative;
}</style>
<div>
    <slot name="item"></slot>
    <div class="toolbar">
        <slot></slot>
    </div>
    <div class="controls hide-vertical">
        <div class="content-holder">
            <div class="formatting">
                <h1>CONTROLS</h1>
                <slot name="controls"></slot>
            </div>
        </div>
    </div>
</div>`;

export default class JworkToolbar extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));
	}


	controlsButton;

	connectedCallback() {
		this.controls = this.template.querySelector(".controls");
		this.parent = this.querySelector("*[slot=item]:first-child");

		let contentSlot = this.template.querySelector("slot[name=controls]");
		contentSlot.onslotchange = () => {
			if (contentSlot.assignedNodes().length && this.controlsButton) {
				this.controlsButton.parentNode.removeChild(this.controlsButton);
				return;
			}
			if (this.controlsButton) return;
			this.controlsButton = document.createElement("jwork-icon-button", { is: JworkIconButton });
			this.controlsButton.setAttribute("variant", "secondary");
			this.controlsButton.setAttribute("icon", "settings");
			this.controlsButton.onclick = () => { this.toggleControls() };
			this.template.querySelector(".toolbar").appendChild(this.controlsButton);
		}
	}

	resize() {
		let box = this.parent.getBoundingClientRect();

		let style = `top:${window.scrollY + box.top}px;right:${window.scrollX + box.left}px;`;
		let style2 = `width:${box.width}px;height:${box.height}px;`;

		console.log(`box top: ${box.top}, scrollY: ${window.scrollY}`);
		this.controls.setAttribute("style", style + style2);
	}

	toggleControls() {
		this.resize();
		this.controls.classList.toggle("hide-vertical");
		this.controlsButton.changeState();
	}

	postError(message, duration = 5.5) {
		JworkNotification.notify(message, duration, this.parent, false, "error");
	}

}

customElements.define('jwork-toolbar', JworkToolbar);
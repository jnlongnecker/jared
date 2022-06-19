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
    transition: .5s;
    overflow: hidden;
}

.content-holder {
    background: rgba(0,0,0,0.95);
    color: var(--white);
    transition: 0.5s;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    max-height: 100%;
    vertical-align: bottom;
}

.padder {
    max-height: 100%;
    transition: 0.5s;
}

.formatting {
    padding: 1rem;
}

.hide {
    max-height: 0;
    transition: .5s;
}

.notification {
    position: relative;
}</style>
<div>
    <slot name="item"></slot>
    <div class="toolbar">
        <slot></slot>
    </div>
    <div class="controls">
        <div class="padder"></div>
        <div class="content-holder">
            <div class="formatting">
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

		// Position the toolbar correctly on the parent
		const cb = () => {
			let box = this.parent.getBoundingClientRect();

			let style = `top:${window.scrollY + box.top}px;left:${window.scrollX + box.left}px;`;
			let style2 = `width:${box.width}px;height:${box.height}px;`;

			this.controls.setAttribute("style", style + style2);
			this.controls.firstElementChild.setAttribute("style", style2);
			this.controls.firstElementChild.nextElementSibling.setAttribute("style", style2);
		}

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

		// Detect changes in the parent
		let resizeObserver = new ResizeObserver(cb);
		resizeObserver.observe(this.parent);
	}

	toggleControls() {
		this.controls.firstElementChild.classList.toggle("hide");
		this.controlsButton.changeState();
	}

	postError(message, duration = 5.5) {
		JworkNotification.notify(message, duration, this.parent, false, "error");
	}

}

customElements.define('jwork-toolbar', JworkToolbar);
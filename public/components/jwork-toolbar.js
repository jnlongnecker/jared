import JworkIconButton from "./jwork-icon-button.js";

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
    display: flex;
    justify-content:start;
    align-items: stretch;
    transition: .5s;
    max-height: 100%;
}

.content-holder {
    background: rgba(0,0,0,0.95);
    color: var(--white);
    transition: 0.5s;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
}

.formatting {
    padding: 1rem;
}

.hide {
    max-height: 0;
    transition: .5s;
}</style>
<div>
    <slot name="item"></slot>
    <div class="toolbar">
        <slot></slot>
    </div>
    <div class="controls hide">
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

			let style = `position:absolute;`;
			style += `top:${window.scrollY + box.top}px;left:${window.scrollX + box.left}px;`;
			style += `width:${box.width}px;height:${box.height}px;`;

			this.controls.setAttribute("style", style);
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
		this.controls.classList.toggle("hide");
		this.controlsButton.changeState();
	}

}

customElements.define('jwork-toolbar', JworkToolbar);
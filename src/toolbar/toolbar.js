import JworkIconButton from "./jwork-icon-button.js";
import JworkNotification from "./jwork-notification.js";

export default class Toolbar extends HTMLElement {

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

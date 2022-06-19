import JworkIconButton from "./jwork-icon-button.js";
import JworkNotification from "./jwork-notification.js";

export default class Toolbar extends HTMLElement {

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

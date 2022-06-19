export default class Notification extends HTMLElement {
    static notification;
    static parent;

    static get observedAttributes() {
        return ["message", "duration", "sticky", "format"]
    }

    connectedCallback() {
        this.template.querySelector("p").innerHTML = this.message;
        this.container = this.template.querySelector(".container");
        const cb = () => {
            let box = JworkNotification.parent.getBoundingClientRect();

            let style = `top:${window.scrollY + box.top}px;left:${window.scrollX + box.left}px;`;
            style += `width:${box.width}px;height:${box.height}px;`;

            this.container.setAttribute("style", style);
        }
        let resizeObserver = new ResizeObserver(cb);
        resizeObserver.observe(JworkNotification.parent);

        setTimeout(() => {
            this.template.querySelector("span").classList.add("exit");
        }, this.duration * 1000 + 600);
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal || !newVal) return;

        switch (name) {
            case "message":
                this.message = newVal;
                break;
            case "duration":
                this.duration = newVal;
                break;
            case "sticky":
                this.template.querySelector(".container").classList.add("sticky");
                break;
            case "format":
                this.template.querySelector(".notification").classList.add(newVal);
                break;
        }
    }

    static notify(message = "test", duration = 1, on = document.querySelector("body"), sticky = true, format = "") {
        if (this.notification) return;

        this.parent = on;
        this.notification = document.createElement("jwork-notification", { is: JworkNotification });
        this.notification.setAttribute("message", message);
        this.notification.setAttribute("duration", duration);
        this.notification.setAttribute("format", format);
        if (sticky) {
            this.notification.setAttribute("sticky", "sticky");
        }
        document.querySelector("body").appendChild(this.notification);
    }
}

let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>@keyframes slide-in {
    0% {
        top: calc(-15vh + 0.5rem);
    }
    95% {
        top: calc(0px + 3px);
    }
    100% {
        top: 0;
    }
}

@keyframes slide-out {
    0% {
        top: 0;
    }
    100% {
        top: calc(-15vh + 0.5rem);
    }
}

span {
    position: relative;
    background-color: var(--background);
    border-radius: 5px;
    margin-top: 0.5rem;
    animation: .6s slide-in forwards;
}

p {
    margin: 0;
}

.exit {
    animation: .6s slide-out forwards;
}

.container {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    z-index: 10;
    overflow: hidden;
}

.sticky {
    position: fixed;
}

.notification {
    position: relative;
    max-height: 15vh;
    max-width: 25vw;
    min-width: 15vw;

    border: 0;
    border-radius: 5px;
    padding: 1rem;
    text-align: center;
}

@media only screen and (max-width: 900px) {
    .notification {
        position: relative;
        max-height: 15vh;
        max-width: 80vw;
        min-width: 75vw;

        border: 0;
        border-radius: 5px;
        padding: 1rem;
        text-align: center;
    }
}

.error {
    background-color: rgba(255,0,0,0.04);
    color: var(--error)
}

.warning {
    background-color: rgba(255,100,0,0.04);
    color: var(--warning);
}
</style>
<div class="container">
    <span>
        <div class="notification">
            <p>test</p>
        </div>
    </span>
</div>`;

export default class JworkNotification extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));
	}

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
			let span = this.template.querySelector("span");
			span.classList.add("exit");
			span.addEventListener("animationend", () => { this.cleanup(); });
		}, this.duration * 1000 + 600);
	}

	cleanup() {
		JworkNotification.notification = null;
		this.parentNode.removeChild(this);
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

customElements.define('jwork-notification', JworkNotification);
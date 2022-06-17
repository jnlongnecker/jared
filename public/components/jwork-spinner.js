let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>@keyframes bounce {
    0% {
        height: 3rem;
        width: 0.5rem;
        background-color: hsl(0, 0%, 20%);
    }
    30% {
        height: 5.5rem;
        width: 0.2rem;
        background-color: hsl(0, 0%, 75%);
    }
    60%,100% {
        height: 3rem;
        width: 0.5rem;
        background-color: hsl(0, 0%, 20%);
    }
}

.container {
    position: absolute;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: top;
    height: 5rem;
    width: 4rem
}

.bar {
    width: 0.5rem;
    height: 3rem;
    background-color: hsl(0, 0%, 20%);
    animation: .8s bounce forwards infinite;
}

#one {
    animation-delay: 0s;
}

#two {
    animation-delay: .15s;
}

#three {
    animation-delay: .3s;
}
</style>
<div class="container">
    <div id="one" class="bar"></div>
    <div id="two" class="bar"></div>
    <div id="three" class="bar"></div>
</div>`;

export default class JworkSpinner extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));
	}


	connectedCallback() {
		this.spin = this.template.querySelector(".container");
	}

	position(x, y) {
		let box = this.spin.getBoundingClientRect();
		this.spin.setAttribute("style", `top:${y + window.scrollY - box.height * 0.5}px;left:${x + window.scrollX - box.width * 0.5}px;`);
	}

}

customElements.define('jwork-spinner', JworkSpinner);
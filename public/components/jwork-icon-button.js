let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

div {
    display: inline-block;
    border-radius: 100%;
    background-color: rgba(255,255,255, .08);
}

input[type=color] {
    opacity: 0;
    position:absolute;
}

button {
    border:0;
    border-radius: 100%;
    width: 3rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0);
    transition: 0.1s;
}

button:hover,input[type=color]:hover {
    cursor: pointer;
    background-color: rgba(255,255,255,.08);
    transition: 0.1s;
}

button svg {
    width: 1rem;
    height: 1rem;
    fill: var(--white);
    stroke: var(--white);
}

button:hover svg {
    fill: var(--white);
    stroke: var(--white);
    width: 1.3rem;
    height: 1.3rem;
}

.primary {
    background-color: var(--palette-primary);
}

.secondary {
    background-color: var(--palette-secondary);
}

.primary:hover button,.secondary:hover button {
    background-color: rgba(0,0,0,.16);
    transition: 0.1s;
}

.primary svg,.secondary svg {
    fill: var(--black);
    stroke: var(--black);
}

.primary:hover svg,.secondary:hover svg {
    fill: var(--black);
    stroke: var(--black);
    width: 1.3rem;
    height: 1.3rem;
}

.on button {
    background-color: rgba(0,0,0,0.16);
}

.on svg {
    animation: linear rotate 2s infinite;
    width: 1.3rem;
    height: 1.3rem;
}

.large svg {
    width: 1.3rem;
    height: 1.3rem;
}

.large:hover svg {
    width: 1.6rem;
    height: 1.6rem;
}

.disabled {
    background-color: rgba(255,255,255,.20);
}

.disabled:hover button {
    cursor: default;
}

.disabled button {
    background-color: rgba(255,255,255,0);
}

.disabled svg {
    fill: rgba(255,255,255,.20);
    stroke: rgba(255,255,255,.20);
}

.disabled:hover svg {
    fill: rgba(255,255,255,.20);
    stroke: rgba(255,255,255,.20);
    width: 1rem;
    height: 1rem;
}
</style>
<div>
    <button>

    </button>
</div>`;

export default class JworkIconbutton extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));
	}


	pauseSVG = `<svg height="512px" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512"
	width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink">
	<title>Pause</title>
	<g><path
			d="M224,435.8V76.1c0-6.7-5.4-12.1-12.2-12.1h-71.6c-6.8,0-12.2,5.4-12.2,12.1v359.7c0,6.7,5.4,12.2,12.2,12.2h71.6   C218.6,448,224,442.6,224,435.8z" />
		<path
			d="M371.8,64h-71.6c-6.7,0-12.2,5.4-12.2,12.1v359.7c0,6.7,5.4,12.2,12.2,12.2h71.6c6.7,0,12.2-5.4,12.2-12.2V76.1   C384,69.4,378.6,64,371.8,64z" />
	</g></svg>`;
	playSVG = `<svg height="512px" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512"
	width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink">
	<title>Play</title>
	<path
		d="M405.2,232.9L126.8,67.2c-3.4-2-6.9-3.2-10.9-3.2c-10.9,0-19.8,9-19.8,20H96v344h0.1c0,11,8.9,20,19.8,20  c4.1,0,7.5-1.4,11.2-3.4l278.1-165.5c6.6-5.5,10.8-13.8,10.8-23.1C416,246.7,411.8,238.5,405.2,232.9z" />
	</svg>`;
	downloadSVG = `<svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 120.89">
	<title>Download</title>
	<path
		d="M84.58,47a7.71,7.71,0,1,1,10.8,11L66.09,86.88a7.72,7.72,0,0,1-10.82,0L26.4,58.37a7.71,7.71,0,1,1,10.81-11L53.1,63.12l.16-55.47a7.72,7.72,0,0,1,15.43.13l-.15,55L84.58,47ZM0,113.48.1,83.3a7.72,7.72,0,1,1,15.43.14l-.07,22q46,.09,91.91,0l.07-22.12a7.72,7.72,0,1,1,15.44.14l-.1,30h-.09a7.71,7.71,0,0,1-7.64,7.36q-53.73.1-107.38,0A7.7,7.7,0,0,1,0,113.48Z" />
	</svg>`;
	flipSVG = `<svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.61 122.88">
	<title>Switch View</title>
	<path
		d="M111.9,61.57a5.36,5.36,0,0,1,10.71,0A61.3,61.3,0,0,1,17.54,104.48v12.35a5.36,5.36,0,0,1-10.72,0V89.31A5.36,5.36,0,0,1,12.18,84H40a5.36,5.36,0,1,1,0,10.71H23a50.6,50.6,0,0,0,88.87-33.1ZM106.6,5.36a5.36,5.36,0,1,1,10.71,0V33.14A5.36,5.36,0,0,1,112,38.49H84.44a5.36,5.36,0,1,1,0-10.71H99A50.6,50.6,0,0,0,10.71,61.57,5.36,5.36,0,1,1,0,61.57,61.31,61.31,0,0,1,91.07,8,61.83,61.83,0,0,1,106.6,20.27V5.36Z" />
	</svg>`;
	settingsSVG = `<svg fill="#228BE6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
	<title>Settings</title>
	<path d="M47.16,21.221l-5.91-0.966c-0.346-1.186-0.819-2.326-1.411-3.405l3.45-4.917c0.279-0.397,0.231-0.938-0.112-1.282 l-3.889-3.887c-0.347-0.346-0.893-0.391-1.291-0.104l-4.843,3.481c-1.089-0.602-2.239-1.08-3.432-1.427l-1.031-5.886 C28.607,2.35,28.192,2,27.706,2h-5.5c-0.49,0-0.908,0.355-0.987,0.839l-0.956,5.854c-1.2,0.345-2.352,0.818-3.437,1.412l-4.83-3.45 c-0.399-0.285-0.942-0.239-1.289,0.106L6.82,10.648c-0.343,0.343-0.391,0.883-0.112,1.28l3.399,4.863 c-0.605,1.095-1.087,2.254-1.438,3.46l-5.831,0.971c-0.482,0.08-0.836,0.498-0.836,0.986v5.5c0,0.485,0.348,0.9,0.825,0.985 l5.831,1.034c0.349,1.203,0.831,2.362,1.438,3.46l-3.441,4.813c-0.284,0.397-0.239,0.942,0.106,1.289l3.888,3.891 c0.343,0.343,0.884,0.391,1.281,0.112l4.87-3.411c1.093,0.601,2.248,1.078,3.445,1.424l0.976,5.861C21.3,47.647,21.717,48,22.206,48 h5.5c0.485,0,0.9-0.348,0.984-0.825l1.045-5.89c1.199-0.353,2.348-0.833,3.43-1.435l4.905,3.441 c0.398,0.281,0.938,0.232,1.282-0.111l3.888-3.891c0.346-0.347,0.391-0.894,0.104-1.292l-3.498-4.857 c0.593-1.08,1.064-2.222,1.407-3.408l5.918-1.039c0.479-0.084,0.827-0.5,0.827-0.985v-5.5C47.999,21.718,47.644,21.3,47.16,21.221z M25,32c-3.866,0-7-3.134-7-7c0-3.866,3.134-7,7-7s7,3.134,7,7C32,28.866,28.866,32,25,32z" />
	</svg>`;
	paintSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" enable-background="new 0 0 24 24">
	<title>Color</title>
	<path d="M10.7,1.1c-5,0.6-9.1,4.6-9.7,9.7C0.3,17.4,5.5,23,12,23c0.6,0,1.2-0.1,1.7-0.3c2.5-0.7,3.6-3.8,2.1-6 C15,15.6,15.9,14,17.3,14H21c1.1,0,2-0.9,2-2C23,5.5,17.4,0.3,10.7,1.1z M12,21c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,21,12,21 z M18.5,11c-0.8,0-1.5-0.7-1.5-1.5S17.7,8,18.5,8S20,8.7,20,9.5S19.3,11,18.5,11z M14.5,7C13.7,7,13,6.3,13,5.5S13.7,4,14.5,4 S16,4.7,16,5.5S15.3,7,14.5,7z M9.5,7C8.7,7,8,6.3,8,5.5S8.7,4,9.5,4S11,4.7,11,5.5S10.3,7,9.5,7z M5.5,10C4.7,10,4,9.3,4,8.5 S4.7,7,5.5,7S7,7.7,7,8.5S6.3,10,5.5,10z M4.5,15C3.7,15,3,14.3,3,13.5S3.7,12,4.5,12S6,12.7,6,13.5S5.3,15,4.5,15z"/>
	</svg>`
	colorPicker = `<input type="color" value="#bbbbbb" />`;
	gitSVG = `<svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="60px" height="60px">
	<title>GitHub</title>
	<path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z" />
	</svg>`;

	currSVG = this.playSVG;
	variant;

	static get observedAttributes() {
		return ["icon", "variant"];
	}

	connectedCallback() {
		this.btn = this.template.querySelector("button");
		this.bkg = this.template.querySelector("div");
		this.updateIcon(this.getAttribute("icon"));
		this.updateVariant(this.getAttribute("variant"));

		this.addEventListener("click", this.onclick);
		this.setAttribute("variant", this.variant);
	}

	attributeChangedCallback(name, oldVal, newVal) {
		switch (name) {
			case "icon":
				this.updateIcon(newVal);
				break;
			case "variant":
				this.updateVariant(newVal);
				break;
		}
	}

	updateVariant(newVal) {
		if (!newVal || newVal == "undefined") return;

		this.variant = newVal;
		if (this.bkg) {
			console.log(newVal);
			this.bkg.setAttribute("class", newVal.toLowerCase());
		}
	}

	updateIcon(newVal) {
		if (!newVal) return;

		switch (newVal.toLowerCase()) {
			case "pause":
				this.currSVG = this.pauseSVG;
				break;
			case "download":
				this.currSVG = this.downloadSVG;
				break;
			case "flip":
				this.currSVG = this.flipSVG;
				break;
			case "settings":
				this.currSVG = this.settingsSVG;
				break;
			case "colorpicker":
				this.currSVG = this.colorPicker + this.paintSVG;
				break;
			case "github":
				this.currSVG = this.gitSVG;
				break;
			default:
				this.currSVG = this.playSVG;
		}
		if (this.btn) {
			this.btn.innerHTML = this.currSVG;
			if (newVal.toLowerCase() == "colorpicker") {
				this.btn.setAttribute("style", "outline: 4px solid #bbbbbb;outline-offset:-4px;")
				this.template.querySelector("input[type=color]").onchange = (e) => {
					let newStyle = `outline: 4px solid ${e.target.value};outline-offset:-4px;`;
					this.btn.setAttribute("style", newStyle);
				};
			}
			else if (newVal.toLowerCase() == "github") {
				this.bkg.classList.add("large");
			}
		}
	}

	changeState() {
		this.bkg.classList.toggle("on");
	}

	toggleDisabled() {
		if (this.bkg.classList.contains("disabled")) {
			this.onclick = this.prevCb;
			this.removeAttribute("disabled");
		}
		else {
			this.prevCb = this.onclick;
			this.onclick = () => { return; };
			this.setAttribute("disabled", "disabled");
		}
		this.bkg.classList.toggle("disabled");
	}

	togglePlay() {
		if (this.currSVG === this.playSVG) {
			this.setAttribute("icon", "pause");
		}
		else if (this.currSVG === this.pauseSVG) {
			this.setAttribute("icon", "play");
		}
	}

	color(color) {
		if (this.getAttribute("icon") != "colorpicker" || !this.btn) return;

		let clr = this.template.querySelector("input[type=color]")

		if (!color)
			return clr.value;

		clr.value = color;
		clr.onchange({ target: clr });
	}

	onclick() { }

}

customElements.define('jwork-icon-button', JworkIconbutton);
export default class IconButton extends HTMLElement {

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
    </svg>`

    currSVG = this.playSVG;
    variant;

    static get observedAttributes() {
        return ["icon", "variant"];
    }

    connectedCallback() {
        this.btn = this.template.querySelector("button");
        this.bkg = this.template.querySelector("div");
        this.btn.innerHTML = this.currSVG;

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
        this.variant = newVal;
        if (this.bkg) {
            this.bkg.setAttribute("class", newVal.toLowerCase());
        }
    }

    updateIcon(newVal) {
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
            default:
                this.currSVG = this.playSVG;
        }
        if (this.btn) {
            this.btn.innerHTML = this.currSVG;
        }
    }

    changeState() {
        this.bkg.classList.toggle("on");
    }

    onclick() { }

    togglePlay() {
        if (this.currSVG === this.playSVG) {
            this.setAttribute("icon", "pause");
        }
        else if (this.currSVG === this.pauseSVG) {
            this.setAttribute("icon", "play");
        }
    }
}

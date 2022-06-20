export default class Header extends HTMLElement {

    constructor() {
        this.lastScrollPos = window.scrollY;
    }

    connectedCallback() {
        this.header = this.template.querySelector("header");

        document.addEventListener("scroll", this.handleScroll);
    }

    handleScroll = (event) => {

        if (document.documentElement.clientWidth <= 900) return;

        if (this.lastScrollPos < window.scrollY) {
            this.header.classList.remove("show-header");
            this.header.classList.add("hide-header");
        }
        else {
            this.header.classList.remove("hide-header");
            this.header.classList.add("show-header");
        }

        this.lastScrollPos = window.scrollY;
    }
}
export default class Header extends HTMLElement {

    constructor() {
        this.lastScrollPos = window.scrollY;
    }

    connectedCallback() {
        this.template.querySelector("#menu").addEventListener("click", this.menuClick);
        this.template.querySelectorAll("#header-holder li").forEach((element) => {
            element.addEventListener("click", this.itemClick);
        });
        this.header = this.template.querySelector("#header-holder");

        document.addEventListener("scroll", this.handleScroll);
    }

    menuClick = (event) => {
        let menu = this.template.querySelector("#menu-content");

        if (menu.classList.contains("expanded-menu")) {
            menu.classList.remove("expanded-menu");
            menu.classList.add("collapsed-menu");
            return;
        }

        menu.classList.remove("collapsed-menu");
        menu.classList.add("expanded-menu");
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
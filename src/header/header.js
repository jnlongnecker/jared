export default class Header extends HTMLElement {
    connectedCallback() {
        this.template.querySelector("#menu").addEventListener("click", this.menuClick);
        this.template.querySelectorAll("#header-holder li").forEach((element) => {
            element.addEventListener("click", this.itemClick);
        });
    }

    menuClick(event) {
        let menu = event.target;

        if (menu.classList.contains("expanded-menu")) {
            menu.classList.remove("expanded-menu");
            menu.classList.add("collapsed-menu");
            return;
        }

        menu.classList.remove("collapsed-menu");
        menu.classList.add("expanded-menu");
    }

    itemClick(event) {
        console.log(`${event.target.textContent} clicked.`);
    }
}
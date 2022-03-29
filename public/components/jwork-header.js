let template = document.createElement("template");
template.innerHTML = `<style>@keyframes expand-menu {
  0% {
    height: 0;
    left: 100vw;
  }
  50% {
    height: 10rem;
    left: 100vw;
  }
  100% {
    height: 10rem;
    left: 0;
  }
}

@keyframes collapse-menu {
  0% {
    height: 10rem;
    left: 0;
  }
  50% {
    height: 10rem;
    left: 100vw;
  }
  100% {
    height: 0;
    left: 100vw;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100vw;
  padding: 1em 0 1em 0;
}

.header-right {
  text-align: right;
  padding: 0 1em 0 1em;
}

.header-left {
  text-align: left;
  padding: 0 1em 0 1em;
}

.header-item {
  color: var(--white);
  padding: 1em;
}

.header-logo {
  font-weight: bold;
  font-size: 1.2em;
}

.header-logo:hover {
  cursor: pointer;
  color: var(--anchor);
}

.menu-column {
  margin: 0 2rem 0 0;
}

.expanded-menu {
  animation: expand-menu 1s forwards;
}

.collapsed-menu {
  animation: collapse-menu 1s forwards;
}

#menu-content {
  position: relative;
  text-align: left;
  display: flex;
  padding: 0 2rem;
  left: 100vw;
  height: 0;
}

#menu-content li:hover {
  cursor: pointer;
  color: var(--anchor);
}

#header-holder {
  position: sticky;
  top: 0;
  border-bottom: 1px solid var(--palette-lightest);
  color: var(--palette-lightest);
  background: var(--background);
  z-index: 1;
  overflow: hidden;
}
</style>
<link rel="stylesheet" href="../styles/common.css" />
<header id="header-holder">
    <div class="header">
        <div class="header-left">
            <span id="home" class="header-logo header-item">Jared's PG</span>
        </div>
        <div class="header-right">
            <a id="menu" class="header-item">Menu</a>
        </div>
    </div>
    <div id="menu-content">
        <div class="menu-column">
            <h2>Physics</h2>
            <ul>
                <li>Circles</li>
                <li>QuadTree</li>
            </ul>
        </div>
        <div class="menu-column">
            <h2>Algorithms</h2>
            <ul>
                <li>Wave Function Collapse</li>
            </ul>
        </div>
    </div>
</header>`;

export default class JworkHeader extends HTMLElement {

    constructor() {
        super();
        this.template = this.attachShadow({ mode: "open" });
        this.template.appendChild(template.content.cloneNode(true));
        }

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

customElements.define('jwork-header', JworkHeader);
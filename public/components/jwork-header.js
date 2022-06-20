let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>header {
  position: fixed;
  top: 0;
  border-bottom: 1px solid var(--palette-secondary);
  color: var(--white);
  background: var(--background);
  z-index: 1;
  overflow: hidden;
}

a {
  color: var(--white);
  text-decoration: none;
}

a:hover {
  color: var(--anchor);
}

a:visited {
  color: var(--white);
}

a:visited:hover {
  color: var(--anchor);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  padding: 1em 0 1em 0;
}

.header-right {
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  padding: 0 1em 0 1em;
}

.header-left {
  text-align: left;
  padding: 0 1em 0 1em;
}

.header-item {
  font-size: 1rem;
  color: var(--white);
  padding: 1em;
}

.header-logo {
  font-weight: bold;
  font-size: 1.2rem;
}

.header-logo:hover {
  cursor: pointer;
  color: var(--anchor);
}

.menu-column {
  margin: 0 2rem 0 0;
}

.overlay {
  background: rgba(255,255,255, .16);
}

.hide-header {
  max-height: 0px;
  transition: .5s;
  transition-delay: .3s;
}

.show-header {
  max-height: 33vh;
  transition: .8s;
}</style>
<header id="header-holder">
    <div class="overlay">
        <div class="header">
            <div class="header-left">
                <span class="header-logo header-item"><a href="/">Jared's PG</a></span>
            </div>
            <div class="header-right">
                <a href="/physics/">Physics</a>
                <a href="/algorithms/">Algorithms</a>
            </div>
        </div>
    </div>
</header>`;

export default class JworkHeader extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));

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

customElements.define('jwork-header', JworkHeader);
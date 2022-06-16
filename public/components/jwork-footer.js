let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>footer {
  text-align: center;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row-reverse;
  justify-content: flex-start;
  justify-items: stretch;
  position: sticky;
  bottom: 0px;
  color: var(--background);
}

.item-holder {
  display: flex;
  transition: .5s;
  flex-direction: column;
  align-items: center;
  justify-items: stretch;
  padding: 0 1.5rem;
  background-color: rgba(255, 255, 255, 16);
}

.item-holder:hover {
  cursor: pointer;
  margin: 0;
  background-color: var(--palette-primary);
  color: var(--background);
}

.item-holder:hover + .expanse {
  transition: .5s cubic-bezier(0.165, 0.84, 0.44, 1);
  flex-grow: 1;
  max-width: 100%;
  padding-right: 1.5rem;
}

.expanse {
  border-left: 2px solid var(--palette-primary);
  background-color: var(--palette-darkest);
  transition: .3s;
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  color: var(--palette-lightest);
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.item {
  font-size: 1rem;
  margin: .5rem;
}

.darkest {
  background-color: var(--palette-darkest);
}

.light {
  background-color: var(--palette-light);
}

.lightest {
  background-color: var(--palette-lightest);
  color: var(--background);
}
</style>
<footer>
    <!--
    <a class="item-holder" href="https://github.com/jnlongnecker">
        <p class="item">GitHub</p>
    </a>
    <div class="expanse">View all my GitHub repositories</div>
    <a class="item-holder" href="https://github.com/jnlongnecker/jared">
        <p class="item">Site Repo</p>
    </a>
    <div class="expanse">View the source code for this site</div>
    -->
</footer>`;

export default class JworkFooter extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));
	}
 
}

customElements.define('jwork-footer', JworkFooter);
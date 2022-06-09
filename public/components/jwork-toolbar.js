let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" href="../styles/common.css" />
<style>.toolbar {
    position: absolute;
    display: flex;
    justify-content:start;
}

.head {
    background: rgba(40,40,40,0.4);
    color: var(--color);
    writing-mode: vertical-rl;
    text-orientation: mixed;
    height: 100%;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
}

.head:hover {
    cursor: pointer;
}

.content-holder {
    background: rgba(40,40,40,0.2);
    color: var(--color);
    height: 100%;
    max-width: 0px;
    transition: 0.5s;
    overflow: hidden;
    white-space: nowrap;
}

.expanded {
    max-width: 100%;
    transition: 0.5s;
}

.formatting {
    padding: 1rem;
}

.hide {
    display: none;
}</style>
<div>
    <slot name="item"></slot>
    <div class="toolbar hide">
        <div class="content-holder">
            <div class="formatting">
                <slot name="content"></slot>
            </div>
        </div>
        <div class="head">Toolbar</div>
    </div>
</div>`;

export default class JworkToolbar extends HTMLElement {

	constructor() {
		super();
		this.template = this.attachShadow({ mode: "open" });
		this.template.appendChild(template.content.cloneNode(true));
	}


	connectedCallback() {
		this.toolbar = this.template.querySelector(".toolbar");
		this.parent = this.querySelector("*[slot=item]:first-child");
		const cb = () => {
			let newStyles = "";
			let parent = this.parent;
			const coords = parent.getBoundingClientRect();

			newStyles += `top:${coords.top + window.pageYOffset}px;`;
			newStyles += `left:${coords.right}px;`;
			newStyles += `height:${coords.height}px;`;

			this.toolbar.setAttribute("style", newStyles);
			console.log("adjusting");
		}
		let resizeObserver = new MutationObserver(cb);
		resizeObserver.observe(this.parent, { childList: true, attributes: true });

		let contentSlot = this.template.querySelector("slot[name=content]");
		contentSlot.onslotchange = () => {
			this.template.querySelector(".toolbar").classList.remove("hide");
		}

		this.template.querySelector(".head").addEventListener("click", () => {
			this.template.querySelector(".content-holder").classList.toggle("expanded");
		});
	}

}

customElements.define('jwork-toolbar', JworkToolbar);
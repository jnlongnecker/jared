export default class Toolbar extends HTMLElement {

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

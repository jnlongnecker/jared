export default class Toolbar extends HTMLElement {

    connectedCallback() {
        this.toolbar = this.template.querySelector(".toolbar");
        this.parent = this.querySelector("*[slot=item]:first-child");

        // Position the toolbar correctly on the parent
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

        // Detect changes in the parent
        let resizeObserver = new ResizeObserver(cb);
        resizeObserver.observe(this.parent);

        // Hide the toolbar when nothing is slotted in for content
        let contentSlot = this.template.querySelector("slot[name=content]");
        contentSlot.onslotchange = () => {
            this.template.querySelector(".toolbar").classList.remove("hide");
        }

        // Expand/reduce the toolbar on head click
        this.template.querySelector(".head").addEventListener("click", () => {
            this.template.querySelector(".content-holder").classList.toggle("expanded");
        });
    }
}

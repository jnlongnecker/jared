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

            // Hide the toolbar on small clients
            if (document.documentElement.clientWidth < 900) {
                this.toolbar.setAttribute("style", "max-height: 0; overflow: hidden");
            }
            else {
                this.toolbar.setAttribute("style", newStyles);
            }
        }

        // Detect changes in the parent
        let resizeObserver = new ResizeObserver(cb);
        resizeObserver.observe(this.parent);

        // Unhide the toolbar when content has been slotted in
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

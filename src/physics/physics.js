/* jwork flag no-shadow */
import JworkCircles from "../components/jwork-circles.js";
import JworkTransition from "../components/jwork-transition.js";

export default class Algorithms extends HTMLElement {

    connectedCallback() {
        console.log("connected");
        window.addEventListener("popstate", () => {
            JworkTransition.fadeIn(() => { this.checkState() });
        });
        window.addEventListener("beforeunload", this.handleUnload);

        this.checkState();
    }

    handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let elem = event.currentTarget;

        let newTitle;
        let newUrl;
        switch (elem.getAttribute("href")) {
            case "circles":
                newTitle = "Circles";
                newUrl = "circles";
                break;
        }

        window.history.pushState({ pageTitle: newTitle }, "", newUrl);
        JworkTransition.fadeIn(() => { this.checkState() });
    }

    checkState = () => {
        let state = history.state;

        if (!state) {
            let newTitle;
            let finalSpot = window.location.pathname.substring(window.location.pathname.lastIndexOf("/"));

            switch (finalSpot) {
                case "/physics":
                    window.location.pathname += "/";
                case "/":
                    newTitle = "Physics";
                    break;
                case "/circles":
                    newTitle = "Circles";
                    break;
                default:
                    window.location.pathname = "/404";
                    break;
            }
            state = { pageTitle: newTitle };
        }

        this.innerHTML = "";
        document.title = state.pageTitle;

        switch (state.pageTitle) {
            case "Physics":
                this.appendChild(template.content.cloneNode(true));
                document.querySelectorAll("jwork-physics a").forEach((elem) => {
                    elem.addEventListener("click", this.handleClick);
                });
                break;
            case "Circles":
                this.appendChild(document.createElement("jwork-circles", { is: JworkCircles }));
                break;
        }
        JworkTransition.fadeOut();
    }
}

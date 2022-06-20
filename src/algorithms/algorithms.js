/* jwork flag no-shadow */
import JworkWfc from "../components/jwork-wfc.js";
import JworkQuadTree from "../components/jwork-quad-tree.js";
import JworkBoids from "../components/jwork-boids.js";
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
            case "wfc":
                newTitle = "WFC";
                newUrl = "wfc";
                break;
            case "quadTree":
                newTitle = "Quad Tree";
                newUrl = "quadTree";
                break;
            case "boids":
                newTitle = "Boids";
                newUrl = "boids";
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
                case "/algorithms":
                    window.location.pathname += "/";
                case "/":
                    newTitle = "Algorithms";
                    break;
                case "/quadTree":
                    newTitle = "Quad Tree";
                    break;
                case "/wfc":
                    newTitle = "WFC";
                    break;
                case "/boids":
                    newTitle = "Boids";
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
            case "Algorithms":
                this.appendChild(template.content.cloneNode(true));
                document.querySelectorAll("jwork-algorithms a").forEach((elem) => {
                    elem.addEventListener("click", this.handleClick);
                });
                break;
            case "Quad Tree":
                this.appendChild(document.createElement("jwork-quad-tree", { is: JworkQuadTree }));
                break;
            case "WFC":
                this.appendChild(document.createElement("jwork-wfc", { is: JworkWfc }));
                break;
            case "Boids":
                this.appendChild(document.createElement("jwork-boids", { is: JworkBoids }));
                break;
        }
        JworkTransition.fadeOut();
    }
}

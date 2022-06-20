import jworkImageCard from "./jwork-image-card.js";
import JworkWfc from "../components/jwork-wfc.js";
import JworkQuadTree from "../components/jwork-quad-tree.js";
import JworkBoids from "../components/jwork-boids.js";
import JworkTransition from "../components/jwork-transition.js";

let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>/* To Do /*
</style>
<section>
    <h1 class="main-header">Algorithm Sketches</h1>
    <div class="card-container">
        <a href="quadTree">
            <jwork-image-card image="../images/previews/quadtree.png" label="quad tree"></jwork-image-card>
        </a>
        <a href="wfc">
            <jwork-image-card image="../images/previews/wfc.png" label="wave function collapse"></jwork-image-card>
        </a>
        <!--
        <a href="boids">
            <jwork-image-card image="../images/previews/circles.png" label="boids"></jwork-image-card>
        </a>
        -->
    </div>
</section>`;

export default class JworkAlgorithms extends HTMLElement {

	constructor() {
		super();
	}


	connectedCallback() {
		this.appendChild(template.content.cloneNode(true));
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

customElements.define('jwork-algorithms', JworkAlgorithms);
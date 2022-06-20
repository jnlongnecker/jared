import jworkImageCard from "./jwork-image-card.js";
import JworkCircles from "../components/jwork-circles.js";
import JworkTransition from "../components/jwork-transition.js";

let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style></style>
<section>
    <h1 class="main-header">Physics Sketches</h1>
    <div class="card-container">
        <a href="circles">
            <jwork-image-card image="../images/previews/circles.png" label="circles"></jwork-image-card>
        </a>
    </div>
</section>`;

export default class JworkPhysics extends HTMLElement {

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

customElements.define('jwork-physics', JworkPhysics);
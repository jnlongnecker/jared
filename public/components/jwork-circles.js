import jworkHeader from "./jwork-header.js";
import jworkDemoContent from "./jwork-demo-content.js";
import jworkP5Canvas from "./jwork-p5-canvas.js";
import jworkFooter from "./jwork-footer.js";


let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style></style>
<jwork-header></jwork-header>
<jwork-demo-content>
    <span slot="header">Circles</span>
    <span slot="subheader">Rounded Movement</span>
    <jwork-p5-canvas sketch="circle" slot="canvas"></jwork-p5-canvas>
    <span slot="blurb">A simluation of circular bodies moving with no friction</span>
    <div slot="interactivity">
        <h3 class="centered">Interactivity</h3>
        <p class="section-content">
            Click on the canvas to bounce the circles away from the mouse point. Bounced circles will
            make a "pop" sound and change to a randomized color. Every 3rd "pop" makes confetti appear.
        </p>
    </div>

    <div slot="content">
        <section>
            <div class="section-content">
                <h1 class="main-header">About This Project</h1>
                <p class="info">
                    This was the very first of all my projects on this site, so a lot of the process was simply learning
                    the new technology of the p5.js library. First, let's discuss how it works: There are 16
                    circles that get created when the window is loaded. Each circle has a randomized position and
                    radius, and to ensure circles do not get created within each other, each circle is repositioned if
                    it is inside another circle. This process repeats until no circles intersect. Circles are assigned a
                    mass based on their radius and an initial, random force is applied to each circle. On a collision,
                    circles will bounce according to where they impacted the other surface.
                </p>
                <hr class="main-hr" />
                <p class="info">
                    This project went through several iterations where it began with no forces, added forces and then
                    removed them again. I did end up keeping the initalizing force to create velocities that correspond
                    as expected to the size of the circles, but that's it. The primary issue this project went through
                    was how to get a convincing reflection on a bounce. When I finally got a convincing equation,
                    collisions on an object from behind ended up looking nonsensical, so there needed to be an
                    additional check and handling of all collisions from behind.
                </p>
                <p class="info">
                    The collision normal that velocity is reflected over is actually quite simple, it's the difference
                    of the two circles' centers. When colliding from behind, the velocity heading is averaged with the
                    collision heading to get the new heading. In order to ensure that circles do not speed up to
                    hilariously impossible speed, the magnitude of all velocities is kept constant.
                </p>
            </div>
        </section>
    </div>
</jwork-demo-content>
<jwork-footer></jwork-footer>`;

export default class JworkCircles extends HTMLElement {

	constructor() {
		super();
	}
	connectedCallback() {
		this.appendChild(template.content.cloneNode(true));
	}
 
}

customElements.define('jwork-circles', JworkCircles);
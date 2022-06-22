import jworkDemoContent from "./jwork-demo-content.js";
import jworkP5Canvas from "./jwork-p5-canvas.js";


let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>/* To Do /*
</style>
<jwork-demo-content>
    <span slot="header">Boids</span>
    <span slot="subheader">Basic animal behaviors</span>
    <jwork-p5-canvas sketch="boids" slot="canvas"></jwork-p5-canvas>
    <span slot="blurb">An algorithm for the simulation of flocking animals</span>
    <div slot="interactivity">
        <h3 class="centered">Interactivity</h3>
        <p class="centered">
            Control the rules that govern the boids in the settings. Clicking on the canvas will result in a new
            obstacle to rise at that location, and clicking on an obstacle will lower it. When paused, you can click on
            a boid to highlight it against the rest of the boids to make it easier to follow. Clicking anywhere on the
            canvas while a boid is highlighted de-selects it.
        </p>
    </div>

    <div slot="content">
        <section>
            <div class="section-content">
                <h1 class="main-header">About This Project</h1>
                <p class="info">
                    Finding out about boids was one of my motivations for making this website. These little guys are
                    infinitely interesting, and the behaviors that come about as a result of these simple rules are
                    truly remarkable. I've found that a lot of very interesting outcomes, especially in nature, are the
                    result of fairly simple rules being followed.
                </p>
                <p class="info">
                    Enough gushing about how cool boids are, what the heck are they? Boids are a behavior algorithm
                    created by Craig Reynolds in 1986 to model the motion of flocking animals. If you're interested in
                    more, the original documentation on the algorithm is found <a
                        href="https://www.red3d.com/cwr/boids/">here</a>.
                </p>
                <hr class="main-hr" />
                <p class="info">
                    Boids are simple creatures that follow simple rules:
                <ul>
                    <li>Separation: A boid will attempt to steer away from local boids to avoid crowding
                    <li>Alignment: A boid will attempt to align itself in the same direction of other local boids
                    <li>Cohesion: A boid will attempt to steer towards the average position of local boids
                </ul>
                Once you put these behaviors together, you now have a flock of boids!
                </p>
                <p class="info">
                    In creating this project, I had quite the initial struggle with the behaviors. These behaviors all
                    comment on how a boid should <i>steer</i>, which imply an acceleration. If you read my writeup on
                    the <a href="/physics/circles">Circles project</a>, you'll know I tried and failed to use forces on
                    that project; so I just went for something convincing. With boids, there was no getting around it
                    and I had to properly work with velocity and acceleration.
                </p>
                <p class="info">
                    Once the basic behaviors were implemented, I then set about the task of the interactivity of the
                    project. It became immediately obvious to me that I wanted the boids to be capable of navigating
                    obstacles, so the task of describing my own steering behavior that would avoid obstacles came into
                    being. The final behavior is quite simple; but this simple rule came about from several hours of
                    sketching and failure.
                </p>
                <hr class="main-hr" />
                <p class="info">
                    <img src="../images/boids-avoid-obstacles.png" alt="Image of a boid avoiding an obstacle" />
                    If a boid is close enough to an obstacle, it will start to try and avoid it. In order to not collide
                    with the obstacle, a direction to the obstacle is calculated. Then, in order to avoid it, we simply
                    rotate that vector to the object by 90 degrees. Unfortunately, that's not enough. We must also find
                    out which direction to rotate, clockwise or counter-clockwise. That is where the angle between the
                    velocity and the vector to the center comes into play.
                </p>
                <p>
                    p5 has a handy way of calculating angles that makes determining which direction to rotate very
                    simple. If the angle is positive, we rotate clockwise. If the angle is negative, we rotate
                    counter-clockwise. Or in other words, if our velocity angle is greater than our angle to the
                    obstacle, we rotate clockwise. p5 will ensure that the angle calculated between the two is always
                    the smallest possible angle, and will take care of that pesky detail of 10 degrees being more than
                    350 degrees, for example.
                </p>
        </section>
    </div>
</jwork-demo-content>`;

export default class JworkBoids extends HTMLElement {

	constructor() {
		super();
	}
	connectedCallback() {
		this.appendChild(template.content.cloneNode(true));
	}

}

customElements.define('jwork-boids', JworkBoids);
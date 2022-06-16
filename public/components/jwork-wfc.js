import jworkHeader from "./jwork-header.js";
import jworkDemoContent from "./jwork-demo-content.js";
import jworkP5Canvas from "./jwork-p5-canvas.js";
import jworkFooter from "./jwork-footer.js";


let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style>/* To Do /*
</style>
<jwork-header></jwork-header>
<jwork-demo-content>
    <span slot="header">Wave Function Collapse</span>
    <span slot="subheader">AI with no learning</span>
    <jwork-p5-canvas sketch="wfc" slot="canvas"></jwork-p5-canvas>
    <span slot="blurb">A pattern recognition algorithm to learn rules and construct larger outputs</span>
    <div slot="interactivity">
        <h3 class="centered">Interactivity</h3>
        <p class="centered">
            Draw in the provided box to create a sample, then click on the <code>RUN</code> button to run the algorithm.
            Left click to draw in the chosen color, and right click on a pixel to change to that color. Select the color
            picker above the sample to select a brand-new color. The red box is a representation of the sampling size
        </p>
    </div>

    <div slot="content">
        <section>
            <div class="section-content">
                <h1 class="main-header">About This Project</h1>
                <p class="info">
                    One of the many things I am interested in are video games. My whole life, I've loved these
                    interactive programs and dreamed of creating my own for a long time. In fact, my love for video
                    games inspired my passion for programming. In my interest, one day I found myself watching a video
                    on random content generation for video games, and the Wave Function Collapse algorithmic technique
                    was put on full display.
                </p>
                <hr class="main-hr" />
                <p class="info">
                    Here's how the algorithm works:
                <ol>
                    <li>Cut up the input into patterns depending on the sampling size N
                    <li>Rotate the patterns across specified degrees of symmetry to create more patterns
                    <li>Create an output of patterns, starting with every pattern at every position at the same time
                    <li>Pick the position closest to be solved and randomly pick a pattern for it to be
                    <li>Based on that chosen pattern, adjacent patterns may no longer fit, so remove those from the
                        possibility pool and repeat until no patterns can be removed
                    <li>Repeat 4-5 until each position has 1 pattern or if a position has 0 patterns and fails
                </ol>
                </p>
                <p class="info">
                    The process of writing this was fairly straightforward, but took quite a bit of effort in
                    understanding the implementation. The original algorithm
                    (found <a href="https://github.com/mxgmn/WaveFunctionCollapse">here</a>) was not exactly written
                    in a way that was intended to be read. Lots of single letter variables and no comments. Luckily
                    for me, it was written in a language I am familiar with (C#) and so I went adding my own comments
                    for better understanding how it works (if you're interested in this deconstruction, you can find my
                    fork <a href="https://github.com/jnlongnecker/WaveFunctionCollapse">here</a>).
                </p>
                <hr />
                <p class="info">
                    Once the deconstruction of the algorithm was done and I sufficiently understood it, I then underwent
                    the task of translating the algorithm to JavaScript. How the algorithm works here is that the
                    pattern I supply to the algorithm is created by the user in the canvas, which is stored as a matrix
                    of colors. The algorithm then runs and outputs a larger matrix of colors based on the supplied
                    pattern.
                </p>
                <p class="info">

                </p>
            </div>
        </section>
    </div>
</jwork-demo-content>
<jwork-footer></jwork-footer>`;

export default class JworkWfc extends HTMLElement {

	constructor() {
		super();
	}
	connectedCallback() {
		this.appendChild(template.content.cloneNode(true));
	}
 
}

customElements.define('jwork-wfc', JworkWfc);
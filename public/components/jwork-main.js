import jworkHeader from "./jwork-header.js";
import jworkDemoContent from "./jwork-demo-content.js";
import jworkP5Canvas from "./jwork-p5-canvas.js";
import jworkFooter from "./jwork-footer.js";


let template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" media="screen and (max-width:900px)" href="../styles/common-phone.css" /><link rel="stylesheet" media="screen and (min-width:900px)" href="../styles/common.css" />
<style></style>
<jwork-header></jwork-header>
<jwork-demo-content>
    <span slot="header">Welcome to My Playground</span>
    <span slot="subheader">I hope you enjoy your stay!</span>
    <jwork-p5-canvas sketch="circle" slot="canvas"></jwork-p5-canvas>
    <span slot="blurb">Enjoy the circles</span>

    <div slot="content">
        <section>
            <div class="section-content">
                <h1 class="main-header">What Is This Place?</h1>
                <p class="info">
                    I call this my playground; it's a collection of my various interests of web design, computer
                    science,
                    mathematics, and more. The entirety of this site and its functionality was constructed by my own
                    hand
                    using
                    native JavaScript, HTML and CSS. The only exception to this is the use of the
                    <a href="https://p5js.org/">p5 library</a>
                    for the canvas and drawing tools.
                </p>
                <hr class="main-hr" />
                <p class="info">
                    The main attraction here are the projects, and the bouncing circles above are an example of one of
                    these projects. Each of these will have an info blurb to describe the project and how to interact
                    with the it. Below the projects are an explanation of how it works and a description of how I went
                    about creating it and any notable struggles.
                </p>
                <p class="info">
                    By the nature of how these projects work, they are primarily intended for desktop viewing. Any
                    projects that notably perform poorly on mobile will be noted.
                </p>
            </div>
        </section>

        <section>
            <div class="section-content">
                <h1 class="main-header">Who Am I?</h1>
                <p class="info">
                    I'm so glad you asked, my name is Jared Longnecker. In my day-to-day, I'm a Salesforce Trainer with
                    several Salesforce certifications. I have a BS in Computer Science from the University of Houston
                    and, as you may imagine from this page, I have a great interest in graphics, visualization and
                    programming.
                    These interests take me between the science trifecta of theoretical mathematics, physics, and
                    algorithms.
                </p>
                <hr class="main-hr" />
                <p class="info">
                    While the design of this page is not the primary focus of it, it's still important to look good
                    right?
                    Like
                    I mentioned before, this uses nothing but my own hand written code; so no CSS libraries either. It's
                    meant
                    as a learning tool as much as a portfolio of my interests.
                </p>
                <p class="info">
                    I hope at the end of the day you enjoy what you see here and perhaps learn something along the way.
                    Enjoy
                    your stay!
                </p>
            </div>
        </section>
    </div>
</jwork-demo-content>
<jwork-footer></jwork-footer>`;

export default class JworkMain extends HTMLElement {

	constructor() {
		super();
	}
	connectedCallback() {
		this.appendChild(template.content.cloneNode(true));
	}
 
}

customElements.define('jwork-main', JworkMain);
/* jwork flag no-shadow */
import { circle } from "../components/circleSketch.js";
import { quadTree } from "../components/quadTreeSketch.js";
import { wfc } from "../components/wfcSketch.js";
import { boids } from "../components/boidsSketch.js";
import { test } from "../components/testSketch.js";

export default class P5Canvas extends HTMLElement {

    // The sketch attribute determines the type of sketch to load on the canvas
    static get observedAttributes() {
        return ["sketch"];
    }

    // Update the canvas sketch whenever the attribute changes
    attributeChangedCallback(name, oldVal, newVal) {
        this.setCanvas(newVal);
    }

    // Handles sketch cases
    setCanvas(type) {

        // Loads too fast before the canvas sometimes, this is a fix
        setTimeout(() => {
            switch (type.toLowerCase()) {
                case "circle":
                    this.p5instance = new p5(circle, "canvas-holder");
                    break;
                case "quadtree":
                    this.p5instance = new p5(quadTree, "canvas-holder");
                    break;
                case "wfc":
                    this.p5instance = new p5(wfc, "canvas-holder");
                    break;
                case "boids":
                    this.p5instance = new p5(boids, "canvas-holder");
                    break;
            }
        }, 0);
    }
}
/* jwork flag no-shadow */
import { circle } from "./circleSketch.js";
import { quadTree } from "./quadTreeSketch.js";
import { test } from "./testSketch.js";

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
        switch (type.toLowerCase()) {
            case "circle":
                this.p5instance = new p5(circle, "canvas-holder");
                break;
            case "quadtree":
                this.p5instance = new p5(quadTree, "canvas-holder");
                break;
        }
    }
}
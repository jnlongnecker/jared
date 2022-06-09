/* jwork flag no-shadow */
import { circle } from "./circleSketch.js";
import { quadTree } from "./quadTreeSketch.js";
import { test } from "./testSketch.js";

export default class P5Canvas extends HTMLElement {

    static get observedAttributes() {
        return ["sketch"];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this.setCanvas(newVal);
    }

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
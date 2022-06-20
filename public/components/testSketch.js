let p5;

export const test = (sketch) => {

    p5 = sketch;

    let canvas;
    let toolbar;

    let cWidth = document.documentElement.clientWidth * 0.6;
    let cHeight = document.documentElement.clientHeight * 0.65;
    let paletteFillColor = getComputedStyle(document.body).getPropertyValue('--palette-primary');
    let paletteBackgroundColor = p5.color('hsl(0,0%,12%)');

    sketch.windowResized = () => {

    }

    sketch.setup = () => {
        if (document.documentElement.clientWidth <= 900) {
            cWidth = document.documentElement.clientWidth * 0.8;
        }
        canvas = p5.createCanvas(cWidth, cHeight);

        PopulateToolbar();
    }

    sketch.draw = () => {
        sketch.background(paletteBackgroundColor);
    }

    function PopulateToolbar() {
        toolbar = document.querySelector("jwork-toolbar");
    }
}
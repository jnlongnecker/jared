import JworkIconButton from "./jwork-icon-button.js";
let p5;

export const test = (sketch) => {

    p5 = sketch;

    let canvas;
    let toolbar;
    let playButton;
    let downloadButton;

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
        let toolbar = document.querySelector("jwork-toolbar");

        playButton = document.createElement("jwork-icon-button", { is: JworkIconButton });
        playButton.setAttribute("icon", "pause");
        playButton.onclick = () => { playButton.togglePlay() };

        downloadButton = document.createElement("jwork-icon-button", { is: JworkIconButton });
        downloadButton.setAttribute("icon", "download");
        downloadButton.onclick = () => { Download(); };

        toolbar.appendChild(playButton);
        toolbar.appendChild(downloadButton);
    }

    function Download() {
        p5.saveCanvas(p5.canvas, "test", "png");
    }
}
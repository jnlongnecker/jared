import { ColorToHex } from "../scripts/util.js"

let p5;

class UserSketch {
    constructor(x, y, width, height, pixelsX, pixelsY, pixels) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.pixelsX = pixelsX;
        this.pixelsY = pixelsY;
        this.pixelSize = this.width / this.pixelsX;
        if (pixels) {
            this.pixels = [...pixels];
        }
        else {
            this.pixels = [];
            for (let r = 0; r < pixelsY; r++) {
                this.pixels.push([]);
                for (let c = 0; c < pixelsX; c++) {
                    this.pixels[r].push(p5.color("#fff"));
                }
            }
        }
    }

    GetTexture() {
        return this.pixels;
    }

    Render() {
        p5.strokeWeight(2);
        let mousePos = {
            x: p5.floor((p5.mouseX - this.x) / this.pixelSize),
            y: p5.floor((p5.mouseY - this.y) / this.pixelSize)
        };
        for (let r = 0; r < this.pixelsY; r++) {
            for (let c = 0; c < this.pixelsX; c++) {
                let x = this.x + (c * this.pixelSize);
                let y = this.y + (r * this.pixelSize);

                let fillColor = this.pixels[r][c];

                p5.stroke(p5.color("#000"));
                p5.fill(fillColor);
                p5.rect(x, y, this.pixelSize, this.pixelSize);
            }
        }
        if (mousePos.x >= 0 && mousePos.y >= 0) {
            p5.strokeWeight(4);
            p5.stroke(p5.color("blue"));
            p5.noFill();
            p5.rect((mousePos.x * this.pixelSize) + this.x, (mousePos.y * this.pixelSize) + this.y, this.pixelSize, this.pixelSize);
        }
    }

    Select() {
        let mousePos = {
            x: p5.floor((p5.mouseX - this.x) / this.pixelSize),
            y: p5.floor((p5.mouseY - this.y) / this.pixelSize)
        };
        if (mousePos.x < 0 || mousePos.y < 0 || mousePos.x >= this.pixelsX || mousePos.y >= this.pixelsY) return p5.color("#fff");

        return this.pixels[mousePos.y][mousePos.x];
    }

    Ink(newColor) {
        let mousePos = {
            x: p5.floor((p5.mouseX - this.x) / this.pixelSize),
            y: p5.floor((p5.mouseY - this.y) / this.pixelSize)
        };
        if (mousePos.x < 0 || mousePos.y < 0 || mousePos.x >= this.pixelsX || mousePos.y >= this.pixelsY) return;

        this.pixels[mousePos.y][mousePos.x] = newColor;
    }
};

class OutputTexture {
    constructor(patterns, rows, cols) {
        this.cols = cols;
        this.rows = rows;
        this.pixels = this.OldGenerateMapFromPatterns(patterns);
    };

    Render(width = this.cols, height = this.rows, x, y) {
        p5.strokeWeight(.5);
        p5.stroke(p5.color(255, 255, 255));
        let xSize = width / this.pixels[0].length;
        let ySize = height / this.pixels.length;
        let pixelSize = p5.min(xSize, ySize);
        for (let row = 0; row < this.pixels.length; row++) {
            for (let col = 0; col < this.pixels[row].length; col++) {
                let currColor = this.pixels[row][col];
                if (typeof currColor == "string") {
                    p5.fill(currColor);
                }
                else {
                    p5.fill(currColor.levels[0], currColor.levels[1], currColor.levels[2]);
                }
                p5.rect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
            }
        }
    };

    OldGenerateMapFromPatterns(patterns) {
        let result = [];
        let N = patterns[0].pixels.length;
        let FMX = this.cols;
        let FMY = this.rows;

        for (let y = 0; y < FMY; y++) {
            result.push([]);
            let dy = y < FMY - N + 1 ? 0 : N - 1;
            for (let x = 0; x < FMX; x++) {
                let dx = x < FMX - N + 1 ? 0 : N - 1;
                let c = patterns[x - dx + (y - dy) * FMX].pixels[dy][dx];
                result[y].push(c);
            }
        }
        return result;
    }

    GenerateMapFromPatterns(patterns) {
        let result = [];
        let N = patterns[0].pixels.length;

        for (let row = 0; row < this.rows * N; row++) {
            result.push([]);
            let pRow = row % N;
            let accessRow = (row / N) | 0;
            for (let col = 0; col < this.cols * N; col++) {
                let pCol = col % N;
                let accessCol = (col / N) | 0;
                let pColor = patterns[accessRow + accessCol * this.rows].pixels[pRow][pCol];
                if (!pColor) console.log(`Tried to get ${accessRow + accessCol * this.rows}`);
                result[row].push(pColor);
            }
        }
        this.rows = this.rows * N;
        this.cols = this.cols * N;

        return result;
    };

    Debug() {
        let p = new Pattern(this.pixels);
        p.Debug();
    }
};


export const wfc = (sketch) => {
    p5 = sketch;

    // Interactivity tools
    let canvas;
    let userSketch;
    let colorPicker;
    let generateButton;
    let message;

    // Wave Function Collapse variables
    let output;
    let wfc = new Worker('./components/wfcWorker.js');

    // Canvas settings
    let cWidth = document.documentElement.clientWidth * 0.5;
    let cHeight = document.documentElement.clientHeight * 0.5;
    let paletteFillColor = getComputedStyle(document.body).getPropertyValue('--palette-darkest');
    let paletteBackgroundColor = getComputedStyle(document.body).getPropertyValue('--background');

    sketch.windowResized = () => {
        cWidth = document.documentElement.clientWidth * 0.5;
        cHeight = document.documentElement.clientHeight * 0.5;
        if (cWidth < cHeight)
            cWidth *= 1.5;
        p5.resizeCanvas(cWidth, cHeight);

        let temp = userSketch;
        let userSketchWidth = cWidth * 0.3;
        userSketch = new UserSketch(cWidth - userSketchWidth - 2, cHeight - userSketchWidth - 2, userSketchWidth, cHeight, 12, 12, temp.pixels);
    }

    sketch.setup = () => {
        if (cWidth < cHeight)
            cWidth *= 1.5;
        canvas = p5.createCanvas(cWidth, cHeight);

        let sketchHolder = document.querySelector("#canvas-holder");
        sketchHolder.addEventListener("contextmenu", e => e.preventDefault());

        let userSketchWidth = cWidth * 0.3;
        userSketch = new UserSketch(cWidth - userSketchWidth - 2, cHeight - userSketchWidth - 2, userSketchWidth, cHeight, 12, 12);

        colorPicker = p5.createColorPicker(paletteFillColor);
        colorPicker.parent(sketchHolder);

        generateButton = p5.createButton("Run");
        generateButton.parent(sketchHolder);
        generateButton.mousePressed(GenerateOutput);
    }

    sketch.draw = () => {
        let canvPos = canvas.canvas.getBoundingClientRect();
        colorPicker.position(canvPos.right - userSketch.width, window.pageYOffset + canvPos.bottom - userSketch.width - 30, 'ABSOLUTE');
        generateButton.position(colorPicker.position().x + colorPicker.width + 5, colorPicker.position().y);

        p5.background(paletteBackgroundColor);

        // Used to draw or change color
        if (p5.mouseIsPressed)
            if (p5.mouseButton == p5.LEFT)
                userSketch.Ink(colorPicker.color());
            else if (p5.mouseButton == p5.RIGHT)
                colorPicker.value(ColorToHex(userSketch.Select()));

        /*
        if (wfc && !wfc.done) {
            let success = wfc.Run(10);
            // message = "Algorithm running, please be patient!";
            if (success) {
                output = new OutputTexture(wfc.observedPatterns, wfc.height, wfc.width);
                message = "";
            }
            else if (success != null) {
                message = `Failure! The algorithm resulted in a contradiction. This probably wasn't your fault!`;
                wfc = null;
                output = null;
            }
            else if (p5.mouseIsPressed) {
                wfc.buildInProgress();
                //output = new OutputTexture(wfc.inProgress, wfc.height, wfc.width);
            }
        }
        */

        p5.noStroke();
        p5.fill("white");
        p5.text(message, 10, cHeight * 0.5, cWidth - userSketch.width - 10);
        userSketch.Render();
        if (output)
            output.Render(cWidth - userSketch.width, cHeight, 0, 0);
    }

    function GenerateOutput() {
        output = null;
        wfc.postMessage({ pixels: userSketch.pixels });
    }

    wfc.addEventListener("message", (event) => {
        let payload = event.data;
        output = new OutputTexture(payload.pixels, payload.width, payload.height);
    });

}
import { ColorToHex } from "../scripts/util.js"
import { createElementWithText } from "../scripts/util.js";

let p5;
let sampleSize;

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
            // No, I didn't type this out manually
            this.pixels = [
                [p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30')],
                [p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30')],
                [p5.color('#062c30'), p5.color('#062c30'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#062c30'), p5.color('#062c30')],
                [p5.color('#062c30'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#062c30')],
                [p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#ffffff'), p5.color('#ffffff')],
                [p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#ffffff'), p5.color('#ffffff')],
                [p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff')],
                [p5.color('#ffffff'), p5.color('#062c30'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#062c30'), p5.color('#ffffff')],
                [p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#ffffff'), p5.color('#ffffff')],
                [p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff')],
                [p5.color('#062c30'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#ffffff'), p5.color('#062c30')],
                [p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30'), p5.color('#062c30')]];
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

        p5.strokeWeight(3);
        p5.stroke(p5.color("red"));
        p5.noFill();
        p5.rect(this.x, this.y, this.pixelSize * sampleSize.value, this.pixelSize * sampleSize.value);

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
        if (mousePos.x < 0 || mousePos.y < 0 || mousePos.x >= this.pixelsX || mousePos.y >= this.pixelsY) {
            return;
        };

        this.pixels[mousePos.y][mousePos.x] = newColor;

    }

    Print() {
        let retString = "[";
        for (let r = 0; r < this.pixelsY; r++) {
            retString += r == 0 ? "[" : ",[";
            for (let c = 0; c < this.pixelsX; c++) {
                retString += c == 0 ?
                    "p5.color('" + this.pixels[r][c].toString("#rrggbb") + "')" :
                    ",p5.color('" + this.pixels[r][c].toString("#rrggbb") + "')";
            }
            retString += "]";
        }
        retString += "]";
        return retString;
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

    // Wave Function Collapse variables
    let output;
    let wfc = new Worker('./components/wfcWorker.js');
    let outputLength;
    let periodicInput;
    let periodicOutput;
    let symmetry;

    // Canvas settings
    let cWidth = document.documentElement.clientWidth * 0.6;
    let cHeight = document.documentElement.clientHeight * 0.65;
    let paletteFillColor = getComputedStyle(document.body).getPropertyValue('--palette-darkest');
    let paletteBackgroundColor = getComputedStyle(document.body).getPropertyValue('--background');

    sketch.windowResized = () => {
        cWidth = document.documentElement.clientWidth * 0.6;
        cHeight = document.documentElement.clientHeight * 0.65;
        if (document.documentElement.clientWidth <= 900) {
            cWidth = document.documentElement.clientWidth * 0.8;
        }
        p5.resizeCanvas(cWidth, cHeight);

        let temp = userSketch;
        let userSketchWidth = cWidth * 0.3;
        userSketch = new UserSketch(cWidth - userSketchWidth - 2, cHeight - userSketchWidth - 2, userSketchWidth, cHeight, 12, 12, temp.pixels);
    }

    sketch.setup = () => {
        if (document.documentElement.clientWidth <= 900) {
            cWidth = document.documentElement.clientWidth * 0.8;
        }
        canvas = p5.createCanvas(cWidth, cHeight);

        PopulateTools();

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


        p5.noStroke();
        p5.fill("white");
        userSketch.Render();
        if (output)
            output.Render(cWidth - userSketch.width, cHeight, 0, 0);
    }

    function GenerateOutput() {
        output = null;
        wfc.postMessage({
            pixels: userSketch.pixels,
            n: sampleSize.value,
            width: outputLength.value * sampleSize.value,
            height: outputLength.value * sampleSize.value,
            pInput: periodicInput.checked,
            pOutput: periodicOutput.checked,
            sym: symmetry.value
        });
    }

    function PopulateTools() {
        // Retrieve a reference to the toolbar
        let toolbar = document.querySelector("jwork-toolbar");

        // Create the div to hold the toolbar content to be slotted in
        let slotDiv = document.createElement("div");
        slotDiv.setAttribute("slot", "content");

        let wrapControls = document.createElement("div");
        wrapControls.classList.add("controls");

        let wrapCol1 = document.createElement("div");
        wrapCol1.classList.add("control-col");

        let inputLabel = createElementWithText("p", "Wrap Input");
        periodicInput = document.createElement("input");
        periodicInput.setAttribute("type", "checkbox");

        wrapCol1.appendChild(inputLabel);
        wrapCol1.appendChild(periodicInput);

        let wrapCol2 = document.createElement("div");
        wrapCol2.classList.add("control-col");

        let outputLabel = createElementWithText("p", "Periodic Output");
        periodicOutput = document.createElement("input");
        periodicOutput.setAttribute("type", "checkbox");

        wrapCol2.appendChild(outputLabel);
        wrapCol2.appendChild(periodicOutput);

        wrapControls.appendChild(wrapCol1);
        wrapControls.appendChild(wrapCol2);

        let numControls = document.createElement("div");
        numControls.classList.add("controls");

        let numCol = document.createElement("div");
        numCol.classList.add("control-col");

        let symmetryText = createElementWithText("p", "Degrees of Symmetry");
        symmetry = document.createElement("input");
        symmetry.setAttribute("type", "range");
        symmetry.setAttribute("min", "1"); symmetry.setAttribute("max", "8");
        let sampleText = createElementWithText("p", "Sampling Size");
        sampleSize = document.createElement("input");
        sampleSize.setAttribute("type", "range");
        sampleSize.setAttribute("min", "2"); sampleSize.setAttribute("max", "5");
        let outputText = createElementWithText("p", "Output Pixels");
        outputLength = document.createElement("input");
        outputLength.setAttribute("type", "range");
        outputLength.setAttribute("min", "5"); outputLength.setAttribute("max", "16");

        numCol.appendChild(symmetryText);
        numCol.appendChild(symmetry);
        numCol.appendChild(sampleText);
        numCol.appendChild(sampleSize);
        numCol.appendChild(outputText);
        numCol.appendChild(outputLength);

        numControls.appendChild(numCol);

        slotDiv.appendChild(wrapControls);
        slotDiv.appendChild(numControls);
        toolbar.appendChild(slotDiv);

        sampleSize.value = 3;
        outputLength.value = 16;
        periodicInput.checked = true;
        periodicOutput.checked = false;
        symmetry.value = 8;
    }

    wfc.addEventListener("message", (event) => {
        let payload = event.data;
        output = new OutputTexture(payload.pixels, payload.width, payload.height);
    });

}
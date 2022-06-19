import { ColorToHex, ConvertRemToPixels } from "../scripts/util.js"
import { createElementWithText } from "../scripts/util.js";
import JworkIconButton from "./jwork-icon-button.js";
import JworkButton from "./jwork-button.js";
import JworkSpinner from "./jwork-spinner.js";

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
        this.primary = getComputedStyle(document.body).getPropertyValue('--palette-primary');
        this.secondary = getComputedStyle(document.body).getPropertyValue('--palette-secondary');
        if (pixels) {
            this.pixels = [...pixels];
        }
        else {
            this.pixels = [];
            for (let r = 0; r < pixelsY; r++) {
                this.pixels.push([]);
                for (let c = 0; c < pixelsX; c++) {
                    this.pixels[r].push(p5.color("#333"));
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

        p5.strokeWeight(3);
        p5.stroke(p5.color(this.secondary));
        p5.noFill();
        p5.rect(this.x, this.y, this.pixelSize * sampleSize.value, this.pixelSize * sampleSize.value);

        if (mousePos.x >= 0 && mousePos.y >= 0 && mousePos.x < this.pixelsX && mousePos.y < this.pixelsY) {
            p5.strokeWeight(4);
            p5.stroke(p5.color(this.primary));
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
        newColor = p5.color(newColor);
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
        p5.strokeWeight(.2);
        p5.stroke('black');
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
    let spinner;
    let viewInput;
    let swapButton;
    let downloadButton;
    let toolbar;

    // Wave Function Collapse variables
    let output;
    let wfc = new Worker('./components/wfcWorker.js');
    let outputLength;
    let periodicInput;
    let periodicOutput;
    let symmetry;
    let wfcWorking;

    // Canvas settings
    let cWidth = document.documentElement.clientWidth * 0.6;
    let cHeight = cWidth * 0.5;
    let paletteBackgroundColor = p5.color('hsl(0,0%,12%)');

    sketch.windowResized = () => {
        cWidth = document.documentElement.clientWidth * 0.6;
        cHeight = cWidth * 0.5;
        p5.textSize(ConvertRemToPixels(2));
        let uSketchWidth = cWidth * 0.4;
        let uSketchX = cWidth * 0.6;
        let uSketchY = cWidth * 0.1;

        if (document.documentElement.clientWidth <= 900) {
            cWidth = document.documentElement.clientWidth * 0.8;
            cHeight = cWidth + cWidth * 0.2;
            uSketchX = 0;
            uSketchY = cWidth * 0.2;
            uSketchWidth = cWidth;
            toolbar.appendChild(swapButton);
        }
        else if (toolbar.contains(swapButton)) {
            toolbar.removeChild(swapButton);
        }
        p5.resizeCanvas(cWidth, cHeight);

        let temp = userSketch;
        userSketch = new UserSketch(uSketchX, uSketchY, uSketchWidth, uSketchWidth, 16, 16, temp.pixels);
    }

    sketch.setup = () => {
        let uSketchWidth = cWidth * 0.4;
        let uSketchX = cWidth * 0.6;
        let uSketchY = cWidth * 0.1;
        if (document.documentElement.clientWidth <= 900) {
            cWidth = document.documentElement.clientWidth * 0.8;
            cHeight = cWidth + cWidth * 0.2;
            uSketchX = 0;
            uSketchY = cWidth * 0.2;
            uSketchWidth = cWidth;
        }
        canvas = p5.createCanvas(cWidth, cHeight);
        p5.textFont('Open Sans');
        p5.textAlign("center");
        p5.textSize(ConvertRemToPixels(2));

        PopulateTools();

        wfcWorking = false;
        viewInput = true;

        let sketchHolder = document.querySelector("#canvas-holder");
        sketchHolder.addEventListener("contextmenu", e => e.preventDefault());
        sketchHolder.addEventListener("touchmove", e => e.preventDefault());

        userSketch = new UserSketch(uSketchX, uSketchY, uSketchWidth, uSketchWidth, 16, 16);
    }

    sketch.draw = () => {
        p5.background(paletteBackgroundColor);

        if (document.documentElement.clientWidth <= 900) {
            drawPhone();
            return;
        }
        drawDesktop();
    }

    function drawDesktop() {
        p5.noStroke();
        p5.fill("white");
        p5.text("Output", userSketch.width * 0.5, cHeight * 0.18);
        p5.text("Input", userSketch.width * 0.5 + cWidth * 0.6, cHeight * 0.18);

        // Used to draw or change color
        if (p5.mouseIsPressed)
            if (p5.mouseButton == p5.LEFT)
                userSketch.Ink(colorPicker.color());
            else if (p5.mouseButton == p5.RIGHT)
                colorPicker.color(ColorToHex(userSketch.Select()));


        p5.noStroke();
        p5.fill("white");
        userSketch.Render();
        if (output)
            output.Render(userSketch.width, userSketch.height, userSketch.x - cWidth * 0.6, userSketch.y);
    }

    function drawPhone() {
        if (viewInput) {
            p5.noStroke();
            p5.fill("white");
            p5.text("Input", userSketch.width * 0.5, cHeight * 0.1);

            userSketch.Render();
            return;
        }

        p5.noStroke();
        p5.fill("white");
        p5.text("Output", userSketch.width * 0.5, cHeight * 0.1);
        if (output) {
            output.Render(userSketch.width, userSketch.height, userSketch.x, userSketch.y)
        }

    }

    p5.touchStarted = () => {
        if (viewInput && document.documentElement.clientWidth <= 900) {
            userSketch.Ink(colorPicker.color());
            p5.canvas.focus();
        }
    }

    p5.touchMoved = () => {
        if (viewInput && document.documentElement.clientWidth <= 900) {
            userSketch.Ink(colorPicker.color());
        }
    }

    function GenerateOutput() {
        if (wfcWorking) return;

        wfcWorking = true;
        output = null;
        viewInput = false;
        wfc.postMessage({
            pixels: userSketch.pixels,
            n: sampleSize.value,
            width: outputLength.value * sampleSize.value,
            height: outputLength.value * sampleSize.value,
            pInput: periodicInput.checked,
            pOutput: periodicOutput.checked,
            sym: symmetry.value
        });
        let canvPos = canvas.canvas.getBoundingClientRect();
        if (!spinner) {
            generateButton.toggleDisabled();
            generateButton.togglePlay();
            spinner = document.createElement("jwork-spinner", { is: JworkSpinner });
            document.documentElement.appendChild(spinner);
            spinner.position(canvPos.left + userSketch.width * 0.5, canvPos.bottom - cHeight * 0.5);
        }
    }

    function PopulateTools() {
        // Retrieve a reference to the toolbar
        toolbar = document.querySelector("jwork-toolbar");

        // Create the div to hold the toolbar content to be slotted in
        let slotDiv = document.createElement("div");
        slotDiv.setAttribute("slot", "controls");

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
        sampleSize.setAttribute("min", "2"); sampleSize.setAttribute("max", "4");
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

        generateButton = document.createElement("jwork-icon-button", { is: JworkIconButton });
        generateButton.setAttribute("icon", "play");
        generateButton.onclick = () => {
            GenerateOutput();
        }

        toolbar.appendChild(generateButton);

        colorPicker = document.createElement("jwork-icon-button", { is: JworkIconButton });
        colorPicker.setAttribute("icon", "colorpicker");
        toolbar.appendChild(colorPicker);

        downloadButton = document.createElement("jwork-icon-button", { is: JworkIconButton });
        downloadButton.setAttribute("icon", "download");
        downloadButton.onclick = () => { Download(); };
        toolbar.appendChild(downloadButton);

        downloadButton.toggleDisabled();


        swapButton = document.createElement("jwork-icon-button", { is: JworkIconButton });
        swapButton.setAttribute("icon", "flip");
        swapButton.onclick = () => { viewInput = !viewInput; };

        if (document.documentElement.clientWidth <= 900) {
            toolbar.appendChild(swapButton);
        }
        toolbar.appendChild(slotDiv);


        sampleSize.value = 3;
        outputLength.value = 16;
        periodicInput.checked = true;
        periodicOutput.checked = false;
        symmetry.value = 8;
    }

    function Download() {
        if (!output) return;

        let canv = document.createElement("canvas");
        canv.width = output.pixels.length;
        canv.height = output.pixels[0].length;

        let context = canv.getContext("2d");
        let imageData = context.createImageData(canv.width, canv.height);

        for (let x = 0; x < output.pixels.length; x++) {
            for (let y = 0; y < output.pixels[x].length; y++) {
                let spot = (x * output.pixels.length + y) * 4;
                let color = output.pixels[x][y];
                if (typeof output.pixels[x][y] == "string") {
                    color = p5.color(output.pixels[x][y]);
                }
                imageData.data[spot + 0] = color.levels[0];
                imageData.data[spot + 1] = color.levels[1];
                imageData.data[spot + 2] = color.levels[2];
                imageData.data[spot + 3] = color.levels[3];
            }
        }

        context.putImageData(imageData, 0, 0);

        p5.saveCanvas(canv, "wfc-output", "png");
        let png = canv.toDataURL("image/png");
        return { type: "png", value: png };
    }

    wfc.addEventListener("message", (event) => {
        let payload = event.data;

        if (payload.result !== false) {
            output = new OutputTexture(payload.pixels, payload.width, payload.height);
        }
        else {
            toolbar.postError("Oops! We got stuck! Try running the algorithm again.");
        }

        if (downloadButton.getAttribute("disabled")) {
            downloadButton.toggleDisabled();
        }

        if (payload.done) {
            generateButton.toggleDisabled();
            generateButton.togglePlay();
            wfcWorking = false;
        }
        if (spinner) {
            document.documentElement.removeChild(spinner);
            spinner = null;
        }
    });

}
// p5 setup
var paletteFillColor = getComputedStyle(document.body).getPropertyValue("--palette-darkest");
var paletteBackgroundColor = getComputedStyle(document.body).getPropertyValue("--background");
var cWidth = document.documentElement.clientWidth * 0.5;
var cHeight = document.documentElement.clientHeight * 0.5;
var canvas;

var userSketch;
var colorPicker;
var generateButton;
var output = null;
var wfc = null;
var message = "";

function windowResized() {
  cWidth = document.documentElement.clientWidth * 0.5;
  cHeight = document.documentElement.clientHeight * 0.5;
  if (cWidth < cHeight)
    cWidth *= 1.5;

  resizeCanvas(cWidth, cHeight);
  ripple.CanvasResized(cWidth, cHeight);
}

// Called by sketch.setup
function customSetup() {

  // Ensure this script is the new active draw script
  RefreshActiveDrawScript();

  let sketchHolder = document.querySelector("#sketch-holder");
  sketchHolder.addEventListener("contextmenu", e => e.preventDefault());

  let userSketchWidth = cWidth * 0.3;
  userSketch = new UserSketch(cWidth - userSketchWidth - 2, cHeight - userSketchWidth - 2, userSketchWidth, cHeight, 12, 12);

  colorPicker = createColorPicker(paletteFillColor);
  colorPicker.parent(sketchHolder);
  let canvPos = canvas.position();
  colorPicker.position(canvPos.x + (cWidth - userSketchWidth), canvPos.y + (cHeight - userSketchWidth - 30), 'RELATIVE');

  generateButton = createButton("Run");
  generateButton.parent(sketchHolder);
  generateButton.mousePressed(GenerateOutput);
  generateButton.position(colorPicker.position().x + colorPicker.width + 5, colorPicker.position().y);
}

// Called by sketch.draw
function customDraw() {
  let canvPos = canvas.position();
  colorPicker.position(canvPos.x + (cWidth - userSketch.width), canvPos.y + (cHeight - userSketch.width - 30));
  generateButton.position(colorPicker.position().x + colorPicker.width + 5, colorPicker.position().y);
  background(paletteBackgroundColor);

  // Used to draw or change color
  if (mouseIsPressed)
    if (mouseButton == LEFT)
      userSketch.Ink(colorPicker.color());
    else if (mouseButton == RIGHT)
      colorPicker.value(ColorToHex(userSketch.Select()));

  if (wfc && !output) {
    let success = wfc.Run(1);
    message = "Algorithm running, please be patient!";
    if (success) {
      output = new OutputTexture(wfc.observedPatterns, wfc.height, wfc.width);
      output.Debug();
      message = "";
    }
    else if (success != null) {
      message = `Failure! The algorithm resulted in a contradiction. This probably wasn't your fault!`;
      wfc = null;
    }
  }

  noStroke();
  fill("white");
  text(message, 10, cHeight * 0.5, cWidth - userSketch.width - 10);
  userSketch.Render();
  if (output)
    output.Render(cWidth - userSketch.width, cHeight, 0, 0);
}


function GenerateOutput() {
  output = null;
  wfc = new OverlappingModel(userSketch.pixels);
}
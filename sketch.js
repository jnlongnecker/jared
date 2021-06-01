var cWidth = document.documentElement.clientWidth * 0.5;
var cHeight = document.documentElement.clientHeight * 0.5;
var canvas;

var paletteFillColor = getComputedStyle( document.body ).getPropertyValue( '--palette-darkest' );
var paletteBackgroundColor = getComputedStyle( document.body ).getPropertyValue( '--background' );

var activeDrawScript;

function windowResized() {
  cWidth = document.documentElement.clientWidth * 0.5;
  cHeight = document.documentElement.clientHeight * 0.5;
  if (cWidth < cHeight)
    cWidth *= 1.5;
  resizeCanvas(cWidth, cHeight);
  ripple.CanvasResized(cWidth, cHeight);
}

function setup() {
  if (cWidth < cHeight)
    cWidth *= 1.5;
  canvas = createCanvas(cWidth, cHeight);
  background( paletteBackgroundColor );
  fill( paletteFillColor );
  noStroke();
}

function draw() {
  if ( !activeDrawScript ) return;
  customDraw();
}

function RefreshActiveDrawScript () {
  canvas.parent("sketch-holder");
  activeDrawScript = document.querySelector("#active-sketch");
}

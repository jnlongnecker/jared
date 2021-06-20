// Helper class to store times to average
class TimerQueue {
  constructor(size) {
    this.maxSize = size;
    this.elements = Array(size);
    this.head = 0;
    this.tail = 0;
  }

  Push(newElement) {
    if (this.IncrementTail() == this.head) {
      this.Pop();
    }
    this.elements[this.tail] = newElement;
    this.tail = this.IncrementTail();
  }

  Pop() {
    if (this.head == this.tail)
      return null;

    let retValue = this.elements[this.head];
    this.head = this.IncrementHead();
    return retValue;
  }

  IncrementTail() {
    return (this.tail + 1) % this.maxSize;
  }

  IncrementHead() {
    return (this.head + 1) % this.maxSize;
  }

  Average() {
    let count = 0;
    let sum = 0;
    for (let value of this.elements) {
      sum += value;
      count++;
    }
    return sum / count;
  }
}

// Variables for the simulation
var circles;
var qTree;

// DOM Customization variables
var numCircles = document.querySelector("#num-circles").value;
document.querySelector("#num-circles-text").value = numCircles;
var capacity = document.querySelector("#qt-capacity").value;
document.querySelector("#qt-capacity-text").value = capacity;
var showVisualization = true;
var executionDisplay = document.querySelector("#time-display");

// The Timer Queue
var tQueue = new TimerQueue(40);

// p5 setup
var paletteFillColor = getComputedStyle(document.body).getPropertyValue("--palette-darkest");
var paletteBackgroundColor = getComputedStyle(document.body).getPropertyValue("--background");
var cWidth = document.documentElement.clientWidth * 0.5;
var cHeight = document.documentElement.clientHeight * 0.5;
var canvas;

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

  // Populate the circle array
  PopulateCircles(numCircles);

  // Add listeners and ensure the visualization is on by default
  document.querySelector("#quadtree-on").checked = true;
  document.querySelector("#num-circles").addEventListener("input", RefreshCircles);
  document.querySelector("#num-circles-text").addEventListener("input", RefreshCircles);
}

// Called by sketch.draw
function customDraw() {

  // Setup colors and customizations for the draw frame
  FillDOMCustomizations();
  background(paletteBackgroundColor);
  noStroke();

  // Begin tracking time performance
  var start = window.performance.now();

  // Build the QuadTree
  qTree = new QuadTree(new Quad(cWidth * 0.5, cHeight * 0.5, cWidth * 0.5, cHeight * 0.5), capacity);
  qTree.Build(circles);

  // Handle circle collision and movement
  HandleCircles();

  // Render the circles
  for (i = 0; i < circles.length; i++) {
    fill(circles[i].ColorActual());
    circle(circles[i].center.x, circles[i].center.y, 2 * circles[i].radius);
  }

  // End time tracking
  var end = window.performance.now();

  // Display the QuadTree, if visualization is turned on
  if (showVisualization) {
    stroke(paletteFillColor);
    qTree.Display();
  }

  // Calculate and display the average execution time
  tQueue.Push(end - start);
  executionDisplay.innerHTML = `Average Execution Time: ${tQueue.Average().toFixed(2)}ms.`;
}

// Handles circle collision and movement
function HandleCircles() {

  // Iterate through the list of circles
  for (i = 0; i < circles.length; i++) {
    let currCircle = circles[i];

    // Determine which circles to check and check collision
    let circlesToCheck = qTree.Query(currCircle.radius + currCircle.velocity.mag(), currCircle.center);
    for (j = 0; j < circlesToCheck.length; j++) {
      if (currCircle === circlesToCheck[j])
        continue;
      if (currCircle.IsColliding(circlesToCheck[j])) {
        currCircle.Bounce(circlesToCheck[j]);
        circlesToCheck[j].Bounce(currCircle);
      }
    }

    // Handle collision on canvas edges
    HandleEdges(circles[i]);

    // Move the circle
    circles[i].Move();
  }
}

// Creates numCircles number of circles
function PopulateCircles(numCircles) {
  circles = [];

  for (i = 0; i < numCircles; i++) {
    circles.push(CreateCircle());
  }

  // Ensure no circles are inside other circles
  internalCircles = true;
  while (internalCircles) {
    internalCircles = false;
    for (i = 0; i < numCircles; i++) {
      for (j = i + 1; j < numCircles; j++) {
        if (circles[i].IsInside(circles[j])) {
          internalCircles = true;
          circles[i].center = createVector(random(31, cWidth - 31), random(31, cHeight - 31));
        }
      }
    }
  }
}

// Sets up a single circle with random attributes
function CreateCircle() {
  newCircle = new Circle();

  // For large circle counts, reduce the size of circles created
  let minRadius = numCircles > 50 ? 3 : 6;
  let maxRadius = numCircles > 50 ? 10 : 30;

  // Fill out circle attributes
  newCircle.radius = random(minRadius, maxRadius);
  newCircle.center = createVector(random(31, cWidth - 31), random(31, cHeight - 31));
  newCircle.velocity = createVector(0, 0);
  newCircle.maxVelocity = random(1, 6);
  newCircle.mass = newCircle.radius;
  newCircle.ApplyForce(createVector(random(-4, 4), random(-4, 4)));

  return newCircle;
}

// Determine if a circle is hitting the edge
function HandleEdges(currCircle) {
  topPoint = createVector(currCircle.center.x, cHeight);
  botPoint = createVector(currCircle.center.x, 0);
  leftPoint = createVector(0, currCircle.center.y);
  rightPoint = createVector(cWidth, currCircle.center.y);

  shouldBounceHorizontal = currCircle.IsCollidingWithPoint(topPoint) || currCircle.IsCollidingWithPoint(botPoint);
  shouldBounceVertical = currCircle.IsCollidingWithPoint(leftPoint) || currCircle.IsCollidingWithPoint(rightPoint);

  if (shouldBounceHorizontal)
    currCircle.BounceHorizontal();

  if (shouldBounceVertical)
    currCircle.BounceVertical();
}

// Fill out variables for user customization
function FillDOMCustomizations() {
  showVisualization = document.querySelector("#quadtree-on").checked;
  let newCapacity = document.querySelector("#qt-capacity");
  let newCapacityText = document.querySelector("#qt-capacity-text");

  // Ensure the input field takes only numbers
  if (isNaN(newCapacityText.value))
    newCapacityText.value = capacity;

  // Link the text and range input fields based off which one was changed
  if (newCapacity.value != capacity) {
    capacity = newCapacity.value;
    newCapacityText.value = newCapacity.value;
  }
  else if (newCapacityText.value != capacity) {
    capacity = newCapacityText.value;
    newCapacity.value = newCapacityText.value;
  }
}

// Refresh the number of circles in the simulation
function RefreshCircles() {
  let newNumCircles = document.querySelector("#num-circles");
  let numCircleText = document.querySelector("#num-circles-text");

  // Ensure only numerical values are in the input field
  if (isNaN(numCircleText.value)) {
    numCircleText.value = numCircles;
    return;
  }

  // Link the text and range input fields based off which one was changed
  if (newNumCircles.value == numCircles)
    newNumCircles.value = numCircleText.value;
  else
    numCircleText.value = newNumCircles.value;

  // Repopulate the simulation with the new value
  numCircles = newNumCircles.value;
  PopulateCircles(numCircles);
}



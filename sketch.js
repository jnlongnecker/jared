var circles;
var cWidth = document.documentElement.clientWidth * 0.5;
var cHeight = document.documentElement.clientHeight * 0.5;
var canvas;

function windowResized() {
  var cWidth = document.documentElement.clientWidth * 0.5;
  var cHeight = document.documentElement.clientHeight * 0.5;
  resizeCanvas(cWidth, cHeight);
}

function setup() {
  var canvas = createCanvas(cWidth, cHeight);
  canvas.parent("sketch-holder");
  background("#f3f4ed");
  fill("#310b0b");
  noStroke();
  PopulateCircles(16);
}

function draw() {
  background("#f3f4ed");
  HandleCircles();
  for (i = 0; i < circles.length; i++) {
    fill(circles[i].ColorActual());
    circle(circles[i].center.x, circles[i].center.y, 2 * circles[i].radius);
  }
}

function HandleCircles() {
  for (i = 0; i < circles.length; i++) {
    for (j = i + 1; j < circles.length; j++) {
      if (circles[i].IsColliding(circles[j])) {
        circles[i].Bounce();
        circles[j].Bounce();
      }
    }
    HandleEdges(circles[i]);
    circles[i].Move();
  }
}

function PopulateCircles(numCircles) {
  circles = [];
  
  for (i = 0; i < numCircles; i++) {
    circles.push(CreateCircle());
  }

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

function CreateCircle() {
  newCircle = new Circle();
  newCircle.radius = random(6, 30);
  newCircle.center = createVector(random(31, cWidth - 31), random(31, cHeight - 31));
  newCircle.velocity = createVector(0, 0);
  newCircle.maxVelocity = random(1, 6);
  newCircle.mass = newCircle.radius;
  newCircle.ApplyForce(createVector(random(-4, 4), random(-4, 4)));

  return newCircle;
}

function HandleEdges(currCircle) {
  topPoint = createVector(currCircle.center.x, cHeight);
  botPoint = createVector(currCircle.center.x, 0);
  leftPoint = createVector(0, currCircle.center.y);
  rightPoint = createVector(cWidth, currCircle.center.y);
  shouldBounce = currCircle.IsCollidingWithPoint(topPoint) || currCircle.IsCollidingWithPoint(botPoint) || 
                  currCircle.IsCollidingWithPoint(leftPoint) || currCircle.IsCollidingWithPoint(rightPoint);
  if (shouldBounce)
    currCircle.Bounce();
}
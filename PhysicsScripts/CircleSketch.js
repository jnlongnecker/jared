var circles;
var cWidth = document.documentElement.clientWidth * 0.5;
var cHeight = document.documentElement.clientHeight * 0.5;
var canvas;
var ripple;
var bubbleSounds;
var audioPlayer;
var numPops;

var confetti;

var paletteFillColor = getComputedStyle( document.body ).getPropertyValue( '--palette-darkest' );
var paletteBackgroundColor = getComputedStyle( document.body ).getPropertyValue( '--background' );

function windowResized() {
  cWidth = document.documentElement.clientWidth * 0.5;
  cHeight = document.documentElement.clientHeight * 0.5;
  if (cWidth < cHeight)
    cWidth *= 1.5;
  resizeCanvas(cWidth, cHeight);
  ripple.CanvasResized(cWidth, cHeight);
}

function SetupAudio() {
  bubbleSounds = [];
  audioPlayer = new Audio();
  for (i = 1; i < 7; i++) {
    let file = "Audio/pop" + i + ".mp3";
    bubbleSounds.push(new Audio(file));
  }
}

function customSetup() {
  numPops = 0;
  PopulateCircles(16);
  SetupAudio();
  ripple = new Ripple();
  RefreshActiveDrawScript();
}

function customDraw() {
  background( paletteBackgroundColor );
  HandleCircles();
  noStroke();
  for (i = 0; i < circles.length; i++) {
    fill(circles[i].ColorActual());
    circle(circles[i].center.x, circles[i].center.y, 2 * circles[i].radius);
  }

  if(ripple.IsAlive()) {
    noFill();
    stroke( paletteFillColor );
    strokeWeight(2.5);
    let cRadius = ripple.GetRadius();
    circle (ripple.x, ripple.y, 2 * cRadius);
    strokeWeight(1);
    circle(ripple.x, ripple.y, cRadius);
  }

  
  if (numPops % 4 == 3) {
    confetti = new Confetti(mouseX, mouseY);
    numPops++;
  }

  if (confetti != null) {
    fill( paletteFillColor );
    stroke( paletteFillColor );
    strokeWeight(1);
    confetti.MoveParticles();
    for (let particle of confetti.confettiList) {
      push();
      translate(particle.x, particle.y);
      rotate(particle.rotationSpeed * frameCount);
      rect(0, 0, particle.width, particle.height);
      pop();
    }
  }
}

function HandleCircles() {
  for (i = 0; i < circles.length; i++) {
    for (j = i + 1; j < circles.length; j++) {
      if (circles[i].IsColliding(circles[j])) {
        circles[i].Bounce(circles[j]);
        circles[j].Bounce(circles[i]);
      }
    }
    if (ripple.Born() && circles[i].IsColliding(ripple.rippleCircle)) {
      numPops++;
      circles[i].RandomizeHitColor();
      circles[i].Bounce(ripple.rippleCircle);
      PlayRandomPop();
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
  shouldBounceHorizontal = currCircle.IsCollidingWithPoint(topPoint) || currCircle.IsCollidingWithPoint(botPoint); 
  shouldBounceVertical = currCircle.IsCollidingWithPoint(leftPoint) || currCircle.IsCollidingWithPoint(rightPoint);
  if (shouldBounceHorizontal)
    currCircle.BounceHorizontal();
  if (shouldBounceVertical)
    currCircle.BounceVertical();
}

function PlayRandomPop() {
  randomChoice = Math.floor(random(0, bubbleSounds.length - 1));
  audioPlayer.src = bubbleSounds[randomChoice].src;
  audioPlayer.play();
}

window.onclick = function() {
  ripple.Reset(mouseX, mouseY);
  if (audioPlayer.src == "")
  {
    audioPlayer.play();
  }
}

window.ontouchend = function() {
  ripple.Reset(mouseX, mouseY);
  if (audioPlayer.src == "")
  {
    audioPlayer.play();
  }
}

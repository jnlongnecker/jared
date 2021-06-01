var cWidth = document.documentElement.clientWidth * 0.5;
var cHeight = document.documentElement.clientHeight * 0.5;

var mainSquare;
var obstacles;
var cursorSquare;

function windowResized() {
  cWidth = document.documentElement.clientWidth * 0.5;
  cHeight = document.documentElement.clientHeight * 0.5;
  if (cWidth < cHeight)
    cWidth *= 1.5;
  resizeCanvas(cWidth, cHeight);
}

function setup() {
  if (cWidth < cHeight)
    cWidth *= 1.5;
  var canvas = createCanvas(cWidth, cHeight);
  canvas.parent("sketch-holder");
  background("#f3f4ed");
  fill("#310b0b");
  noStroke();

  cursorSquare = new Square();
  cursorSquare.SquareSetup(0, 0, 1, 1);
  mainSquare = new Square();
  CreateObstacles();
  console.log(obstacles.length);
}

function draw() {
    background("#f3f4ed");
    fill(cursorSquare.sqColor);
    cursorSquare.x = mouseX;
    cursorSquare.y = mouseY;
    rect(cursorSquare.x, cursorSquare.y, cursorSquare.width, cursorSquare.height);

    fill(mainSquare.sqColor);
    mainSquare.Move();
    HandleCollision();
    rect(mainSquare.x, mainSquare.y, mainSquare.width, mainSquare.height);

    fill("#e2703a");
    DrawObstacles();
}


function CreateObstacles() {
    obstacles = [];

    obstacles.push(cursorSquare);
    obstacles.push(new Square());
    obstacles[1].SquareSetup(0, cHeight - 10, cWidth, 10);
}

function HandleCollision() {
    for (ob of obstacles) {
        if (mainSquare.CollidingWith(ob)) {
            mainSquare.Bounce();
        }
    }
}

function DrawObstacles() {
    for (ob of obstacles) {
        rect(ob.x, ob.y, ob.width, ob.height);
    }
}
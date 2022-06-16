let p5;

/*
    Classes for the algorithm to work. Since I used a reference to P5 for this, I had to
    contain them all in the same script file to access the reference that gets set by
    the closure
*/
class ConfettiParticle {
    velocity;
    x;
    y;
    width;
    height;
    rotationSpeed;
    initialHeading;

    constructor(x, y) {
        let xVal = p5.random(-1, 1);
        this.velocity = p5.createVector(xVal, p5.random(-1.5, -p5.abs(xVal)));
        this.x = x;
        this.y = y;
        this.width = p5.random(1, 3);
        this.height = p5.random(1, 3);
        this.rotationSpeed = p5.random(p5.PI * 0.01, p5.PI * 0.1);
    }

    Move() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += .025;
    }
}

class Confetti {
    confettiList;
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.confettiList = [];
        for (let i = 0; i < 50; i++) {
            this.confettiList.push(new ConfettiParticle(x, y));
        }
    }

    MoveParticles() {
        for (let particle of this.confettiList) {
            particle.Move();
        }
    }
}

class Ripple {
    x;
    y;
    maxRadius;

    lifespan;
    framesAlive;
    rippleCircle;

    canvasHeight = document.documentElement.clientHeight * 0.5;
    canvasWidth = document.documentElement.clientWidth * 0.5;

    constructor() {
        this.lifespan = 30;
        this.framesAlive = 91;
        this.maxRadius = 25;
        this.rippleCircle = new Circle();
        this.rippleCircle.center = p5.createVector(this.x, this.y);
        this.rippleCircle.velocity = this.rippleCircle.center;
        this.rippleCircle.radius = 10;
    }

    Reset(x, y) {
        this.framesAlive = 0;
        this.rippleCircle.center = p5.createVector(x, y);
        this.SetVelocity();
        this.x = x;
        this.y = y;
    }

    CanvasResized(newWidth, newHeight) {
        this.canvasWidth = newWidth;
        this.canvasHeight = newHeight;
    }

    GetRadius() {
        let radius = p5.lerp(0, this.maxRadius, (this.framesAlive / this.lifespan));
        this.framesAlive++;
        return radius;
    }

    IsAlive() {
        return this.lifespan >= this.framesAlive;
    }

    Born() {
        return this.framesAlive === 0;
    }

    SetVelocity() {
        let vel = p5.createVector(this.rippleCircle.center);
        if (vel.x > this.canvasWidth * 0.5) {
            vel.x -= this.canvasWidth;
        }
        if (vel.y > this.canvasHeight * 0.5) {
            vel.y -= this.canvasHeight;
        }

        this.rippleCircle.velocity = vel;
    }
}

class Circle {

    radius;
    center;
    velocity;
    maxVelocity;
    mass;
    baseColor;
    hitColor;
    startColor;
    startHitColor;

    lerpAmount = 0;

    constructor() {
        this.startColor = p5.color(getComputedStyle(document.body).getPropertyValue('--palette-darkest'));
        this.startHitColor = p5.color(getComputedStyle(document.body).getPropertyValue('--palette-lightest'));
        this.baseColor = this.startColor;
        this.hitColor = this.startHitColor;
    }

    Bounce(collidingCircle) {
        this.lerpAmount = 1.05;

        //If the circle is hit from behind, average the current heading and heading of collision
        if (this.HitFromBehind(collidingCircle)) {
            let center = this.center.copy();
            let collisionVector = center.sub(collidingCircle.center);
            let collisionHeading = collisionVector.heading();
            let newHeading = (this.velocity.heading() + collisionHeading) * 0.5;
            this.velocity.setHeading(newHeading);
            return;
        }

        let center = collidingCircle.center.copy();

        //If not, reflect from the point of contact
        let normal = center.sub(this.center);
        this.velocity.reflect(normal);
    }

    BounceHorizontal() {
        let normal = p5.createVector(0, 1);
        this.velocity.reflect(normal);
        this.lerpAmount = 1.05;
    }

    BounceVertical() {
        let normal = p5.createVector(1, 0);
        this.velocity.reflect(normal);
        this.lerpAmount = 1.05;
    }

    HitFromBehind(collidingCircle) {
        let center = this.center.copy();
        let collisionVector = center.sub(collidingCircle.center);
        let collisionHeading = collisionVector.heading();
        let travelHeading = this.velocity.heading();

        return p5.abs(collisionHeading - travelHeading) < p5.HALF_PI;
    }

    IsColliding(otherCircle) {
        let distance = this.center.dist(otherCircle.center);
        return distance <= this.radius + otherCircle.radius;
    }

    IsCollidingWithPoint(point) {
        let distance = this.center.dist(point);
        return distance <= this.radius;
    }

    IsInside(otherCircle) {
        let distance = this.center.dist(otherCircle.center);
        return distance + 2 <= this.radius + otherCircle.radius;
    }

    Move() {
        this.center = this.center.add(this.velocity);
    }

    ApplyForce(force) {
        force = force.div(this.mass);
        this.velocity = this.velocity.add(force);
        if (this.velocity.mag() > this.maxVelocity) {
            this.velocity = this.velocity.normalize();
            this.velocity = this.velocity.mult(this.maxVelocity);
        }

    }

    Force() {
        let acc = this.velocity;
        return p5.Vector.mult(acc, this.mass);
    }

    ColorActual() {
        this.lerpAmount -= 0.01;
        if (this.lerpAmount <= 0)
            this.hitColor = this.startHitColor;
        return p5.lerpColor(this.baseColor, this.hitColor, this.lerpAmount);
    }

    RandomizeHitColor() {
        let colorVals = [];
        colorVals.push(p5.random(0, 255));
        colorVals.push(p5.random(0, 255));
        colorVals.push(p5.random(0, 255));
        colorVals.push(255);
        this.hitColor = p5.color(colorVals);
    }

}

export const circle = sketch => {
    p5 = sketch;

    // Simulation variables
    var circles;
    var ripple;
    var confetti;
    var numPops;

    // Audio controls
    var bubbleSounds;
    var audioPlayer;

    // Canvas variables
    var cWidth = document.documentElement.clientWidth * 0.6;
    var cHeight = document.documentElement.clientHeight * 0.65;
    var paletteFillColor = getComputedStyle(document.body).getPropertyValue('--palette-darkest');
    var paletteBackgroundColor = getComputedStyle(document.body).getPropertyValue('--background');

    /*
     *  Resize the canvas when the window is resized.
     *  @returntype: undefined
     */
    sketch.windowResized = () => {
        cWidth = document.documentElement.clientWidth * 0.6;
        cHeight = document.documentElement.clientHeight * 0.65;
        if (document.documentElement.clientWidth <= 900) {
            cWidth = document.documentElement.clientWidth * 0.8;
        }
        p5.resizeCanvas(cWidth, cHeight);
        ripple.CanvasResized(cWidth, cHeight);
    }

    /*
     *  Gather audio information for interactivity.
     *  @returntype: undefined
     */
    function SetupAudio() {
        bubbleSounds = [];
        audioPlayer = new Audio();
        for (let i = 1; i < 7; i++) {
            let file = "../audio/pop" + i + ".mp3";
            bubbleSounds.push(new Audio(file));
        }
    }

    /*
     *  Setup the simulation.
     *  @returntype: undefined
     */
    sketch.setup = () => {
        numPops = 0;
        PopulateCircles(16);
        SetupAudio();
        ripple = new Ripple();
        if (document.documentElement.clientWidth <= 900) {
            cWidth = document.documentElement.clientWidth * 0.8;
        }
        p5.createCanvas(cWidth, cHeight);
    }

    /*
     *  Redraw the canvas content frame.
     *  @returntype: undefined
     */
    sketch.draw = () => {
        p5.background(paletteBackgroundColor);
        HandleCircles();
        p5.noStroke();
        for (let i = 0; i < circles.length; i++) {
            p5.fill(circles[i].ColorActual());
            p5.circle(circles[i].center.x, circles[i].center.y, 2 * circles[i].radius);
        }

        if (ripple.IsAlive()) {
            p5.noFill();
            p5.stroke(paletteFillColor);
            p5.strokeWeight(2.5);
            let cRadius = ripple.GetRadius();
            p5.circle(ripple.x, ripple.y, 2 * cRadius);
            p5.strokeWeight(1);
            p5.circle(ripple.x, ripple.y, cRadius);
        }


        if (numPops % 4 == 3) {
            confetti = new Confetti(p5.mouseX, p5.mouseY);
            numPops++;
        }

        if (confetti != null) {
            p5.fill(paletteFillColor);
            p5.stroke(paletteFillColor);
            p5.strokeWeight(1);
            confetti.MoveParticles();
            for (let particle of confetti.confettiList) {
                p5.push();
                p5.translate(particle.x, particle.y);
                p5.rotate(particle.rotationSpeed * p5.frameCount);
                p5.rect(0, 0, particle.width, particle.height);
                p5.pop();
            }
        }
    }

    /*
     *  Handle circle collision and movement.
     *  @returntype: undefined
     */
    function HandleCircles() {
        for (let i = 0; i < circles.length; i++) {
            for (let j = i + 1; j < circles.length; j++) {
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

    /*
     *  Reset the circle list to a new list of the desired number of circles.
     *  @returntype: undefined
     */
    function PopulateCircles(numCircles) {
        circles = [];

        for (let i = 0; i < numCircles; i++) {
            circles.push(CreateCircle());
        }

        let internalCircles = true;
        while (internalCircles) {
            internalCircles = false;
            for (let i = 0; i < numCircles; i++) {
                for (let j = i + 1; j < numCircles; j++) {
                    if (circles[i].IsInside(circles[j])) {
                        internalCircles = true;
                        circles[i].center = p5.createVector(p5.random(31, cWidth - 31), p5.random(31, cHeight - 31));
                    }
                }
            }
        }
    }

    /*
     *  Builds an individual, randomized circle.
     *  @returntype: Circle (object)
     */
    function CreateCircle() {
        let newCircle = new Circle();
        newCircle.radius = p5.random(6, 30);
        newCircle.center = p5.createVector(p5.random(31, cWidth - 31), p5.random(31, cHeight - 31));
        newCircle.velocity = p5.createVector(0, 0);
        newCircle.maxVelocity = p5.random(1, 6);
        newCircle.mass = newCircle.radius;
        newCircle.ApplyForce(p5.createVector(p5.random(-4, 4), p5.random(-4, 4)));

        return newCircle;
    }

    /*
     *  Calculate collision along the edge of the canvas for the input circle.
     *  @returntype: undefined
     */
    function HandleEdges(currCircle) {
        let topPoint = p5.createVector(currCircle.center.x, cHeight);
        let botPoint = p5.createVector(currCircle.center.x, 0);
        let leftPoint = p5.createVector(0, currCircle.center.y);
        let rightPoint = p5.createVector(cWidth, currCircle.center.y);
        let shouldBounceHorizontal = currCircle.IsCollidingWithPoint(topPoint) || currCircle.IsCollidingWithPoint(botPoint);
        let shouldBounceVertical = currCircle.IsCollidingWithPoint(leftPoint) || currCircle.IsCollidingWithPoint(rightPoint);
        if (shouldBounceHorizontal)
            currCircle.BounceHorizontal();
        if (shouldBounceVertical)
            currCircle.BounceVertical();
    }

    /*
     *  Selects a random loaded sound and plays it.
     *  @returntype: undefined
     */
    function PlayRandomPop() {
        let randomChoice = Math.floor(p5.random(0, bubbleSounds.length - 1));
        audioPlayer.src = bubbleSounds[randomChoice].src;
        audioPlayer.play();
    }

    /*
     *  Move the ripple to the cursor on click.
     *  @returntype: undefined
     */
    window.onclick = () => {
        ripple.Reset(p5.mouseX, p5.mouseY);
        if (audioPlayer.src == "") {
            audioPlayer.play();
        }
    }

    /*
     *  Move the ripple to the touch point.
     *  @returntype: undefined
     */
    window.ontouchend = () => {
        ripple.Reset(p5.mouseX, p5.mouseY);
        if (audioPlayer.src == "") {
            audioPlayer.play();
        }
    }

};
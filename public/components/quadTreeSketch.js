import { createElementWithText } from "../scripts/util.js";
let p5;

/*
    Classes for the algorithm to work. Since I used a reference to P5 for this, I had to
    contain them all in the same script file to access the reference that gets set by
    the closure
*/
class Quad {
    constructor(width, height, x, y) {
        this.width = Math.floor(width);
        this.height = Math.floor(height);
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }

    Contains(point) {
        let withinX = point.x >= this.x - this.width && point.x < this.x + this.width;
        let withinY = point.y >= this.y - this.height && point.y < this.y + this.height;

        return withinX && withinY;
    }

    Intersects(object) {
        let outsideX = object.x - object.width > this.x + this.width || object.x + object.width > this.x - this.width;
        let outsideY = object.y - object.height > this.y + this.height || object.y + object.height > this.y - this.height;

        return !(outsideX || outsideY);
    }

    IntersectsCircle(circle) {
        let myCenter = p5.createVector(this.x, this.y);
        let circleCenter = p5.createVector(circle.center.x, circle.center.y);

        let distanceVector = myCenter.sub(circleCenter);
        let distance = myCenter.dist(circleCenter);
        distanceVector = distanceVector.normalize().mult(Math.min(distance, circle.radius));
        let targetPoint = circleCenter.add(distanceVector);

        return this.Contains(targetPoint);
    }
}

class QuadTree {

    constructor(quad, capacity) {
        this.quad = quad;
        this.capacity = capacity;
        this.data = [];
        this.topLeft = this.topRight = this.botLeft = this.botRight = null;
    }

    Build(dataList) {
        for (let newData of dataList) {
            this.Insert(newData);
        }
    }

    Insert(newData) {
        if (!this.quad.Contains(newData.center))
            return;

        if (this.data.length < this.capacity) {
            this.data.push(newData);
            return;
        }

        if (this.topLeft === null) {
            this.Subdivide();
        }

        this.topLeft.Insert(newData);
        this.topRight.Insert(newData);
        this.botLeft.Insert(newData);
        this.botRight.Insert(newData);
    }

    Subdivide() {
        let subWidth = this.quad.width * 0.5;
        let subHeight = this.quad.height * 0.5;

        let tl = new Quad(subWidth, subHeight, this.quad.x - subWidth, this.quad.y - subHeight);
        let tr = new Quad(subWidth + 1, subHeight, this.quad.x + subWidth, this.quad.y - subHeight);
        let bl = new Quad(subWidth, subHeight + 1, this.quad.x - subWidth, this.quad.y + subHeight);
        let br = new Quad(subWidth + 1, subHeight + 1, this.quad.x + subWidth, this.quad.y + subHeight);

        this.topLeft = new QuadTree(tl, this.capacity);
        this.topRight = new QuadTree(tr, this.capacity);
        this.botLeft = new QuadTree(bl, this.capacity);
        this.botRight = new QuadTree(br, this.capacity);

        for (let someData of this.data) {
            this.topLeft.Insert(someData);
            this.topRight.Insert(someData);
            this.botLeft.Insert(someData);
            this.botRight.Insert(someData);
        }
        this.data = [];
        this.capacity = 0;
    }

    Query(distance, center) {
        let bounds = new Circle();
        bounds.radius = distance;
        bounds.center = center;

        return this.RetrievePointsIn(bounds);
    }

    RetrievePointsIn(bounds, retData) {
        if (!retData)
            retData = [];

        if (!this.quad.IntersectsCircle(bounds))
            return retData;

        if (this.topLeft === null) {
            for (let someData of this.data) {
                if (bounds.IsColliding(someData))
                    retData.push(someData);
            }
            return retData;
        }

        this.topLeft.RetrievePointsIn(bounds, retData);
        this.topRight.RetrievePointsIn(bounds, retData);
        this.botLeft.RetrievePointsIn(bounds, retData);
        this.botRight.RetrievePointsIn(bounds, retData);

        return retData;
    }

    Display() {
        p5.strokeWeight(1);
        p5.noFill();
        p5.rectMode(p5.CENTER);
        p5.rect(this.quad.x, this.quad.y, this.quad.width * 2, this.quad.height * 2);

        if (this.topLeft !== null) {
            this.topLeft.Display();
            this.topRight.Display();
            this.botLeft.Display();
            this.botRight.Display();
        }
    }
}

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
        this.startColor = p5.color(getComputedStyle(document.body).getPropertyValue('--palette-primary'));
        this.startHitColor = p5.color(getComputedStyle(document.body).getPropertyValue('--palette-secondary'));
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

export const quadTree = sketch => {
    p5 = sketch;

    // User configurable options 
    let qtCapacity;
    let showVisualization;
    let numCircles;
    let timer;

    // Data structures for the Quad Tree and time reporting
    let qTree;
    let tQueue = new TimerQueue(40);

    // Misc settings and tracking
    let circleList;
    let cWidth = document.documentElement.clientWidth * 0.6;
    let cHeight = document.documentElement.clientHeight * 0.65;
    let paletteFillColor = getComputedStyle(document.body).getPropertyValue('--palette-primary');
    let paletteBackgroundColor = p5.color('hsl(0,0%,12%)');

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
        PopulateCircles(numCircles.value);
    }

    /*
     *  Setup the simulation.
     *  @returntype: undefined
     */
    sketch.setup = () => {
        PopulateTools();
        PopulateCircles(numCircles.value);
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
        p5.noStroke();

        // Begin tracking time performance
        var start = window.performance.now();

        // Build the QuadTree
        qTree = new QuadTree(new Quad(cWidth * 0.5, cHeight * 0.5, cWidth * 0.5, cHeight * 0.5), qtCapacity.value);
        qTree.Build(circleList);

        // Handle circle collision and movement
        HandleCircles();

        // End time tracking
        var end = window.performance.now();

        // Display the QuadTree, if visualization is turned on
        if (showVisualization.checked) {
            p5.stroke(p5.color("hsl(0,0%,20%)"));
            qTree.Display();
        }

        // Render the circles
        for (let i = 0; i < circleList.length; i++) {
            p5.fill(circleList[i].ColorActual());
            p5.circle(circleList[i].center.x, circleList[i].center.y, 2 * circleList[i].radius);
        }

        tQueue.Push(end - start);
        timer.innerHTML = `${tQueue.Average().toFixed(2)}ms`;
    }

    /*
     *  Handle circle collision and movement.
     *  @returntype: undefined
     */
    function HandleCircles() {
        // Iterate through the list of circles
        for (let i = 0; i < circleList.length; i++) {
            let currCircle = circleList[i];

            // Determine which circles to check and check collision
            let distance = currCircle.radius + currCircle.velocity.mag();
            let circlesToCheck = qTree.Query(distance, currCircle.center);
            for (let j = 0; j < circlesToCheck.length; j++) {
                if (currCircle === circlesToCheck[j])
                    continue;
                if (currCircle.IsColliding(circlesToCheck[j])) {
                    currCircle.Bounce(circlesToCheck[j]);
                    circlesToCheck[j].Bounce(currCircle);
                }
            }

            // Handle collision on canvas edges
            HandleEdges(circleList[i]);

            // Move the circle
            currCircle.Move();
        }
    }

    /*
     *  Reset the circle list to a new list of the desired number of circles.
     *  @returntype: undefined
     */
    function PopulateCircles(numCircles) {
        circleList = [];

        for (let i = 0; i < numCircles; i++) {
            circleList.push(CreateCircle());
        }

        let internalCircles = true;
        while (internalCircles) {
            internalCircles = false;
            for (let i = 0; i < numCircles; i++) {
                for (let j = i + 1; j < numCircles; j++) {
                    if (circleList[i].IsInside(circleList[j])) {
                        internalCircles = true;
                        circleList[i].center = p5.createVector(p5.random(31, cWidth - 31), p5.random(31, cHeight - 31));
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

        // Reduce the size of circles for large quantities of circles
        let minRadius = numCircles.value > 75 ? 3 : 6;
        let maxRadius = numCircles.value > 75 ? 10 : 30;

        newCircle.radius = p5.random(minRadius, maxRadius);
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
     *  Handler for the onchange event for the Circles slider to refresh the new number of desired circles.
     *  @returntype: undefined
     */
    function UpdateSettings() {
        PopulateCircles(numCircles.value);
    }

    /*
     *  Populate the toolbar with options and store those setting references.
     *  @returntype: undefined
     */
    function PopulateTools() {

        // Retrieve a reference to the toolbar
        let toolbar = document.querySelector("jwork-toolbar");

        // Create the div to hold the toolbar content to be slotted in
        let slotDiv = document.createElement("div");
        slotDiv.setAttribute("slot", "content");

        // Create the div to hold the slider controls
        let containerDiv = document.createElement("div");
        containerDiv.classList.add("controls");

        // Create the first slider control div
        let controlDiv1 = document.createElement("div");
        controlDiv1.classList.add("control-col");

        // Create the slider control details
        let cap = createElementWithText("span", "Capacity");
        let slider1 = document.createElement("input");
        slider1.setAttribute("orient", "vertical");
        slider1.setAttribute("type", "range");
        slider1.setAttribute("min", "2");
        slider1.setAttribute("max", "10");
        slider1.classList.add("slider-vert");

        // Capacity of the quadtree retrieved from slider1
        qtCapacity = slider1;

        // Add slider control details to the first slider control div
        controlDiv1.appendChild(cap);
        controlDiv1.appendChild(slider1);

        // Create the second slider control div
        let controlDiv2 = document.createElement("div");
        controlDiv2.classList.add("control-col");

        // Create the second slider control details
        let circles = createElementWithText("span", "Circles");
        let slider2 = document.createElement("input");
        slider2.setAttribute("orient", "vertical");
        slider2.setAttribute("type", "range");
        slider2.setAttribute("min", "5");
        slider2.setAttribute("max", "200");
        slider2.classList.add("slider-vert");
        slider2.addEventListener("change", UpdateSettings);

        // Number of circles in the simulation retrieved from slider2
        numCircles = slider2;

        // Add second slider control details to the second slider control div
        controlDiv2.appendChild(circles);
        controlDiv2.appendChild(slider2);

        // Create the miscellaneous controls
        let vis = createElementWithText("span", "Show Visualization");
        let br = document.createElement("br");
        let chk = document.createElement("input");
        chk.setAttribute("type", "checkbox");
        let timerText = createElementWithText("p", "Average Execution Time:");
        let time = createElementWithText("p", "Time");

        // Visualization display controlled by chk, execution time displayed by time
        showVisualization = chk;
        timer = time;

        // Add div details
        containerDiv.appendChild(controlDiv1);
        containerDiv.appendChild(controlDiv2);
        slotDiv.appendChild(containerDiv);
        slotDiv.appendChild(vis);
        slotDiv.appendChild(br);
        slotDiv.appendChild(chk);
        slotDiv.appendChild(timerText);
        slotDiv.appendChild(time);

        // Slot in the toolbar controls
        toolbar.appendChild(slotDiv);
    }
};
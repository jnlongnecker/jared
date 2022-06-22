import JworkIconButton from "./jwork-icon-button.js";
import { createElementWithText } from "../scripts/util.js";
let p5;

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

        let distanceVector = myCenter.copy().sub(circleCenter);
        distanceVector.limit(Math.min(circle.radius, myCenter.dist(circleCenter)));
        let targetPoint = circleCenter.add(distanceVector);

        return this.Contains(targetPoint);
    }
}

class Circle {
    radius;
    center;
    data;

    constructor() {
        this.radius = 0;
        this.center = 0;
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

}

class Obstacle {

    center;
    radius;
    raisePerc;
    modifier;

    constructor(center, radius) {
        this.radius = radius;
        this.center = center.copy();
        this.raisePerc = 0;
        this.modifier = 0.01;
    }

    render() {
        let shake = p5.createVector();
        if (this.raisePerc < 1) {
            shake.x = p5.random(-2, 2);
            shake.y = p5.random(-2, 2);
        }
        else if (this.modifier > 0) {
            this.modifier = 0;
        }

        let stroke = p5.color(120, 120, 120, 255 * this.raisePerc);
        let fill = p5.color(120, 120, 120, 180 * this.raisePerc);
        p5.stroke(stroke);
        p5.fill(fill);
        p5.circle(this.center.x + shake.x, this.center.y + shake.y, this.radius * 2);

        this.raisePerc += this.modifier;
    }

    die() {
        this.modifier = -0.01;
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

    Query(distance, data) {
        let bounds = new Circle();
        bounds.radius = distance;
        bounds.center = data.center.copy();
        bounds.data = data;

        return this.RetrievePointsIn(bounds);
    }

    RetrievePointsIn(bounds, retData) {
        if (!retData)
            retData = [];

        if (!this.quad.IntersectsCircle(bounds)) {
            return retData;
        }

        if (this.topLeft === null) {
            for (let data of this.data) {
                retData.push(data);
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

// todo - Mobile touch controls, boids smaller on mobile, boids slower on mobile
class Boid {

    flockId;
    center;
    velocity;
    acceleration;
    color;
    size;
    visionRadius;
    visionAngle;
    bubble;
    turnSpeed;
    maxSpeed;
    preferredSpeed;

    constructor(
        flockId, center, velocity, acceleration, color, visionRadius, visionAngle,
        coStrength, alignStrength, sepStrength, size = 6) {

        this.flockId = flockId;
        this.center = center;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.color = color;
        this.visionRadius = visionRadius;
        this.visionAngle = visionAngle;
        this.bubble = 20;
        this.coStrength = coStrength;
        this.alignStrength = alignStrength;
        this.sepStrength = sepStrength;

        this.maxSpeed = 7;
        this.preferredSpeed = 4;
        this.size = size;
        if (document.documentElement.clientWidth < 900) {
            this.maxSpeed = 3;
            this.preferredSpeed = 2;
            this.size = size * 0.8;
        }
    }

    move() {
        this.center.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);

        if (this.velocity.mag() < this.preferredSpeed) {
            this.velocity.setMag(this.velocity.mag() + 0.5);
        }
        else {
            this.velocity.setMag(this.velocity.mag() - 0.001);
        }
    }

    contain(width, height) {
        let margin = 50;
        let wallFear = 1 * (this.maxSpeed / 7);
        let newAcceleration = p5.createVector();

        if (this.center.x < margin) {
            newAcceleration.x += wallFear;
        }
        if (this.center.x > width - margin) {
            newAcceleration.x -= wallFear;
        }
        if (this.center.y < margin) {
            newAcceleration.y += wallFear;
        }
        if (this.center.y > height - margin) {
            newAcceleration.y -= wallFear;
        }

        return newAcceleration;
    }

    avoidObstacles(obstacleList, acceleration) {
        let obstacleFear = 0.1 * (this.maxSpeed / 7);
        let margin = -(this.visionRadius.value * 0.3);

        for (let obstacle of obstacleList) {
            if (obstacle.raisePerc < 0.5) continue;
            let effRad = obstacle.radius + margin;
            let dist = this.center.dist(obstacle.center);
            if (dist - effRad > this.visionRadius.value) continue;

            let vectorToObject = this.center.copy().sub(obstacle.center);

            let turnClockwise = this.velocity.angleBetween(vectorToObject) > 0 ? 1 : -1;
            let vec = vectorToObject.copy().rotate(-90 * turnClockwise).mult(obstacleFear);
            acceleration.add(vec);
        }
    }

    steer(nearbyBoids, acceleration) {
        let spacing = p5.createVector();
        let cohesion = p5.createVector();
        let alignment = p5.createVector();
        let numBoids = 0;

        for (let boid of nearbyBoids) {
            if (this.center.dist(boid.center) > this.visionRadius.value) continue;

            let spaceVector = this.center.copy().sub(boid.center);
            let spacingAdd = p5.createVector();

            if (this.center.dist(boid.center) < this.size * 2 && boid != this) {
                spacingAdd = spaceVector.copy();
            }

            if (Math.abs(spaceVector.heading() - this.velocity.heading()) > this.visionAngle.value * 0.5) continue;

            if (this.center.dist(boid.center) < this.bubble && boid != this) {
                spacingAdd = spaceVector.copy();
            }

            spacing.add(spacingAdd);

            if (boid.flockId != this.flockId) continue;
            alignment.add(boid.velocity.copy());
            cohesion.add(boid.center.copy());

            numBoids++;
        }
        if (numBoids != 0) {
            alignment.div(numBoids);
            cohesion.div(numBoids);

            cohesion.sub(this.center);
            alignment.sub(this.velocity);
        }
        acceleration.add(cohesion.mult(.005 * this.coStrength.value));
        acceleration.add(spacing.mult(.05 * this.sepStrength.value));
        alignment.sub(acceleration);
        acceleration.add(alignment.mult(.05 * this.alignStrength.value));

        return acceleration;
    }

    turn(nearbyBoids, obstacleList, width, height) {
        let newAcceleration = this.contain(width, height);
        this.steer(nearbyBoids, newAcceleration);
        this.avoidObstacles(obstacleList, newAcceleration);
        this.acceleration = newAcceleration;
    }

    render() {
        p5.stroke(this.color);
        p5.strokeWeight(1);
        let fillCol = p5.color(this.color);
        fillCol.setAlpha(50);
        p5.fill(fillCol);
        p5.push();
        p5.translate(this.center.x, this.center.y);
        p5.rotate(this.velocity.heading());
        p5.triangle(0, this.size / 2, 0, -this.size / 2, this.size * 2, 0);
        p5.pop();
    }
}

export const boids = (sketch) => {

    p5 = sketch;

    // Sketch variables
    let qTree;
    let boidList;
    let obstacleList;
    let visionRadius;
    let visionAngle;
    let cohesion;
    let separation;
    let alignment;
    let selectedBoid;

    // Control variables
    let toolbar;
    let playButton;
    let downloadButton;

    // Canvas variables
    let canvas;
    let cWidth = document.documentElement.clientWidth * 0.8;
    let cHeight = document.documentElement.clientHeight * 0.8;
    let palettePrimary = getComputedStyle(document.body).getPropertyValue('--palette-primary');
    let paletteSecondary = getComputedStyle(document.body).getPropertyValue('--palette-secondary');
    let paletteBackgroundColor = p5.color('hsl(0,0%,12%)');

    sketch.windowResized = () => {
        cWidth = document.documentElement.clientWidth * 0.8;
        cHeight = document.documentElement.clientHeight * 0.8;
        p5.resizeCanvas(cWidth, cHeight);
    }

    sketch.setup = () => {
        canvas = p5.createCanvas(cWidth, cHeight);

        p5.angleMode(p5.DEGREES);
        PopulateToolbar();

        boidList = [];
        obstacleList = [];
        CreateObstacle(p5.createVector(cWidth * 0.5, cHeight * 0.5));

        let totalBoids = Math.max(cWidth, cHeight) * .2;
        PopulateBoids(totalBoids * 0.5, palettePrimary);
        PopulateBoids(totalBoids * 0.5, paletteSecondary);

        p5.touchStarted = mouseClicked;
    }

    sketch.draw = () => {

        p5.background(paletteBackgroundColor);

        qTree = new QuadTree(new Quad(cWidth * 0.5, cHeight * 0.5, cWidth * 0.5, cHeight * 0.5), 35);
        qTree.Build(boidList);
        HandleBoids();
        RenderObstacles();

        if (selectedBoid) {
            RenderSelectedBoid();
        }
    }

    function HandleBoids() {
        for (let boid of boidList) {
            if (playButton.getAttribute("icon") != "play") {
                let nearbyBoids = qTree.Query(visionRadius.value, boid);
                boid.turn(nearbyBoids, obstacleList, cWidth, cHeight);
                boid.move();
            }
            boid.render();
        }
    }


    function mouseClicked() {
        let ob = ObstacleAtMouse();
        let mousePos = p5.createVector(p5.mouseX, p5.mouseY);
        if (MouseOutsideCanvas() || toolbar.getAttribute("settings-on")) return;

        if (selectedBoid) {
            selectedBoid = null;
            return;
        }
        if (playButton.getAttribute("icon") == "play") {
            for (let boid of boidList) {
                if (mousePos.dist(boid.center) < boid.size * 2) {
                    if (selectedBoid == null || mousePos.dist(selectedBoid.center) > mousePos.dist(boid.center)) {
                        selectedBoid = boid;
                    }
                }
            }
        }
        else if (ob) {
            ob.die();
        }
        else {
            CreateObstacle(p5.createVector(p5.mouseX, p5.mouseY));
        }
    }

    function MouseOutsideCanvas() {
        return p5.mouseX < 0 || p5.mouseX > cWidth || p5.mouseY < 0 || p5.mouseY > cHeight;
    }

    function RemoveObstacle(obstacle) {
        let newObList = [];
        for (let ob of obstacleList) {
            if (ob !== obstacle) newObList.push(ob);
        }
        obstacleList = newObList;
    }

    function ObstacleAtMouse() {
        let mousePos = p5.createVector(p5.mouseX, p5.mouseY);
        for (let obstacle of obstacleList) {
            if (mousePos.dist(obstacle.center) < obstacle.radius) return obstacle;
        }
        return null;
    }

    function RenderObstacles() {
        for (let obstacle of obstacleList) {
            obstacle.render();
            if (obstacle.raisePerc <= 0) RemoveObstacle(obstacle);
        }
    }

    function RenderSelectedBoid() {
        p5.background(p5.color('rgba(12,12,12,.6)'));
        selectedBoid.render();
    }

    function CreateObstacle(location) {
        obstacleList.push(new Obstacle(location, 10 * Math.random() + 20));
    }

    function PopulateBoids(numBoids, color) {
        let flockId = Math.random();

        for (let i = 0; i < numBoids; i++) {
            let randomCenter = p5.createVector(Math.random() * cWidth, Math.random() * cHeight);
            let sign1 = Math.random() > 0.5 ? 1 : -1;
            let sign2 = Math.random() > 0.5 ? 1 : -1;
            let startingVelocity = p5.createVector(sign1 * (Math.random() * 4 + 1), sign2 * (Math.random() * 4 + 1));
            let startingAcceleration = p5.createVector(0, 0);
            let newBoid = new Boid(flockId, randomCenter, startingVelocity, startingAcceleration, color, visionRadius,
                visionAngle, cohesion, alignment, separation);
            boidList.push(newBoid);
        }
    }

    function PopulateToolbar() {
        toolbar = document.querySelector("jwork-toolbar");

        playButton = document.createElement("jwork-icon-button", { is: JworkIconButton });
        playButton.setAttribute("icon", "pause");
        playButton.onclick = () => { playButton.togglePlay() };

        downloadButton = document.createElement("jwork-icon-button", { is: JworkIconButton });
        downloadButton.setAttribute("icon", "download");
        downloadButton.onclick = () => { Download(); };

        let holder = document.createElement("div");
        holder.setAttribute("slot", "controls");
        let boidSliders = document.createElement("div");
        boidSliders.setAttribute("class", "controls");
        let sliderCol1 = document.createElement("div");
        sliderCol1.setAttribute("class", "control-col");
        let sliderCol2 = document.createElement("div");
        sliderCol2.setAttribute("class", "control-col");
        let sliderCol3 = document.createElement("div");
        sliderCol3.setAttribute("class", "control-col");

        boidSliders.appendChild(sliderCol1);
        boidSliders.appendChild(sliderCol2);
        boidSliders.appendChild(sliderCol3);
        holder.appendChild(boidSliders);

        let cohesionLabel = createElementWithText("label", "Cohesion");
        cohesion = document.createElement("input");
        cohesion.setAttribute("class", "slider-vert");
        cohesion.setAttribute("type", "range");
        cohesion.setAttribute("step", "0.1");
        cohesion.setAttribute("min", "0.1");
        cohesion.setAttribute("max", "5");
        cohesion.value = 1;

        let alignmentLabel = createElementWithText("label", "Alignment");
        alignment = document.createElement("input");
        alignment.setAttribute("class", "slider-vert");
        alignment.setAttribute("type", "range");
        alignment.setAttribute("step", "0.1");
        alignment.setAttribute("min", "0.1");
        alignment.setAttribute("max", "5");
        alignment.value = 1;

        let separationLabel = createElementWithText("label", "Separation");
        separation = document.createElement("input");
        separation.setAttribute("class", "slider-vert");
        separation.setAttribute("type", "range");
        separation.setAttribute("step", "0.1");
        separation.setAttribute("min", "0.1");
        separation.setAttribute("max", "5");
        separation.value = 1;

        sliderCol1.appendChild(cohesionLabel);
        sliderCol1.appendChild(cohesion);
        sliderCol2.appendChild(alignmentLabel);
        sliderCol2.appendChild(alignment);
        sliderCol3.appendChild(separationLabel);
        sliderCol3.appendChild(separation);

        let settingSliders = document.createElement("div");
        settingSliders.setAttribute("class", "control-col");

        let vRadiusLabel = createElementWithText("label", "Vision Distance");
        visionRadius = document.createElement("input");
        visionRadius.setAttribute("type", "range");
        visionRadius.setAttribute("step", "5");
        visionRadius.setAttribute("min", "20");
        visionRadius.setAttribute("max", "100");
        visionRadius.value = 60;

        let vAngleLabel = createElementWithText("label", "Vision Angle");
        visionAngle = document.createElement("input");
        visionAngle.setAttribute("type", "range");
        visionAngle.setAttribute("step", "10");
        visionAngle.setAttribute("min", "60");
        visionAngle.setAttribute("max", "360");
        visionAngle.value = 120;

        settingSliders.appendChild(vRadiusLabel);
        settingSliders.appendChild(visionRadius);
        settingSliders.appendChild(vAngleLabel);
        settingSliders.appendChild(visionAngle);

        holder.appendChild(settingSliders);

        toolbar.appendChild(holder);
        toolbar.appendChild(playButton);
        toolbar.appendChild(downloadButton);
    }

    function Download() {
        p5.saveCanvas(p5.canvas, "boids", "png");
    }
}
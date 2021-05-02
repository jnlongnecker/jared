class Circle {
    radius;
    center;
    velocity;
    maxVelocity;
    mass;
    baseColor;
    hitColor;

    lerpAmount = 0;

    constructor() {
        this.baseColor = color("#310b0b");
        this.hitColor = color("#f3f4ed");
    }

    Bounce(collidingCircle) {
        this.lerpAmount = 1.05;

        //If the circle is hit from behind, average the current heading and heading of collision
        if (this.HitFromBehind(collidingCircle)) {
            let collisionVector = p5.Vector.sub(this.center, collidingCircle.center);
            let collisionHeading = collisionVector.heading();
            let newHeading = (this.velocity.heading() + collisionHeading) * 0.5;
            this.velocity.setHeading(newHeading);
            return;
        }

        //If not, reflect from the point of contact
        let normal = p5.Vector.sub(collidingCircle.center, this.center);
        this.velocity.reflect(normal);
    }

    BounceHorizontal() {
        let normal = createVector(0, 1);
        this.velocity.reflect(normal);
        this.lerpAmount = 1.05;
    }

    BounceVertical() {
        let normal = createVector(1, 0);
        this.velocity.reflect(normal);
        this.lerpAmount = 1.05;
    }

    HitFromBehind(collidingCircle) {
        let collisionVector = p5.Vector.sub(this.center, collidingCircle.center);
        let collisionHeading = collisionVector.heading();
        let travelHeading = this.velocity.heading();

        return abs(collisionHeading - travelHeading) < HALF_PI;
    }

    IsColliding(otherCircle) {
        let distance = p5.Vector.dist(this.center, otherCircle.center);
        return distance <= this.radius + otherCircle.radius;
    }

    IsCollidingWithPoint(point) {
        let distance = p5.Vector.dist(this.center, point);
        return distance <= this.radius;
    }

    IsInside(otherCircle) {
        let distance = p5.Vector.dist(this.center, otherCircle.center);
        return distance + 2 <= this.radius + otherCircle.radius;
    }

    Move() {
        this.center = p5.Vector.add(this.center, this.velocity);
    }

    ApplyForce(force) {
        force = p5.Vector.div(force, this.mass);
        this.velocity = p5.Vector.add(this.velocity, force);
        if (p5.Vector.mag(this.velocity) > this.maxVelocity) {
            this.velocity = p5.Vector.normalize(this.velocity);
            this.velocity = p5.Vector.mult(this.velocity, this.maxVelocity);
        }
            
    }

    Force() {
        let acc = this.velocity;
        return p5.Vector.mult(acc, this.mass);
    }

    ColorActual() {
        this.lerpAmount -= 0.01;
        if (this.lerpAmount <= 0)
            this.hitColor = color("#f3f4ed");
        return lerpColor(this.baseColor, this.hitColor, this.lerpAmount);
    }

    RandomizeHitColor() {
        let colorVals = [];
        colorVals.push(random(0, 255));
        colorVals.push(random(0, 255));
        colorVals.push(random(0, 255));
        colorVals.push(255);
        this.hitColor = color(colorVals);
    }

}
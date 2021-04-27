class Circle {
    radius;
    center;
    velocity;
    maxVelocity;
    mass;
    baseColor = color("#310b0b");
    hitColor = color("#f3f4ed");

    lerpAmount = 0;

    Circle() {
        this.radius = 5;
        this.center = createVector(0, 0);
    }

    Circle(r, c, v) {
        this.radius = r;
        this.center = c;
        this.velocity = v;
    }

    Bounce(collidingCircle) {
        let normal = p5.Vector.rotate(this.velocity, 90);
        this.velocity.reflect(normal);
        this.lerpAmount = 1.05;
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
        return lerpColor(this.baseColor, this.hitColor, this.lerpAmount);
    }

}
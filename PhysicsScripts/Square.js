class Square {
    x;
    y;
    width;
    height;
    sqColor;
    hasPhysics;
    velocity;
    maxVelocity = 10;

    constructor() {
        this.x = 30;
        this.y = 0;
        this.width = this.height = 15;
        this.sqColor = color("#9c3d54");
        this.hasPhysics = true;
        this.velocity = createVector(0, 0);
    }

    SquareSetup(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.sqColor = color("#310b0b");
        this.hasPhysics = false;
        this.velocity = createVector(0, random(-8, -3));
    }

    Move() {
        let newYVel = min(this.velocity.y + 0.05, this.maxVelocity);
        this.velocity.set(this.velocity.x, newYVel);
        let newY = this.y + newYVel;
        let newX = this.x + this.velocity.x;
        this.x = newX;
        this.y = newY;
    }

    CollidingWith(otherSquare) {
        let yDistance = abs(this.y - otherSquare.y);
        let xDistance = abs(this.x - otherSquare.x);

        let collidingX = (this.x < otherSquare.x) ? xDistance < this.width : xDistance < otherSquare.width;
        let collidingY = (this.y > otherSquare.y) ? yDistance < otherSquare.height : yDistance < this.height;

        return collidingX && collidingY;
    }

    Bounce() {
        this.velocity.set(this.velocity.x, this.velocity.y * -1);
    }
    
    GetIntersectionWith(otherSquare) {
        let intersection = createVector(0, 0);
        let yFlip = (otherSquare.y > this.y) ? -1 : 1;
        intersection.y = otherSquare.y + ( otherSquare.height * 0.5) * yFlip;

        let xFlip = (otherSquare.x > this.x) ? -1 : 1;
        intersection.x = otherSquare.x + ( otherSquare.width * 0.5) * xFlip;
    }

    GetProjectedEndpoint() {
        let projectedEndpointY = this.y + this.velocity.y;
        let projectedEndpointX = this.x + this.velocity.x;

        return createVector(projectedEndpointX, projectedEndpointY);
    }

    TooFarFrom(otherSquare) {
        let rawX = abs(this.x - otherSquare.x);
        let rawY = abs(this.y - otherSquare.y);
        let closingY = abs(this.velocity.y - otherSquare.velocity.y);
        let closingX = abs(this.velocity.x - otherSquare.velocity.x);

        return (rawX > closingX || rawY > closingY);
    }
}
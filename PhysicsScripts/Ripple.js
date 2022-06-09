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
        let radius = lerp(0, this.maxRadius, (this.framesAlive / this.lifespan));
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
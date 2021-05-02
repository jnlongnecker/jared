class ConfettiParticle {
    velocity;
    x;
    y;
    width;
    height;
    rotationSpeed;
    initialHeading;

    constructor(x, y) {
        let xVal = random(-1, 1);
        this.velocity = createVector(xVal, random(-1.5, -abs(xVal)));
        this.x = x;
        this.y = y;
        this.width = random(1,3);
        this.height = random(1,3);
        this.rotationSpeed = random(PI * 0.01, PI * 0.1);
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
        for (i = 0; i < 50; i++) {
            this.confettiList.push(new ConfettiParticle(x, y));
        }
    }

    MoveParticles() {
        for (let particle of this.confettiList) {
            particle.Move();
        }
    }
}
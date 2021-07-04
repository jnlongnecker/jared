class UserSketch {
    constructor(x, y, width, height, pixelsX, pixelsY) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.pixelsX = pixelsX;
        this.pixelsY = pixelsY;
        this.pixels = [];
        this.pixelSize = this.width / this.pixelsX;
        for (let r = 0; r < pixelsY; r++) {
            this.pixels.push([]);
            for (let c = 0; c < pixelsX; c++) {
                this.pixels[r].push(color("#fff"));
            }
        }
    }

    GetTexture() {
        return this.pixels;
    }

    Render() {
        strokeWeight(2);
        let mousePos = {
            x: floor((mouseX - this.x) / this.pixelSize),
            y: floor((mouseY - this.y) / this.pixelSize)
        };
        for (let r = 0; r < this.pixelsY; r++) {
            for (let c = 0; c < this.pixelsX; c++) {
                let x = this.x + (c * this.pixelSize);
                let y = this.y + (r * this.pixelSize);

                let fillColor = this.pixels[r][c];

                stroke(color("#000"));
                fill(fillColor);
                rect(x, y, this.pixelSize, this.pixelSize);
            }
        }
        if (mousePos.x >= 0 && mousePos.y >= 0) {
            strokeWeight(4);
            stroke(color("blue"));
            noFill();
            rect((mousePos.x * this.pixelSize) + this.x, (mousePos.y * this.pixelSize) + this.y, this.pixelSize, this.pixelSize);
        }
    }

    Select() {
        let mousePos = {
            x: floor((mouseX - this.x) / this.pixelSize),
            y: floor((mouseY - this.y) / this.pixelSize)
        };
        if (mousePos.x < 0 || mousePos.y < 0 || mousePos.x >= this.pixelsX || mousePos.y >= this.pixelsY) return color("#fff");

        return this.pixels[mousePos.y][mousePos.x];
    }

    Ink(newColor) {
        let mousePos = {
            x: floor((mouseX - this.x) / this.pixelSize),
            y: floor((mouseY - this.y) / this.pixelSize)
        };
        if (mousePos.x < 0 || mousePos.y < 0 || mousePos.x >= this.pixelsX || mousePos.y >= this.pixelsY) return;

        this.pixels[mousePos.y][mousePos.x] = newColor;
    }
}
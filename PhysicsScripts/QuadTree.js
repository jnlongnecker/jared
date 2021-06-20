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
        let myCenter = createVector(this.x, this.y);
        let circleCenter = circle.center;

        let distanceVector = p5.Vector.sub(myCenter, circleCenter);
        let distance = p5.Vector.dist(myCenter, circleCenter);
        distanceVector.normalize().mult(Math.min(distance, circle.radius));
        let targetPoint = p5.Vector.add(circleCenter, distanceVector);

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
        strokeWeight(1);
        noFill();
        rectMode(CENTER);
        rect(this.quad.x, this.quad.y, this.quad.width * 2, this.quad.height * 2);

        if (this.topLeft !== null) {
            this.topLeft.Display();
            this.topRight.Display();
            this.botLeft.Display();
            this.botRight.Display();
        }
    }
}

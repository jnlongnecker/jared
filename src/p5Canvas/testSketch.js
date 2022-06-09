export const test = (sketch) => {
    sketch.setup = () => {
        sketch.createCanvas(400, 400);
    }

    sketch.draw = () => {
        sketch.background(220);
    }
}
const direction = { LEFT: 0, UP: 1, RIGHT: 2, DOWN: 3 };

// Can't import using a worker
const ColorToHex = function (color) {
    let hexCode = "#";
    hexCode += DecimalToHex(color.levels[0], 2);
    hexCode += DecimalToHex(color.levels[1], 2);
    hexCode += DecimalToHex(color.levels[2], 2);
    return hexCode;
}

const RGBToHex = function (red, green, blue) {
    let hexCode = "#";
    hexCode += DecimalToHex(Math.round(red), 2);
    hexCode += DecimalToHex(Math.round(green), 2);
    hexCode += DecimalToHex(Math.round(blue), 2);
    return hexCode;
}

const DecimalToHex = function (number, bytes = 4) {
    let maxPower = Math.pow(16, bytes - 1);
    let hexValue = "";
    for (let currPower = maxPower; currPower >= 1; currPower /= 16) {
        let digit = 0;
        if (number >= currPower) {
            digit = Math.floor(number / currPower);
            number -= currPower * digit;
        }
        hexValue += DigitToHex(digit);
    }
    return hexValue;
}

const DigitToHex = function (digit) {
    let unicode = digit > 9 ? 55 + digit : 48 + digit;
    return String.fromCharCode(unicode);
}

class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        return this;
    }

    div(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
        return this;
    }
}

class Pattern {
    constructor(pixels) {
        this.pixels = pixels;
        this.size = pixels.length;
        this.weight = 1;
        this.index = 0;

        // Track which patterns match on which side
        this.topMatches = [];
        this.botMatches = [];
        this.lftMatches = [];
        this.rgtMatches = [];
    };

    // Given a direction, gives the matches on that direction
    GetMatchesByDirection(dir) {
        switch (dir) {
            case direction.UP:
                return this.topMatches;
            case direction.DOWN:
                return this.botMatches;
            case direction.LEFT:
                return this.lftMatches;
            case direction.RIGHT:
                return this.rgtMatches;
        }
    };

    // Reflects the current matrix about the x axis and returns a new Pattern with the reflected matrix
    Reflect() {
        let newMatrix = [];

        // Reflect
        for (let r = 0; r < this.size; r++) {
            newMatrix.push([]);
            for (let c = this.size - 1; c >= 0; c--) {
                newMatrix[r].push(this.pixels[r][c]);
            }
        }
        return new Pattern(newMatrix);
    };

    // Rotates the current matrix 90 degrees clockwise and returns a new Pattern with the rotated matrix
    Rotate() {
        let newMatrix = [];

        // Rotate
        for (let r = 0; r < this.size; r++) {
            newMatrix.push([]);
            for (let c = this.size - 1; c >= 0; c--) {
                newMatrix[r].push(this.pixels[c][r]);
            }
        }
        return new Pattern(newMatrix);
    };

    // Debugger method to display the hex colors in a pattern to the console
    Debug() {
        console.log(this.ToString());
    };

    // Debugger method to convert the pattern to a string
    ToString() {
        let asciiDisplay = "";
        for (let row = 0; row < this.size; row++) {
            asciiDisplay += "[ ";
            for (let col = 0; col < this.size; col++) {
                asciiDisplay += `${ColorToHex(this.pixels[row][col])} `;
            }
            asciiDisplay += "]\n";
        }
        return asciiDisplay;
    };

    // Check if the other pattern is a copy of this pattern
    Equals(otherPattern) {
        for (let row = 0; row < this.size; row++) {
            if (!this.EqualsRow(otherPattern, row)) return false;
        }
        return true;
    };

    // Check if a given row is identical to a row in this pattern
    EqualsRow(otherPattern, myRow, theirRow = myRow) {
        for (let col = 0; col < this.size; col++) {
            if (ColorToHex(this.pixels[myRow][col]) != ColorToHex(otherPattern.pixels[theirRow][col])) return false;
        }
        return true;
    };

    // Check if a given column is identical to a column in this pattern
    EqualsCol(otherPattern, myCol, theirCol = myCol) {
        for (let row = 0; row < this.size; row++) {
            if (ColorToHex(this.pixels[row][myCol]) != ColorToHex(otherPattern.pixels[row][theirCol])) return false;
        }
        return true;
    };

    // Check if the other pattern matches any side and add it to the corresponding list if it does
    MatchAndAdd(otherPattern) {
        // if (this.EqualsRow(otherPattern, 0, this.size - 1))
        //     this.topMatches.push(otherPattern);

        // if (this.EqualsRow(otherPattern, this.size - 1, 0))
        //     this.botMatches.push(otherPattern);

        // if (this.EqualsCol(otherPattern, 0, this.size - 1))
        //     this.lftMatches.push(otherPattern);

        // if (this.EqualsCol(otherPattern, this.size - 1, 0))
        //     this.rgtMatches.push(otherPattern);

        for (let dir = 0; dir < 4; dir++) {
            switch (dir) {
                case direction.UP:
                    if (this.Matches(otherPattern, 0, 1)) this.topMatches.push(otherPattern);
                    break;
                case direction.DOWN:
                    if (this.Matches(otherPattern, 0, -1)) this.botMatches.push(otherPattern);
                    break;
                case direction.LEFT:
                    if (this.Matches(otherPattern, -1, 0)) this.lftMatches.push(otherPattern);
                    break;
                case direction.RIGHT:
                    if (this.Matches(otherPattern, 1, 0)) this.rgtMatches.push(otherPattern);
                    break;
            }
        }
    };

    // Check to see if a pattern matches on a given side
    // This, together with the rendering, is the secret sauce
    Matches(otherPattern, dx, dy) {
        let xmin = dx < 0 ? 0 : dx;
        let xmax = dx < 0 ? dx + this.size : this.size;
        let ymin = dy < 0 ? 0 : dy;
        let ymax = dy < 0 ? dy + this.size : this.size;

        for (let y = ymin; y < ymax; y++) {
            for (let x = xmin; x < xmax; x++) {
                if (ColorToHex(this.pixels[y][x]) != (ColorToHex(otherPattern.pixels[y - dy][x - dx])))
                    return false;
            }
        }
        return true;
    };

    // Returns the log of the weight times the weight
    GetLogWeight() {
        return this.weight * Math.log(this.weight);
    };
};

class OverlappingModel {
    constructor(texture, samplePixels = 3, outputWidth = 48, outputHeight = 48,
        periodicInput = true, periodicOutput = false, symmetry = 8) {

        this.remainingPatternsLastBuild = [];
        this.inProgress = [];
        this.done = false;
        this.periodicOutput = periodicOutput;
        this.periodicInput = periodicInput;
        this.texture = texture;
        this.samplePixels = samplePixels;
        this.numPatterns = 0;
        this.width = outputWidth;
        this.height = outputHeight;

        // First, we need to construct our patterns
        this.patterns = [];

        let numSymmetries = 0;
        // If our input is not a repeating input, stop a bit early to avoid wrapping
        for (let row = 0; row < (periodicInput ? texture.length : texture.length - samplePixels); row++) {
            for (let col = 0; col < (periodicInput ? texture[row].length : texture[row].length - samplePixels); col++) {
                let symmetries = [];
                symmetries.push(this.GeneratePatternAt(row, col));
                symmetries.push(symmetries[0].Reflect());
                symmetries.push(symmetries[0].Rotate());
                symmetries.push(symmetries[2].Reflect());
                symmetries.push(symmetries[2].Rotate());
                symmetries.push(symmetries[4].Reflect());
                symmetries.push(symmetries[4].Rotate());
                symmetries.push(symmetries[6].Reflect());

                // Only include the degrees of symmetry we want
                for (let i = 0; i < symmetry; i++) {
                    let existing = false;

                    // If the pattern exists, increment its weight
                    for (let p = 0; p < this.patterns.length; p++) {
                        if (this.patterns[p].Equals(symmetries[i])) {
                            this.patterns[p].weight++;
                            existing = true;
                            break;
                        }
                    }

                    // Otherwise, add it as a new pattern
                    if (!existing) {
                        symmetries[i].index = numSymmetries;
                        this.patterns.push(symmetries[i]);
                        numSymmetries++;
                    }
                }
            }
        }

        this.numPatterns = this.patterns.length;
        console.log(this.numPatterns);

        // Now that we have our patterns, we need to find which patterns match on which side
        for (let currPattern of this.patterns) {

            // For each pattern, check if it matches the other pattern on any side
            for (let otherPattern of this.patterns) {
                currPattern.MatchAndAdd(otherPattern);
            }
        }

        // Set up the wave array for each pixel, starting with all patterns
        this.wave = [];
        this.remainingMatches = [];
        for (let i = 0; i < this.width * this.height; i++) {
            this.wave.push([]);
            this.remainingMatches.push([]);
            for (let p of this.patterns) {
                this.wave[i].push(true);
                this.remainingMatches[i].push(
                    [p.lftMatches.length, p.topMatches.length, p.rgtMatches.length, p.botMatches.length]);
            }
        }

        // Calculate the weight and the log weight in order to calculate the entropy of a pixel
        this.sumOfWeights = 0;
        this.sumOfLogWeights = 0;
        for (let p of this.patterns) {
            this.sumOfWeights += p.weight;
            this.sumOfLogWeights += p.GetLogWeight();
        }
        this.startingEntropy = Math.log(this.sumOfWeights) - this.sumOfLogWeights / this.sumOfWeights;

        // Set up helper arrays to track important values at given locations
        this.remainingPatternsAt = [];
        this.weightSumAt = [];
        this.logWeightSumAt = [];
        this.entropyAt = [];
        for (let i = 0; i < this.wave.length; i++) {
            this.remainingPatternsAt.push(this.numPatterns);
            this.weightSumAt.push(this.sumOfWeights);
            this.logWeightSumAt.push(this.sumOfLogWeights);
            this.entropyAt.push(this.startingEntropy);
        }
        this.stack = [];
        this.observedPatterns = [];
    };

    // Make an observation of the lowest entropy pixel
    Observe() {
        let minEntropy = 1000;
        let minIndex = -1;
        for (let position = 0; position < this.wave.length; position++) {

            // Skip if we'd overflow and we shouldn't
            if (this.WouldOverflow(position % this.width, (position / this.width) | 0)) continue;

            let remainingPatterns = this.remainingPatternsAt[position];
            let currentEntropy = this.entropyAt[position];

            // If there are no remaining patterns at a spot, that's a contradiciton and the algorithm failed
            if (remainingPatterns == 0) return false;

            // If there is 1 remaining pattern at a spot, that position is solved and we can skip
            // If the current entropy is greater than the minimum, well it's not the minimum is it?
            if (this.remainingPatternsAt[position] == 1 || currentEntropy > minEntropy) continue;

            // Noise offset for when multiple entropies are the minimum
            currentEntropy += Math.random() * .000006;
            if (currentEntropy < minEntropy) {
                minEntropy = currentEntropy;
                minIndex = position;
            }
        }

        // If the minimum index was never set, the system is solved so store the observed patterns and return
        if (minIndex == -1) {
            for (let position = 0; position < this.wave.length; position++)
                for (let pattern = 0; pattern < this.wave[position].length; pattern++)
                    if (this.wave[position][pattern]) this.observedPatterns.push(this.patterns[pattern]);
            this.done = true;
            return true;
        }

        let observedIndex = this.ChooseRandomIndexFrom(minIndex);
        let observedPattern = this.patterns[observedIndex];

        // Remove the non-selected patterns, only if they have not already been removed
        for (let pattern = 0; pattern < this.wave[minIndex].length; pattern++) {
            if (this.wave[minIndex][pattern] != this.patterns[pattern].Equals(observedPattern)) this.Remove(pattern, minIndex);
        }

        return null;
    };

    // Remove a pattern from influencing the system
    Remove(pattern, position) {
        let currPattern = this.patterns[pattern];

        // If it's removed, it will have no matches
        for (let value of this.remainingMatches[position][pattern])
            value = 0;

        // Set its status to false and remove it from the sums at its position
        this.wave[position][pattern] = false;
        this.remainingPatternsAt[position] -= 1;
        this.weightSumAt[position] -= currPattern.weight;
        this.logWeightSumAt[position] -= currPattern.GetLogWeight();

        // Recalculate the position's entropy
        this.entropyAt[position] = Math.log(this.weightSumAt[position]) - this.logWeightSumAt[position] / this.weightSumAt[position];

        // Push the position and pattern pair to the stack to calculate the rippling effect of its removal
        this.stack.push({ position: position, pattern: pattern });
    };

    // Ripple out the effects of making an observation
    Propogate() {
        while (this.stack.length > 0) {
            let bPattern = this.stack.pop();
            let x1 = bPattern.position % this.width;
            let y1 = (bPattern.position / this.width) | 0;
            let currPattern = this.patterns[bPattern.pattern];

            let x2 = 0, y2 = 0;
            for (let dir = 0; dir < 4; dir++) {
                switch (dir) {
                    case direction.UP:
                        x2 = x1;
                        y2 = y1 + 1;
                        break;
                    case direction.DOWN:
                        x2 = x1;
                        y2 = y1 - 1;
                        break;
                    case direction.LEFT:
                        x2 = x1 - 1;
                        y2 = y1;
                        break;
                    case direction.RIGHT:
                        x2 = x1 + 1;
                        y2 = y1;
                        break;
                }

                // if this pixel is on the edge, just skip it
                if (this.WouldOverflow(x2, y2)) continue;

                let oppositeDirection = (dir + 2) % 4;
                x2 = this.FitToColumn(x2);
                y2 = this.FitToRow(y2);

                let otherPosition = x2 + y2 * this.width;
                for (let match of currPattern.GetMatchesByDirection(dir)) {

                    // Skip patterns that have been removed
                    if (!this.wave[otherPosition][match.index]) continue;

                    // Reduce matches by 1 and remove the pattern if that was the last match
                    this.remainingMatches[otherPosition][match.index][oppositeDirection] -= 1;
                    if (this.remainingMatches[otherPosition][match.index][oppositeDirection] == 0)
                        this.Remove(match.index, otherPosition);
                }
            }
        }
    };

    // Used to actually run the algorithm of Observations and Propogation of the Observations
    Run(limit = 0, seed = Date.now()) {
        // p5.randomSeed(seed);

        // Run Observations and Propogations until the system is solved or our limit is hit
        // A limit of 0 will run until the system is solved
        for (let i = 0; i < limit || limit == 0; i++) {
            let result = this.Observe();
            if (result != null) return result;
            this.Propogate();
        }
        return null;
    };

    // Returns true if the given row and column would overflow outside of the limits of the output size
    WouldOverflow(row, col) {
        return this.periodicOutput ?
            (row + this.samplePixels > this.height || col + this.samplePixels > this.height || row < 0 || col < 0)
            : false;
    };

    // Helper method to create a pattern at a given origin
    GeneratePatternAt(row, col) {
        let patternMatrix = [];

        // Sample a pattern of size samplePixels from the specified origin
        for (let r = 0; r < this.samplePixels; r++) {
            patternMatrix.push([]);
            for (let c = 0; c < this.samplePixels; c++) {

                // Ensure sampling spot is within the bounds
                let txRow = (row + r) % this.texture.length;
                let txCol = (col + c) % this.texture[txRow].length;
                patternMatrix[r].push(this.texture[txRow][txCol])
            }
        }
        return new Pattern(patternMatrix);
    };

    // Given a pixel position, return a random index for a pattern
    ChooseRandomIndexFrom(position) {

        // Since our patterns are weighted, we need to reflect that by making our random selection as a portion of the weight
        // This leads to patterns with higher weights being more likely to be selected
        let positionWeight = this.weightSumAt[position];
        let threshold = Math.random() * positionWeight;

        // Our random selection is a threshold, and we fill up to the threshold to get our pattern
        // If we fill up to or past the threshold from a pattern's weight, that is the pattern to be selected
        let fill = 0;
        for (let i = 0; i < this.wave[position].length; i++) {
            fill += this.wave[position][i] ? this.patterns[i].weight : 0;
            if (fill >= threshold) return i;
        }
        return this.wave[position].length - 1;
    };

    // Fit a column value to the grid
    FitToColumn(value) {
        if (value < 0) return value + this.width;
        return value % this.width;
    };

    // Fit a row value to the grid
    FitToRow(value) {
        if (value < 0) return value + this.height;
        return value % this.height;
    };

    DebugRemainingPatterns() {
        let output = "";
        for (let row = 0; row < this.height; row++) {
            output += "[ ";
            for (let col = 0; col < this.width; col++) {
                let currNum = this.remainingPatternsAt[col + row * this.height];
                output += `${currNum > 9 ? "" : "0"}${currNum} `;
            }
            output += "]\n";
        }
        console.groupEnd();
        console.groupCollapsed("Current state");
        console.log(output);
        console.groupEnd();
    };

    buildInProgress() {
        if (this.done) {
            this.inProgress = this.observedPatterns;
            return;
        }

        for (let position = 0; position < this.wave.length; position++) {
            if (this.remainingPatternsAt[position] === this.remainingPatternsLastBuild[position]) continue;

            let patternsLeft = 0;
            let newMatrix = [];
            for (let pattern = 0; pattern < this.wave[position].length; pattern++) {
                if (!this.wave[position][pattern]) continue;

                patternsLeft++;

                let pat = this.patterns[pattern];
                let pxl = pat.pixels;
                for (let x = 0; x < pxl.length; x++) {
                    if (!newMatrix[x]) {
                        newMatrix.push([]);
                    }
                    for (let y = 0; y < pxl[x].length; y++) {
                        let clr = pxl[x][y];
                        let curr = newMatrix[x][y];
                        newMatrix[x][y] = curr != undefined ? curr.add(this.colorToVector(clr)) : this.colorToVector(clr);
                    }
                }
            }

            for (let x = 0; x < newMatrix.length; x++) {
                for (let y = 0; y < newMatrix[x].length; y++) {
                    newMatrix[x][y] = newMatrix[x][y].div(patternsLeft);
                    let temp = newMatrix[x][y];
                    newMatrix[x][y] = RGBToHex(temp.x, temp.y, temp.z);
                }
            }

            this.inProgress[position] = new Pattern(newMatrix);
        }

        this.remainingPatternsLastBuild = [...this.remainingPatternsAt]
    }

    colorToVector(color) {
        let colStr = color.toString("rgb").replaceAll(" ", "");
        let stripped = colStr.substring(4, colStr.length - 1);
        let rawVals = stripped.split(",");
        return new Vector(color.levels[0], color.levels[1], color.levels[2]);
    }
};

let wfc;
let output;

self.addEventListener("message", (event) => {

    let payload = event.data;

    wfc = new OverlappingModel(payload.pixels);
    output = null;
    runWfc();
});


function runWfc() {
    let result = null;
    while (result === null) {
        result = wfc.Run(5);
        wfc.buildInProgress();
        output = { pixels: wfc.inProgress, width: wfc.width, height: wfc.height };

        if (result !== false) self.postMessage(output);
    }
    wfc = null;
}
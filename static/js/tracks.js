let visInstances = [];
let posX = 0;

function createVis(trackId, mp3Url) {
    let vis = function (p) {
        p.preload = function () {
            p.song = p.loadSound(mp3Url);
        };

        p.setup = function () {
            p.canvasWidth = p.song.duration(); // Makes the canvas width proportional to the length of the song
            p.createCanvas(p.canvasWidth * 3, 100); // Creates canvas
            p.peaks = p.song.getPeaks(p.canvasWidth * 10); // Gets the data pf the peaks to visually map out the song
            p.noFill();
        };

        p.draw = function () {
            p.background(0);
            p.fill(0);
            p.stroke(48, 54, 58);
            p.strokeWeight(1);
            p.rect(1, 1, p.width - 2, p.height - 2, 10);

            if (p.song.isPlaying()) {
                posX = p.map(p.song.currentTime(), 0, p.song.duration(), 0, p.width);
                p.stroke(255, 79, 0);
                p.line(posX, 0, posX, p.height);
            } else {
                p.stroke(255, 79, 0);
                p.line(posX, 0, posX, p.height);
            }

            p.stroke(255);

            // The forloop draws out the visual
            if (p.peaks) {
                for (let i = 0; i < p.peaks.length; i++) {
                    let x = p.map(i, 0, p.peaks.length, 0, p.width);
                    p.line(x, p.height / 2 + p.peaks[i] * 40, x, p.height / 2 - p.peaks[i] * 40);
                }
            }
        };

        p.mouseClicked = function () {
            let posM = p.map(posX, 0, p.width, 0, p.song.duration());

            if (p.song.isPlaying()) {
                p.song.pause();
            } else {
                p.song.play();
                p.song.jump(posM);
            }
        };
    };

    let myVis = new p5(vis, `vis-container-${trackId}`);
    visInstances.push(myVis);
}

function createRuler() {
    let ruler = function (p) {

        p.setup = function () {
            p.createCanvas(400, 30);
            p.noFill();
        };

        p.draw = function () {
            p.background(0);
            p.fill(30, 33, 36);
            p.stroke(30, 33, 36);
            p.strokeWeight(1);
            p.rect(1, 1, p.width - 2, p.height - 2, 10);

            let posL = posX

            p.stroke(255, 79, 0);
            drawPolygon(p, posX, p.height / 2, 20);
        };

        p.mouseDragged = function () {
            if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                posX = p.constrain(p.mouseX, 0, p.width);
                return true
            } else {
                return false
            }
        };

        function drawPolygon(p, posX, posY, size) {
            p.push(); // Start a new drawing state
            p.translate(posX, posY); // Move the origin to posX, posY
            p.rotate(p.PI);

            p.fill(160, 49, 0); // Fill with orange color (RGB)
            p.stroke(160, 49, 0); // Outline color slightly darker than the fill
            p.strokeWeight(2);

            // Define the polygon vertices
            let points = [
                p.createVector(0, -size / 2), // Top vertex
                p.createVector(size / 2, 0), // Top-right vertex
                p.createVector(size / 2, size / 2), // Bottom-right vertex
                p.createVector(-size / 2, size / 2), // Bottom-left vertex
                p.createVector(-size / 2, 0) // Top-left vertex
            ];

            p.beginShape();
            // Top of polygon
            p.vertex(points[0].x, points[0].y);
            // Right side of polygon
            for (let i = 1; i < points.length; i++) {
                p.vertex(points[i].x, points[i].y);
            }
            // Closing the shape by connecting back to the top
            p.vertex(points[0].x, points[0].y);
            p.endShape(p.CLOSE);

            p.pop();
        }
    };

    let myRuler = new p5(ruler, `ruler-container`);
}



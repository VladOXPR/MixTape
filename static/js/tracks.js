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

            p.posM = posX
            let posL = p.map(p.song.currentTime(), 0, p.song.duration(), 0, p.width);

            p.stroke(255, 79, 0);
            p.line(posL, 0, posL, p.height);

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
            let startTime = p.map(p.posM, 0, p.width, 0, p.song.duration());

            if (p.song.isPlaying()) {
                p.song.pause();
            } else {
                p.song.play();
                p.song.jump(startTime);
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
            p.line(posL, 0, posL, p.height);
        };

        p.mouseDragged = function () {
            if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                posX = p.constrain(p.mouseX, 0, p.width);
                return false;
            }
        };
    };

    let myRuler = new p5(ruler, `ruler-container`);
}



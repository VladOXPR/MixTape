let visInstances = [];
let posX = 0;
let x = true;

function createVis(trackId, mp3Url) {
    let vis = function (p) {
         p.preload = function () {
            p.song = p.loadSound(mp3Url);
            p.song.isPlaying = true;
        };

        p.setup = function () {
            let container = document.getElementById(`vis-container-${trackId}`);
            p.canvasWidth = container.offsetWidth;
            p.canvasHeight = container.offsetHeight;
            p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.peaks = p.song.getPeaks(p.canvasWidth * 0.9); // Gets the data pf the peaks to visually map out the song
            p.noFill();
        };


        p.draw = function () {
            p.clear();
            p.fill(0);
            p.stroke(48, 54, 58);
            p.strokeWeight(1);
            p.stroke(255);
            p.song.setVolume(.8);

            if (p.peaks) {
                for (let i = 0; i < p.peaks.length; i++) {
                    let x = p.map(i, 0, p.peaks.length, 0, p.width);
                    p.line(x, p.height / 2 + p.peaks[i] * 40, x, p.height / 2 - p.peaks[i] * 40);
                }
            }

            if (p.song.isPlaying()) {
                posX = p.map(p.song.currentTime(), 0, p.song.duration(), 0, p.width);
                p.stroke(255, 79, 0);
                p.line(posX, 0, posX, p.height);
            } else {
                p.stroke(255, 79, 0);
                p.line(posX, 0, posX, p.height);
            }
        };
    };

    let myVis = new p5(vis, `vis-container-${trackId}`);
    visInstances.push(myVis);
}



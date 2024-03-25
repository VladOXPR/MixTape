let visInstances = [];
let posX = 0;
let posM = 0;
let x = true;

function createVis(trackId, mp3Url) {
    let isMuted = false;
    let mute = function (p) {
        let isOriginalColor = true; // This variable tracks the state of the background color

        p.setup = function () {
            p.createCanvas(52, 100); // Creates mute canvas
        };

        p.draw = function () {
            // Use the isOriginalColor variable to determine the background color
            if (isOriginalColor) {
                p.fill(216,220,220);
                p.stroke(216,220,220); // Original background color
            } else {
                p.fill(30, 33, 36);
                p.stroke(30, 33, 36); // Alternative background color
            }

            p.strokeWeight(1);
            p.rect(1, 1, p.width - 2, p.height - 2, 3); // Creates rounded corners
        };

        p.mouseClicked = function () {
            if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                isOriginalColor = !isOriginalColor;
                isMuted = !isMuted;
            }
        };
    };



    let vis = function (p) {
        p.preload = function () {
            p.song = p.loadSound(mp3Url);
        };

        p.setup = function () {
            p.canvasWidth = p.song.duration(); // Makes the canvas width proportional to the length of the song
            p.createCanvas(p.canvasWidth * 3, 100); // Creates canvas
            p.peaks = p.song.getPeaks(p.canvasWidth * 0.9); // Gets the data pf the peaks to visually map out the song
            p.noFill();
        };

        p.draw = function () {
            p.background(0);
            p.fill(0);
            p.stroke(48, 54, 58);
            p.strokeWeight(1);
            p.rect(1, 1, p.width - 2, p.height - 2, 10);

            // The forloop draws out the visual
            if (isMuted) {
                p.stroke(74, 79, 84); // Example muted color
            } else {
                p.stroke(255); // Default color
            }

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
    let myMute = new p5(mute, `mute-container-${trackId}`);
    visInstances.push(myVis);
}


function createRuler() {
    let ruler = function (p) {
        p.setup = function () {
            let containerWidth = document.getElementById('codeModal').offsetWidth;
            p.createCanvas(containerWidth, 28);
            p.noFill();
        };

        p.draw = function () {
            p.background(0);
            p.fill(30, 33, 36);
            p.stroke(30, 33, 36);
            p.strokeWeight(1);
            p.rect(1, 1, p.width - 2, p.height - 2, 3);

            let posL = posX

            p.stroke(255, 79, 0);
            drawPolygon(p, posX, p.height / 2, 20);
        };

        let wasPlaying = false;

        p.mouseDragged = function () {
            visInstances.forEach(vis => {
                if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                    if (!wasPlaying && vis.song.isPlaying()) {
                        wasPlaying = true;
                        vis.song.pause();
                    }

                    posX = p.constrain(p.mouseX, 0, p.width);
                }
            });
        };

        p.mouseReleased = function () {
            visInstances.forEach(vis => {
                let posM = vis.map(posX, 0, vis.width, 0, vis.song.duration());

                if (wasPlaying) {
                    vis.song.play();
                    vis.song.jump(posM);
                    wasPlaying = false;
                }
            });
        };


        function drawPolygon(p, posX, posY, size) {
            p.push();
            p.translate(posX, posY);
            p.rotate(p.PI);

            p.fill(160, 49, 0);
            p.stroke(160, 49, 0);
            p.strokeWeight(2);

            let points = [
                p.createVector(0, -size / 2), // Top vertex
                p.createVector(size / 2, 0), // Top-right vertex
                p.createVector(size / 2, size / 2), // Bottom-right vertex
                p.createVector(-size / 2, size / 2), // Bottom-left vertex
                p.createVector(-size / 2, 0) // Top-left vertex
            ];

            p.beginShape();
            p.vertex(points[0].x, points[0].y);

            for (let i = 1; i < points.length; i++) {
                p.vertex(points[i].x, points[i].y);
            }

            p.vertex(points[0].x, points[0].y);
            p.endShape(p.CLOSE);
            p.pop();
        }
    };

    let myRuler = new p5(ruler, `ruler-container`);
}

function controlVis() {
    let control = function (p) {
        let isPlaying = true;
        let playImg, pauseImg;

        p.preload = function () {
            playImg = p.loadImage('/media/daw_play.png'); // Loads play image
            pauseImg = p.loadImage('/media/daw_pause.png'); // Loads pause image
        };

        p.setup = function () {
            p.createCanvas(52, 28);
            p.imageMode(p.CENTER); // Ensures images are drawn centered on their coordinates
        };

        p.draw = function () {
            p.background(0);
            let img = isPlaying ? playImg : pauseImg; // Choose the image based on the playing state
            p.image(img, p.width / 2, p.height / 2); // Center the image
        };

        p.mouseClicked = function () {
            if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                isPlaying = !isPlaying;
                togglePlayPauseAll(!isPlaying);
            }
        };

        function togglePlayPauseAll(play) {
            visInstances.forEach(vis => {
                posM = vis.map(posX, 0, vis.width, 0, vis.song.duration());
                if (play && !vis.song.isPlaying()) {
                    vis.song.play();
                    vis.song.jump(posM);
                } else if (!play && vis.song.isPlaying()) {
                    vis.song.pause();
                }
            });
        }
    };

    new p5(control, 'control-container');
}


let visInstances = [];
let posX = 0;
let posM = 0;
let x = true;

function createVis(trackId, mp3Url) {
    let isMuted = false;
    let mute = function (p) {
        let isOriginalColor = true; // This variable tracks the state of the background color

        p.setup = function () {
            p.createCanvas(52, 100);
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
            // p.canvasWidth = p.song.duration(); // Makes the canvas width proportional to the length of the song
            p.canvasWidth = document.getElementById('codeModal').offsetWidth;
            p.createCanvas(p.canvasWidth-1, 100);
            p.peaks = p.song.getPeaks(p.canvasWidth / 1.5); // Gets the data of the peaks to visually map out the song
            p.noFill();
        };

        p.draw = function () {
            p.background(12, 12, 13);
            p.fill(0);
            p.stroke(48, 54, 58);
            p.strokeWeight(1);
            p.rect(1, 1, p.width - 2, p.height - 2, 10);

            if (isMuted) {
                p.stroke(74, 79, 84); // muted color of the visual
            } else {
                p.stroke(255); // Default color of the visual
            }

            // The forloop draws out the visual
            if (p.peaks) {
                for (let i = 0; i < p.peaks.length; i++) {
                    let x = p.map(i, 0, p.peaks.length, 0, p.width);
                    p.line(x, p.height / 2 + p.peaks[i] * 30, x, p.height / 2 - p.peaks[i] * 30);
                }
            }

            p.song.setVolume(isMuted ? 0 : 1);

            // If song is playing, line is at the position
            // at which the song is currently playing
            // else
            // line is just at position X which is determined
            // in a different function
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
            p.createCanvas(containerWidth-1, 28);
            p.noFill();
        };

        p.draw = function () {
            p.background(12, 12, 13);
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

                    // if song is playing when we drag
                    // pause the song and make position X
                    // where the mouse dragged the cursor too
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
            p.fill(255, 79, 0);
            p.stroke(255, 79, 0);
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

let playButton;

function controlVis() {
    let control = function (p) {
        let isPlaying = false;

        p.setup = function () {
            playButton = p.createButton('');
            playButton.id('play-button');
            playButton.parent('play-container');
            playButton.mousePressed(() => {
                isPlaying = !isPlaying; // Toggle the playing state
                togglePlayPauseAll(isPlaying, playButton, p); // Pass the current state and button to function
            });
        };
    };

    new p5(control);
}

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

    if (play) {
        playButton.style('background-image', 'url("/media/daw_pause.png")');  // When music plays, show pause
    } else {
        playButton.style('background-image', 'url("/media/daw_play.png")');  // When music pauses, show play
    }
}

volHistory = [];
memHistory = [];
initialPosX = 0; // Store initial posX when recording starts
finalPosX = 0;

let micVis = function (p) {
    let mic, recorder, soundFile;
    let recButton; // Single button for both actions
    let isRecording = false; // Track if recording is active
    let startTime = 0; // When the recording started
    let recordedTime = 0; // Length of the recording

    p.setup = function() {
        p.canvasWidth = document.getElementById('codeModal').offsetWidth;
        p.createCanvas(p.canvasWidth-55, 100); // Set a fixed canvas size
        mic = new p5.AudioIn();
        mic.start();
        recorder = new p5.SoundRecorder();
        recorder.setInput(mic);
        soundFile = new p5.SoundFile();
        p.amp = new p5.Amplitude();
        recButton = p.createButton('');
        recButton.id('record-button');
        recButton.parent('record-container');
        recButton.mousePressed(p.toggleRecording);
    };

    p.draw = function() {
        p.background(12, 12, 13);
        let currentTime = 0;
        let width = isRecording ? posX - initialPosX : finalPosX - initialPosX; // Example scaling, adjust as needed
        p.fill(0); // Fill color for the "growing" rectangle
        p.stroke(48, 54, 58);
        p.strokeWeight(1);
        p.rect(initialPosX, 1, width, p.height - 2, 10);

        if (isRecording) {
            let vol = mic.getLevel();
            volHistory.push(vol);
            memHistory.push(vol);
        }

        p.stroke(255);

        for (let i = 0; i < volHistory.length; i++) {
            let x = p.map(i, 0, volHistory.length, initialPosX, initialPosX + width);
            p.line(x, p.height / 2 + volHistory[i] * 30, x, p.height / 2 - volHistory[i] * 30);
        }

        p.stroke(255, 79, 0);
        p.line(posX, 0, posX, p.height);
    }

    p.toggleRecording = function() {
        if (!isRecording) {
            p.record();
            recButton.style('background-image', 'url("/media/recIng.png")');
        } else {
            p.stop();
            recButton.style('background-image', 'url("/media/rec.png")');
        }
    };

    p.record = function() {
        if (!isRecording) {
            volHistory = [];
            memHistory = [];
            p.userStartAudio();
            recorder.record(soundFile);
            isRecording = true;
            startTime = window.performance.now();
            recButton.html(''); // Update button text
            initialPosX = posX;
            togglePlayPauseAll(true);
        }
    };

    p.stop = function() {
        if (isRecording) {
            recorder.stop();
            isRecording = false;
            recordedTime += (window.performance.now() - startTime) / 3000; // Update recordedTime
            recButton.html(''); // Update button text back to 'Record';
            finalPosX = posX;
            togglePlayPauseAll(false);
        }
    };
};

let myMicVis = new p5(micVis, 'micVis');

let memoVis = function (p) {
    p.setup = function() {
        p.createCanvas(400, 100);
    };

    p.draw = function() {
        p.background(12, 12, 13);
        p.stroke(255);
        p.noFill();
        p.beginShape();

        for (let i = 0; i < memHistory.length; i++) {
            let x = p.map(i, 0, volHistory.length, initialPosX, initialPosX + width);
            p.line(x, p.height / 2 + memHistory[i] * 30, x, p.height / 2 - memHistory[i] * 30);
        }

        p.endShape();

        if (memHistory.length > 380) {
            memHistory.splice(0, 1);
        }
    }
}

//let myMemoVis = new p5(memoVis, 'memoVis');
let micVis = function (p) {
    let mic, recorder, soundFile;
    let volhistory = [];
    let playButton;
    let recButton;
    let state = 0;
    let slider;
    let canvasWidth;

    p.setup = function () {
        if (state === 2) {
            canvasWidth = soundFile.duration();
        } else {
            canvasWidth = 370;
        }

        p.createCanvas(canvasWidth, 100);
        p.noFill()

        mic = new p5.AudioIn();
        mic.start();

        recorder = new p5.SoundRecorder();
        recorder.setInput(mic);
        soundFile = new p5.SoundFile();

        recButton = p.createButton("Record");
        recButton.mousePressed(startRecording);

        playButton = p.createButton("Play");
        playButton.mousePressed(playRecording);
        playButton.hide();
    };

    function vis() {
        peaks = soundFile.getPeaks(p.width);

        let t = p.map(soundFile.currentTime(), 0, soundFile.duration(), 0, p.width);

        p.stroke(255, 0, 0);
        p.line(t, 0, t, p.height);

        p.stroke(255);
        for (let i = 0; i < peaks.length; i++) {
            p.line(i, p.height / 2 + peaks[i] * 40, i, p.height / 2 - peaks[i] * 40);
        }
    }

    function rec() {
        let vol = mic.getLevel();
        volhistory.push(vol);
        p.stroke(255);
        p.noFill();
        p.beginShape();

        for (let i = 0; i < volhistory.length; i++) {
            let y = p.map(volhistory[i] * 5, 0, 1, p.height / 2, 0);
            p.vertex(i, y);
        }

        p.endShape();

        if (volhistory.length > p.width - 50) {
            volhistory.splice(0, 1);
        }

        p.stroke(255, 0, 0);
        p.line(volhistory.length, 0, volhistory.length, p.height);
    }

    p.draw = function () {
        p.background(0); // You might need to adjust this to match your desired background
        p.fill(0); // Match the fill to your background color
        p.stroke(48, 54, 58); // Or choose another stroke color if desired
        p.strokeWeight(1)
        let cornerRadius = 15;
        p.rect(1, 1, p.width-2, p.height-2, cornerRadius); // This creates the rounded rectangle
        // p.background(30, 33, 36);

        if (state === 1) {
            rec();
        } else if (state === 2) {
            vis();
        }
    };

    function startRecording() {
        if (state === 0 && mic.enabled) {
            recorder.record(soundFile);

            state++;
            recButton.html("Stop Recording");
        } else if (state === 1) {
            recorder.stop();

            state++;
            recButton.html("Re Record");
            playButton.show();
        } else if (state === 2) {
            recorder.record(soundFile);

            state--;
            recButton.html("Stop Recording");
            playButton.hide();
        }
    }

    function playRecording() {
        if (soundFile.isPlaying()) {
            soundFile.pause();
            playButton.html("Play");
        } else {
            soundFile.play();
            playButton.html("Pause");
        }
    }


};

let myMicVis = new p5(micVis, 'micVis');
function createVis(trackId, mp3Url) {
    let vis = function (p) {
        let song;
        let peaks;
        let isPlaying = false; // This is now used only for initialization
        let canvasWidth;

        p.preload = function () {
            song = p.loadSound(mp3Url);
        };

        p.setup = function () {
            canvasWidth = song.duration();
            p.createCanvas(canvasWidth * 3, 100);
            peaks = song.getPeaks(canvasWidth * 10);
            console.log(peaks);

            // Additional setup for rounded corners effect
            p.noFill(); // Ensure the rounded rectangle doesn't have a fill
        };

        p.draw = function () {
            let currentTime = song.currentTime();
            let t = p.map(currentTime, 0, song.duration(), 0, p.width);

            // Draw background with rounded corners
            p.background(0);
            p.fill(0);
            p.stroke(48, 54, 58);
            p.strokeWeight(1);
            let cornerRadius = 15;
            p.rect(1, 1, p.width-2, p.height-2, cornerRadius); // Rounded rectangle

            // Drawing the visualization
            p.strokeWeight(1);
            p.stroke(255, 0, 0);
            p.line(t, 0, t, p.height);
            p.stroke(255);

            for (let i = 0; i < peaks.length; i++) {
                let x = p.map(i, 0, peaks.length, 0, p.width);
                p.line(x, p.height / 2 + peaks[i] * 40, x, p.height / 2 - peaks[i] * 40);
            }
        };

        p.mouseClicked = function () {
            if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                // Ensures the function only triggers when clicking inside the canvas
                if (song.isPlaying()) {
                    song.pause();
                    p.noLoop();
                } else {
                    song.play();
                    p.loop();
                }
            }
        };
    };

    let myVis = new p5(vis, `vis-container-${trackId}`);
}

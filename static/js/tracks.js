function createVis(trackId, mp3Url) {
    let vis = function (p) {
        let song;
        let peaks;
        let playButton;
        let volumeSlider;
        let timeSlider; // New time slider
        let isPlaying = false;
        let canvasWidth;


        p.preload = function () {
            song = p.loadSound(mp3Url);
        };


        p.setup = function () {
            canvasWidth = song.duration();
            p.createCanvas(canvasWidth * 3, 100);
            peaks = song.getPeaks(canvasWidth);
            playButton = p.createButton("play");
            playButton.mousePressed(togglePlaying);
            console.log(peaks);

            // Additional setup for rounded corners effect
            p.noFill(); // Ensure the rounded rectangle doesn't have a fill that obscures the visualization
        };


        p.draw = function () {
            let currentTime = song.currentTime();
            let t = p.map(currentTime, 0, song.duration(), 0, p.width);

            // Draw background with rounded corners
            p.background(0); // You might need to adjust this to match your desired background
            p.fill(0); // Match the fill to your background color
            p.stroke(48, 54, 58); // Or choose another stroke color if desired
            p.strokeWeight(1);
            let cornerRadius = 15;
            p.rect(1, 1, p.width-2, p.height-2, cornerRadius); // This creates the rounded rectangle

            // Continue drawing the visualization inside the rounded rectangle
            p.strokeWeight(1);
            p.stroke(255, 0, 0);
            p.line(t, 0, t, p.height);
            p.stroke(255);

            for (let i = 0; i < peaks.length; i++) {
                let x = p.map(i, 0, peaks.length, 0, p.width);
                p.line(x, p.height / 2 + peaks[i] * 40, x, p.height / 2 - peaks[i] * 40);
            }
        };


        function togglePlaying() {
            if (!isPlaying) {
                song.play();
                playButton.html("pause");
            } else {
                song.pause();
                playButton.html("play");
            }
            isPlaying = !isPlaying;
        }
    };


    let myVis = new p5(vis, `vis-container-${trackId}`);
}

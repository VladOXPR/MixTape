function createVis(trackId, mp3Url) {
    let vis = function(p) {
        let song;
        let peaks;
        let playButton;
        let volumeSlider;
        let timeSlider; // New time slider
        let isPlaying = false;
        let canvasWidth;


        p.preload = function() {
            song = p.loadSound(mp3Url);
        };


        p.setup = function() {
            canvasWidth = song.duration();
            p.createCanvas(canvasWidth*3, 100);// Assign an id to the canvas
            peaks = song.getPeaks(canvasWidth);
            playButton = p.createButton("play");
            playButton.mousePressed(togglePlaying);
            console.log(peaks);
        };


        p.draw = function() {
            let currentTime = song.currentTime();
            let t = p.map(currentTime, 0, song.duration(), 0, p.width);
            p.background(0, 0, 0);
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

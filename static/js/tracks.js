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
            // Use preload for loading assets
            song = p.loadSound(mp3Url);
        };

        p.setup = function() {
            canvasWidth = song.duration();

            p.createCanvas(canvasWidth, 100);
            peaks = song.getPeaks(10000);

            playButton = p.createButton("play");
            playButton.mousePressed(togglePlaying);

            // Volume slider
            volumeSlider = p.createSlider(0, 1, 0.3, 0.01);

            // Time slider
            timeSlider = p.createSlider(0, song.duration(), 0, 0.1);
            timeSlider.input(updateSongTime); // Call updateSongTime when the slider changes

            console.log(peaks);
        };

        p.draw = function() {
            song.setVolume(volumeSlider.value());

            if (isPlaying) {
                timeSlider.value(song.currentTime());
            }

            let t = p.map(timeSlider.value(), 0, song.duration(), 0, p.width);
            p.background(34, 34, 34);
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

        function updateSongTime() {
            let newTime = timeSlider.value();
            song.jump(newTime);
        };
    };

    let myVis = new p5(vis, `vis-container-${trackId}`);
}

function createVis(trackId, mp3Url) {
    let vis = function (p) {
        let song;
        let peaks;
        let canvasWidth;
        let isDragging = false;
        let triangleSize = 10;
        let dragPosition = 0;


        p.preload = function () {
            song = p.loadSound(mp3Url);
        };


        p.setup = function () {
            canvasWidth = song.duration();
            p.createCanvas(canvasWidth * 3, 100);
            peaks = song.getPeaks(canvasWidth * 10);
            p.noFill();
        };


        p.draw = function () {
            let currentTime = isDragging ? dragPosition : song.currentTime();
            let t = p.map(currentTime, 0, song.duration(), 0, p.width);
            let cornerRadius = 15;

            p.background(0);
            p.fill(0);
            p.stroke(48, 54, 58);
            p.strokeWeight(1);
            p.rect(1, 1, p.width-2, p.height-2, cornerRadius);
            p.stroke(255, 0, 0);
            p.line(t, 0, t, p.height);
            p.triangle(t - triangleSize, 0, t + triangleSize, 0, t, triangleSize);
            p.stroke(255);
            for (let i = 0; i < peaks.length; i++) {
                let x = p.map(i, 0, peaks.length, 0, p.width);
                p.line(x, p.height / 2 + peaks[i] * 40, x, p.height / 2 - peaks[i] * 40);
            }
        };


        p.mousePressed = function () {
            let currentTime = isDragging ? dragPosition : song.currentTime();
            let t = p.map(currentTime, 0, song.duration(), 0, p.width);
            if (p.mouseX >= t - triangleSize && p.mouseX <= t + triangleSize && p.mouseY <= 2 * triangleSize) {
                isDragging = true;
                return false;
            }
        };


        p.mouseDragged = function () {
            if (isDragging) {
                dragPosition = p.map(p.mouseX, 0, p.width, 0, song.duration());
                dragPosition = p.constrain(dragPosition, 0, song.duration());
                song.jump(dragPosition);
            }
        };


        p.mouseReleased = function () {
            isDragging = false;
        };


        p.mouseClicked = function () {
            if (!isDragging) {
                if (song.isPlaying()) {
                    song.pause();
                } else {
                    song.play();
                }
            }
        };
    };




    let myVis = new p5(vis, `vis-container-${trackId}`);
}

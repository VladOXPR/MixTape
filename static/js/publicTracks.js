
function createVis(trackId, mp3Url) {
    let vis = function(p) {
      let barry;
      let peaks;

      p.preload = function() {
        barry = p.loadSound(mp3Url);
      };

      p.setup = function() {
        p.canvasWidth = barry.duration();
        p.createCanvas(p.canvasWidth, 50);
        peaks = barry.getPeaks(p.canvasWidth);
        barry.loop();
      };

      p.draw = function() {
        p.clear();
        p.fill(30, 33, 36);
        p.stroke(48, 54, 58);
        p.strokeWeight(1);
        p.rect(1, 1, p.width - 2, p.height - 2, 10);
        p.stroke(255);

        // Determine the current index in the peaks array
        let currentIndex = p.map(barry.currentTime(), 0, barry.duration(), 0, peaks.length);

        for (let i = 0; i < peaks.length; i++) {
          // Set the stroke color based on whether the sound has reached this peak
          if (i <= currentIndex) {
            p.stroke(255); // White for peaks that the playback has reached
          } else {
            p.stroke(128); // Grey for peaks not yet reached by playback
          }

          p.line(i, p.height / 2 + peaks[i] * 50, i, p.height / 2 - peaks[i] * 50);
        }
      };

      p.mousePressed = function() {
        if (barry.isPlaying()) {
          barry.pause();
        } else {
          barry.loop();
        }
      };
    };

    let myVis = new p5(vis, `vis-container-${trackId}`);
    visInstances.push(myVis);
}



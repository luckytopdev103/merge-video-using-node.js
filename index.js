const fs = require("fs");
const tmp = require("tmp");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Define the video streams by creating read streams from video files
function convertVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .size("1080x1080")
      .output(outputPath)
      .format("mp4")
      .on("end", () => {
        console.log(`Video converted: ${outputPath}`);
        resolve();
      })
      .on("error", (err) => {
        console.error(`Error converting video: ${err.message}`);
        reject(err);
      })
      .run();
  });
}
Promise.all([
  convertVideo("./input/1.mp4", "./input/video1.mp4"),
  convertVideo("./input/2.mp4", "./input/video2.mp4"),
])
  .then(() => {
    console.log("All videos converted successfully");
    ffmpeg("list.txt")
      .inputOptions(["-f concat", "-safe 0"])
      .outputOptions(["-c copy"])
      .on("end", () => console.log("Merging completed"))
      .on("error", (err) => console.error("Error:", err))
      .save("./output/mergedVideo.mp4");
  })
  .catch((err) => {
    console.error("An error occurred during conversion:", err);
  });

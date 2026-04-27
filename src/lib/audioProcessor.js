const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const fs = require("fs-extra");
const path = require("path");

ffmpeg.setFfmpegPath(ffmpegPath);

async function ensureTemp() {
  const tempDir = path.join(__dirname, "..", "..", "temp");
  await fs.ensureDir(tempDir);
  return tempDir;
}

function runFfmpeg(input, output, options = []) {
  return new Promise((resolve, reject) => {
    let command = ffmpeg(input);

    for (const opt of options) {
      if (opt.type === "audioFilter") command = command.audioFilters(opt.value);
      if (opt.type === "outputOption") command = command.outputOptions(opt.value);
      if (opt.type === "format") command = command.format(opt.value);
    }

    command
      .save(output)
      .on("end", () => resolve(output))
      .on("error", reject);
  });
}

module.exports = {
  ensureTemp,
  runFfmpeg,
};

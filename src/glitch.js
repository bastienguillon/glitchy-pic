const fs = require('fs');
const getPixels = require('get-pixels');
const savePixels = require('save-pixels');

const inputPath = process.argv[2] ? process.argv[2] : (function () { throw new Error('missing picture path arg'); })();
const outputPath = `./outputs/${inputPath.replace(/^.*[\\\/]/, '').split('.')[0]}_${new Date().toISOString().replaceAll('.', '_').replaceAll(':', '_')}.png`;

if (!fs.existsSync('./outputs')) {
    fs.mkdirSync('./outputs');
}

getPixels(
    inputPath,
    function (err, pixels) {
        if (err) {
            throw new Error(`picture ${path} does not exist`);
        }

        // TODO: That's where the real fun begins

        const file = fs.createWriteStream(outputPath);
        savePixels(pixels, "png").pipe(file);
    }
);

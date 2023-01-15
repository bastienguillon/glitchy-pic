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

        const width = pixels.shape[0];
        const height = pixels.shape[1];

        // Pixel per pixel transformation (invert colors)
        // for (let i = 0; i < pixels.data.length; i += 4) {
        //     // R
        //     pixels.data[i] = 255 - pixels.data[i];
        //     // G
        //     pixels.data[i + 1] = 255 - pixels.data[i + 1];
        //     // B
        //     pixels.data[i + 2] = 255 - pixels.data[i + 2];
        //     // A
        //     pixels.data[i + 3] = 255;
        // }

        // Scanlines
        // const brightness = -50;
        // for (let line = 0; line < height; line += 3) {
        //     for (
        //         let i = line * 4 * width;
        //         i < (line * 4 * width) + (width * 4);
        //         i += 4
        //     ) {
        //         // R
        //         pixels.data[i] = Math.min(255, Math.max(0, pixels.data[i] + brightness));
        //         // G
        //         pixels.data[i + 1] = Math.min(255, Math.max(0, pixels.data[i + 1] + brightness));
        //         // B
        //         pixels.data[i + 2] = Math.min(255, Math.max(0, pixels.data[i + 1] + brightness));
        //     }
        // }

        // Translate lines randomly
        // TODO: Math.random cannot be seeded, will have to use something else to generate random numbers
        let translation = Math.floor(Math.random() * width / 8);
        let nextTranslationSizeUpdate = Math.floor(Math.random() * (20 - 2 + 1) + 2)
        for (let line = 0; line < height; line += 1) {

            if (line % nextTranslationSizeUpdate === 0) {
                translation = Math.floor(Math.random() * width / 8);
                nextTranslationSizeUpdate = Math.floor(Math.random() * (20 - 2 + 1) + 2)
            }

            for (let t = 0; t < translation; ++t) {

                const lineStart = line * width * 4;
                const lineEnd = lineStart + 4 * width;

                // TODO: do not rebuild the array just to use shift, it destroys perfs: implement shift on Uint8Array instead
                const lineCopy = [...pixels.data.slice(lineStart, lineEnd)];
                for (let p = 0; p < 4; ++p) {
                    lineCopy.push(lineCopy.shift());
                }

                for (
                    let i = lineStart;
                    i < lineEnd;
                    i += 1
                ) {
                    pixels.data[i] = lineCopy[i - lineStart];
                }
            }
        }

        const file = fs.createWriteStream(outputPath);
        savePixels(pixels, "png").pipe(file);
    }
);

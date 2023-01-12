const fs = require('fs');

function getPic() {
    const pic = fs.readFileSync(
        process.argv[2] ?
            process.argv[2] :
            (function () { throw new Error('missing picture path arg'); })()
    );
    return pic;
}

const pic = getPic();
console.log(pic);
// app/dlcharts.js

let fs = require('fs');
let request = require('request');
let deasync = require('deasync');
let winston = require('winston');
winston.level = 'error';

let scale = require('./scale.js')
const slippy = require('./slippy.js')

let downloaded = 0;
let skipped = 0;
let errors = 0;

let dlCharts = function (northWest, southEast, baseUri, name) {
    var html = '<html>\n<head>\n\t<link rel="stylesheet" type="text/css" href="../style.css">\n</head>\n<body>\n';
    html += `<h1>${name}<h1/>\n`
    for (z = northWest.z; z <= southEast.z; z++) {
        let top_tile = slippy.lat2tile(-northWest.y, z); // eg.lat2tile(34.422, 9);
        let left_tile = slippy.lon2tile(northWest.x, z);
        let bottom_tile = slippy.lat2tile(-southEast.y, z);
        let right_tile = slippy.lon2tile(southEast.x, z);
        let width = Math.abs(left_tile - right_tile) + 1;
        let height = Math.abs(top_tile - bottom_tile) + 1;

        var total_tiles = width * height; // -> eg. 377
        //console.log(`${name}, Zoom level: ${z} - Scale ${scale.scaleFromZoom}`);
        console.log(scale.scaleFromZoomMsg(z),
            `width:${width}`, `height:${height}`, `tiles:${total_tiles}`,
            `top:${top_tile}`, `left:${left_tile}`, `bottom:${bottom_tile}`, `right:${right_tile}`);
        winston.info(`top/left:     ${slippy.tile2lon(top_tile, z)}/${slippy.tile2lat(left_tile, z)}`);
        winston.info(`bottom/right: ${slippy.tile2lon(bottom_tile, z)}/${slippy.tile2lat(right_tile, z)}`);

        html += `<h2>${scale.scaleFromZoomMsg(z)}</h2>\n<table>\n`;
        for (y = top_tile; y >= bottom_tile; y--) {
            //process.stdout.write(`${y} ${top_tile-height}\n`);
            html += "\t<tr>\n"
            for (x = left_tile; x < width + left_tile; x++) {
                let uri = `${baseUri}/${z}/${x}/${y}.png`;
                let target = `pics/${z}-${x}-${y}.png`
                fs.stat(target, function (err, stat) {
                    if (err == null) {
                        winston.info(`${target} exists, skipping`);
                        process.stdout.write("/");
                        // skipped++;
                    } else if (err.code == 'ENOENT') { // file does not exist
                        winston.info(`${target}`);
                        //process.stdout.write("±");
                        download(uri, target);
                        // downloaded++;
                        deasync.sleep(100);
                    } else {
                        console.log('Some other error: ', err.code);
                        // errors++;
                        process.stdout.write("-");
                    }
                });

                html += `\t\t<td><img src="../${target}"/></td>\n`;
            }
            html += "\t</tr>\n";
        }
        html += "<table/>\n";
    }

    html += "</table></body></html>"
    let htmlFname = `html/${name}.html`
    fs.writeFile(htmlFname, html, function () {
        console.log(`\n${htmlFname} file written\n`);
    });
    // console.log(`Downloaded: ${downloaded}`);
    // console.log(`Skipped: ${skipped}`);
    // console.log(`Errors: ${errors}`);
}

let download = function (uri, filename) {
    let options = {
        url: uri,
        headers: {
            'User-Agent': 'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405'
        }
    };

    deasync(request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            winston.info('content-type:', response.headers['content-type']);
            winston.info(', content-length:', response.headers['content-length']);
            winston.info(`${uri} -> ${filename}`);
        } else {
            console.log(`${filename} FAILED`);
            console.log('content-type:', response.headers['content-type']);
            console.log(', content-length:', response.headers['content-length']);
            console.log(body);
            fs.unlink(filename, function (err) {
                if(err){
                    console.log(`    removal of ${filename} FAILED`, `REMOVE IT MANUALLY!`);
                }
            })
            deasync.sleep(1000);
        }
    })
        .on('error', function (err) {
            console.log(`ERROR: ${filename}: ${err}`);
            console.log("Removing file if already existing");
            fs.unlink(filename, function (err) {
                if(err){
                    console.log(`    removal of ${filename} failed, probably never hit disk...`);
                }
            })


            deasync.sleep(1000);
        })
        .pipe(fs.createWriteStream(filename))
        .on('error', function (err) {
            console.log(`ERROR: ${filename}: ${err}`);
            fs.unlink(filename, function (err) {
                if(err){
                    console.log(`    removal of ${filename} FAILED`, `REMOVE IT MANUALLY!`);
                }
            })
            deasync.sleep(1000);
        })
        .on('close', function () {
            winston.info(`${filename} written`);
            process.stdout.write("+");
        }));
};

module.exports.charts = dlCharts;
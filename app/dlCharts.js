// app/dlcharts.js

let fs = require('fs');
let request = require('request');
let deasync = require('deasync');
let winston = require('winston');
winston.level = 'error';

let scale = require('./scale.js')
const slippy = require('./slippy.js')

let dlCharts = function (northWest, southEast, baseUri, name) {
    var html = '<html>\n<head>\n\t<link rel="stylesheet" type="text/css" href="style.css">\n</head>\n<body>\n';
    for (z = northWest.z; z <= southEast.z; z++) {
        let top_tile = slippy.lat2tile(-northWest.y, z); // eg.lat2tile(34.422, 9);
        let left_tile = slippy.lon2tile(northWest.x, z);
        let bottom_tile = slippy.lat2tile(-southEast.y, z);
        let right_tile = slippy.lon2tile(southEast.x, z);
        let width = Math.abs(left_tile - right_tile) + 1;
        let height = Math.abs(top_tile - bottom_tile) + 1;

        var total_tiles = width * height; // -> eg. 377
        console.log(`${name}, Zoom level: ${z}`);
        console.log(`width:${width}`, `height:${height}`, `tiles:${total_tiles}`);
        console.log(`top:${top_tile}`, `left:${left_tile}`, `bottom:${bottom_tile}`, `right:${right_tile}`);
        winston.info(`top/left:     ${slippy.tile2lon(top_tile,z)}/${slippy.tile2lat(left_tile,z)}`);
        winston.info(`bottom/right: ${slippy.tile2lon(bottom_tile,z)}/${slippy.tile2lat(right_tile,z)}`);

        html += `<h1>${scale.scaleFromZoomMsg(z)}</h1>\n<table>\n`;
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
                    } else if (err.code == 'ENOENT') { // file does not exist
                        winston.info(`${target}`);
                        //process.stdout.write("-");
                        download(uri, target);
                    } else {
                        console.log('Some other error: ', err.code);
                    }
                });

                html += `\t\t<td><img src="${target}"/></td>\n`;
            }
            html += "\t</tr>\n";
        }
        html += "<table/>\n";
    }

    html += "</table></body></html>"
    let htmlFname = `${name}.html`
    fs.writeFile(htmlFname, html, function () {
        console.log(`${htmlFname} file written`);
    });
}

let download = function (uri, filename) {
    let options = {
        url: uri,
        headers: {
            'User-Agent': 'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405'
        }
    };
        
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            winston.info('content-type:', response.headers['content-type']);
            winston.info(', content-length:', response.headers['content-length']);
            winston.info(`${uri} -> ${filename}`);
        } else {
            console.log(`${filename} FAILED`);
        }
    };
        
    deasync(request.get(options, callback)
        .on('error', function(err) {
            console.log(`ERROR: ${filename}: ${err}`);
            console.log("Removing file if already existing");
            fs.unlink(filename, function(){
                console.log(`    removal of ${filename} failed, probably never hit disk...`);
            })
        })
        .pipe(fs.createWriteStream(filename))
        .on('error', function(err) {
            console.log(`ERROR: ${filename}: ${err}`);
            fs.unlink(filename, function(){
                console.log(`    removal of ${filename} FAILED`, `REMOVE IT MANUALLY!`);
            })
        })
        .on('close', function (){
            winston.info(`${filename} written`);
            process.stdout.write("+");
        }));
};

module.exports.charts = dlCharts;
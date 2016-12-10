// app/dlcharts.js

let fs = require('fs');
let rp = require('request-promise-native');
let winston = require('winston');
winston.level = 'error';

let scale = require('./scale.js')
const slippy = require('./slippy.js')
let u = require('./utils.js')
let h = require('./HTML.js')

let cnt = 0;

let dlCharts = function (northWest, southEast, baseUri, name, picdir) {
    return new Promise(function (resolve, reject) {
        let results = [];
        let chain = new Promise(function (resolve, reject) { resolve("start") })
        var html = new h.HTMLer(name);
        html.beginFile(name);

        for (z = northWest.z; z <= southEast.z; z++) {

            let tileSet = tilesFromCoords(northWest, southEast, z);
            chain = chain.then(function (value) {
                return downloadZoomLevel(html, tileSet, baseUri, picdir)
                    .then(function (result) {
                        results.pushArrayMembers(result)
                        return result;
                    }).catch(function (result) {
                        console.log(result)
                        return result;
                    })
            })
        }
        chain.then(function (result) {
            html.endFile();
            fs.writeFile(html.fname, html.data, function () {
                console.log(`\n${html.fname} file written\n`);
            });

            console.log(name, picdir, "done!", results.length)
            resolve(results)
        })
    })
}

let tilesFromCoords = function (northWest, southEast, z) {
    let top = slippy.lat2tile(-northWest.y, z); // eg.lat2tile(34.422, 9);
    let left = slippy.lon2tile(northWest.x, z);
    let bottom = slippy.lat2tile(-southEast.y, z);
    let right = slippy.lon2tile(southEast.x, z);
    let width = Math.abs(left - right) + 1;
    let height = Math.abs(top - bottom) + 1;

    var total_tiles = width * height; // -> eg. 377

    console.log(scale.scaleFromZoomMsg(z),
        `width:${width}`, `height:${height}`, `tiles:${total_tiles}`,
        `top:${top}`, `left:${left}`, `bottom:${bottom}`, `right:${right}`);
    winston.info(`top/left:     ${slippy.tile2lon(top, z)}/${slippy.tile2lat(left, z)}`);
    winston.info(`bottom/right: ${slippy.tile2lon(bottom, z)}/${slippy.tile2lat(right, z)}`);

    return { z: z, top: top, bottom: bottom, left: left, right: right };
}

let downloadZoomLevel = function (html, tileSet, baseUri, dir) {
    return new Promise(function (resolve, reject) {
        let results = [];
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        let chain = new Promise(function (resolve, reject) { resolve("first") })
        html.beginZ(z);
        for (y = tileSet.top; y >= tileSet.bottom; y--) {
            html.beginY();
            for (x = tileSet.left; x <= tileSet.right; x++) {
                let uri = `${baseUri}/${tileSet.z}/${x}/${y}.png`;
                let fname = `${dir}/${tileSet.z}-${x}-${y}.png`;

                chain = chain.then(function (value) {
                    return downloadIfNecessary(fname, uri)
                        .then(function (result) {
                            process.stdout.write(result.status.code);
                            results.push(result)
                        }).catch(function (result) {
                            console.log(result)
                        })
                });
                html.eachX(fname)
            }
            html.endY();
        }
        html.endZ();
        chain.then(function (result) {
            console.log("Zoom:", tileSet.z, "done!")
            resolve(results)
        })
    })
}

let downloadIfNecessary = function (fname, uri) {
    return new Promise(function (resolve, reject) {
        fs.stat(fname, function (err, stat) {
            if (err == null) {
                resolve(new u.Result(uri, fname, u.Statuses.SKIPPED, ""));
            } else if (err.code == 'ENOENT') { // file does not exist
                //process.stdout.write("±");
                download(fname, uri)
                    .then(function (fname) {
                        resolve(new u.Result(uri, fname, u.Statuses.OK, ""));
                    })
                    .catch(function (err) {
                        resolve(new u.Result(uri, fname, u.Statuses.FAILED, err));
                    })
            } else {
                reject(new u.Result(uri, fname, u.Statuses.FAILED, err));
            }
        });
    });
}

let download = function (filename, uri) {
    let options = {
        url: uri,
        encoding: null,
        headers: {
            'User-Agent': 'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405'
        }
    };

    return rp.get(options)
        .then(function (body) {
            return new Promise(function (resolve, reject) {
                fs.writeFile(filename, body, function (err) {
                    if (err) reject(err);
                    else resolve(filename);
                });
            });
        })
}

module.exports.charts = dlCharts;
module.exports.downloadZoomLevel = downloadZoomLevel
module.exports.downloadIfNecessary = downloadIfNecessary;
module.exports.download = download;

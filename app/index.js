// app/index.js

let fs = require('fs');

let dl = require('./dlCharts.js')
let scale = require('./scale.js')

var charts = JSON.parse(fs.readFileSync('charts.json', 'utf8'));

// let north_edge = -56.3;
// let west_edge  =  15.4;
// let south_edge = -55.0;
// let east_edge  =  16.3;
// let startZoom  =  1;
// let endZoom    =  14;

// let northWest = new Point(west_edge, north_edge, startZoom);
// let southEast = new Point(east_edge, south_edge, endZoom);
// let name = "index";

for (i in charts) {
    let name = charts[i].name;
    let zoom = scale.zoomFromScale(parseFloat(charts[i].scale));
    let northWest = new Point(parseFloat(charts[i].west), parseFloat(charts[i].north), zoom);
    let southEast = new Point(parseFloat(charts[i].east), parseFloat(charts[i].south), zoom);



    let uri = "http://example.com/path/to/slippy/api"

    if (northWest.x > southEast.x) {
        console.log(`West coord: ${northWest.x}, east of East: ${southEast.y}`)
        process.exit(1);
    } else if (southEast.y > northWest.y) {
        console.log(`North coord: ${northWest.y}, south of South: ${southEast.y}`)
        process.exit(1);
    } else if (northWest.z > southEast.z) {
        console.log(`North/West zoom: ${northWest.z}, larger than South/East: ${southEast.z}`)
        process.exit(1);
    } else {
        console.log(`\n ${name} @ 1:${charts[i].scale}`)
        dl.charts(northWest, southEast, uri, name);
    }

    // download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function () {
    //     console.log('done');
    // });
}

function Point(lon, lat, zoom) { //x, y, z
    this.x = lon;
    this.y = lat;
    this.z = zoom;
}

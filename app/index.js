// app/index.js

let fs = require('fs');

let dl = require('./dlCharts.js')
let scale = require('./scale.js')

let settings = JSON.parse(fs.readFileSync('charts.json', 'utf8'));

let uri = settings.uri;

var indexHtml = '<html>\n<head>\n\t<link rel="stylesheet" type="text/css" href="style.css">\n</head>\n<body>\n';

for (i in settings.charts) {
    //let i=0;
    let chart = settings.charts[i];
    let name = chart.name;
    let zoom = scale.zoomFromScale(parseFloat(chart.scale));
    let northWest = new Point(parseFloat(chart.west), parseFloat(chart.north), 0);
    let southEast = new Point(parseFloat(chart.east), parseFloat(chart.south), zoom+2);

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
        console.log(`\n ${name} @ 1:${chart.scale}`)
        dl.charts(northWest, southEast, uri, name);
        indexHtml += `<a href="html/${name}.html">${name}</a><br/>`
    }
    //break;
}
indexHtml += "</table></body></html>"
let indexFname = "index.html"
fs.writeFile(indexFname, indexHtml, function () {
    console.log(`\n${indexFname} file written`);
});

function Point(lon, lat, zoom) { //x, y, z
    this.x = lon;
    this.y = lat;
    this.z = zoom;
}

let winston = require('winston');
winston.level = 'error';

let scale = require('./scale.js')

function lon2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
function lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }

 function tile2lon(x,z) {
  return (x/Math.pow(2,z)*360-180);
 }

 function tile2lat(y,z) {
  var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
 }


let tilesFromCoords = function (northWest, southEast, z) {
    let top = lat2tile(-northWest.y, z); // eg.lat2tile(34.422, 9);
    let left = lon2tile(northWest.x, z);
    let bottom = lat2tile(-southEast.y, z);
    let right = lon2tile(southEast.x, z);
    let width = Math.abs(left - right) + 1;
    let height = Math.abs(top - bottom) + 1;

    var total_tiles = width * height; // -> eg. 377

    console.log(scale.scaleFromZoomMsg(z),
        `width:${width}`, `height:${height}`, `tiles:${total_tiles}`,
        `top:${top}`, `left:${left}`, `bottom:${bottom}`, `right:${right}`);
    winston.info(`top/left:     ${tile2lon(top, z)}/${tile2lat(left, z)}`);
    winston.info(`bottom/right: ${tile2lon(bottom, z)}/${tile2lat(right, z)}`);

    return { z: z, top: top, bottom: bottom, left: left, right: right };
}

module.exports.lon2tile = lon2tile
module.exports.lat2tile = lat2tile
module.exports.tile2lon = tile2lon
module.exports.tile2lat = tile2lat
module.exports.tilesFromCoords = tilesFromCoords
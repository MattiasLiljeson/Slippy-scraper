let fs = require('fs');

let dl = require('../app/dlCharts.js')
let u = require('../app/utils.js')

const uri = "https://www.google.se/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png"
const baseuri = "http://example.com/path/to/test/api"

let createDir = function(dir){
    if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
} 

/////////////////////

let testCharts = function() {
    let nw = new u.Point(16,56,9)
    let se = new u.Point(17,55,10)
    console.log("begin")
    dl.charts( nw, se, baseuri, "test", "temp")
        .then(function (asd) { console.log("end of p / start then"); return asd; })
        .then(function (asd) { console.log(asd); return asd; })
        .then(function (asd) { console.log("end of then / start catch"); return asd; })
        .catch(function (err) { console.log("Error!", err); return err; })
        .then(function (asd) { console.log("after catch")})
    console.log("end")
}

let testDownloadZoomLevel = function() {
    let html = ""
    let tileSet = { z : 4, top : 4, bottom : 3, left : 2, right : 4 };
    console.log("begin")
    dl.downloadZoomLevel(html, tileSet, baseuri, "temp")
        .then(function (asd) { console.log("end of p / start then"); return asd; })
        .then(function (asd) { console.log(asd); return asd; })
        .then(function (asd) { console.log("end of then / start catch"); return asd; })
        .catch(function (err) { console.log("Error!", err); return err; })
        .then(function (asd) { console.log("after catch")})
    console.log("end")
}

let testDownloadIfNecessary = function() {
    createDir("temp")
    console.log("begin")
    dl.downloadIfNecessary("temp/test.png", uri)
        .then(function (asd) { console.log("end of p / start then"); return asd; })
        .then(function (asd) { console.log(asd); return asd; })
        .then(function (asd) { console.log("end of then / start catch"); return asd; })
        .catch(function (err) { console.log("Error!", err); return err; })
        .then(function (asd) { console.log("after catch")})
    console.log("end")
}

let testDownload = function () {
    createDir("temp")
    console.log("begin")
    dl.download("temp/test.png",uri)
        .then(function (asd) { console.log("end of p / start then"); return asd; })
        .then(function (asd) { console.log(asd); return asd; })
        .then(function (asd) { console.log("end of then / start catch"); return asd; })
        .catch(function (err) { console.log("Error!", err); return err; })
        .then(function (asd) { console.log("after catch") })
    console.log("end")
}

testCharts();
//testDownloadZoomLevel();
//testDownloadIfNecessary();
//testDownload();

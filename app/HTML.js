let scale = require('./scale.js')

function HTMLer(fname){
    this.data = "";
    this.fname = `html/${fname}.html`;
}

HTMLer.prototype.beginFile = function(name){
    this.data = '<html>\n<head>\n'
    this.data += '\t<link rel="stylesheet" type="text/css" href="../style.css">\n'
    this.data += '</head>\n'
    this.data += '<body>\n';
    this.data += `<h1>${name}<h1/>\n`
}

HTMLer.prototype.endFile = function() {
    this.data += "</table></body></html>";
}

HTMLer.prototype.beginZ = function (z) {
    this.data += `<h2>${scale.scaleFromZoomMsg(z)}</h2>\n<table>\n`;
}

HTMLer.prototype.endZ = function () {
    this.data += "<table/>\n";
}

HTMLer.prototype.beginY = function(){
    this.data += "\t<tr>\n";
}

HTMLer.prototype.endY = function(){
    this.data += "\t</tr>\n";
}

HTMLer.prototype.eachX = function(fname){
    this.data += `\t\t<td><img src="../${fname}"/></td>\n`;
}

module.exports.HTMLer = HTMLer;
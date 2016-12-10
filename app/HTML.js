function HTML(fname){
    this.data = "";
    this.fname = `html/${fname}.html`;
}

HTML.beginFile = function(name){
    this.data = '<html>\n<head>\n'
    this.data += '\t<link rel="stylesheet" type="text/css" href="../style.css">\n'
    this.data += '</head>\n'
    this.data += '<body>\n';
    this.data += `<h1>${name}<h1/>\n`
}

HTML.endFile = function() {
    this.data += "</table></body></html>";
}

HTML.beginZ = function (z) {
    this.data += `<h2>${scale.scaleFromZoomMsg(z)}</h2>\n<table>\n`;
}

HTML.endZ = function () {
    this.data += "<table/>\n";
}

HTML.beginY = function(){
    this.data += "\t<tr>\n";
}

HTML.endY = function(){
    this.data += "\t</tr>\n";
}

HTML.eachX = function(fname){
    this.data += `\t\t<td><img src="../${fname}"/></td>\n`;
}
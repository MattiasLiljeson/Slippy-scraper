// app/scale.js

let winston = require('winston');
winston.level = 'error';

module.exports.scaleFromZoomMsg = function(zoom){
    let msg = `Zoom: ${zoom}, Skala: `;
    switch(zoom){
        case 0:  return msg+"1:500 million";
        case 1:  return msg+"1:250 million";
        case 2:  return msg+"1:150 million";
        case 3:  return msg+"1:70 million";
        case 4:  return msg+"1:35 million";
        case 5:  return msg+"1:15 million";
        case 6:  return msg+"1:10 million";
        case 7:  return msg+"1:4 million";
        case 8:  return msg+"1:2 million";
        case 9:  return msg+"1:1 million";
        case 10: return msg+"1:500,000";
        case 11: return msg+"1:250,000";
        case 12: return msg+"1:150,000";
        case 13: return msg+"1:70,000";
        case 14: return msg+"1:35,000";
        case 15: return msg+"1:15,000";
        case 16: return msg+"1:8,000";
        case 17: return msg+"1:4,000";
        case 18: return msg+"1:2,000";
        case 19: return msg+"1:1,000";
    }
}

module.exports.zoomFromScale = function(scale){
    if(scale in zoomLut){
        return zoomLut[scale];
    } else {
        for( key in zoomLut){
            winston.info(key)
            if( parseInt(scale) < parseInt(key) ){
                console.log(scale, "->", key)
                return zoomLut[key];
            }
        }
        winston.error(`scale level: ${scale} is not good number, must be between 1000 and 500000000`);
        return -1;
    }
}

const zoomLut = {
        "1000" :      "19",
        "2000" :      "18",
        "4000" :      "17",
        "8000" :      "16",
        "15000" :     "15",
        "35000" :     "14",
        "70000" :     "13",
        "150000" :    "12",
        "250000" :    "11",
        "500000" :    "10",
        "1000000" :   "9",
        "2000000" :   "8",
        "4000000" :   "7",
        "10000000" :  "6",
        "15000000" :  "5",
        "35000000" :  "4",
        "70000000" :  "3",
        "150000000" : "2",
        "250000000" : "1",
        "500000000" : "0"
}

module.exports.scaleFromZoom = function(z){
    if(z in scaleLut){
        return scaleLut[z];
    } else {
        winston.error(`zoom level: ${z} is not good number, must be between 0 and 19`);
        return -1;
    }
}

const scaleLut = {
        "0":  "500000000",
        "1":  "250000000",
        "2":  "150000000",
        "3":  "70000000",
        "4":  "35000000",
        "5":  "15000000",
        "6":  "10000000",
        "7":  "4000000",
        "8":  "2000000",
        "9":  "1000000",
        "10": "500000",
        "11": "250000",
        "12": "150000",
        "13": "70000",
        "14": "35000",
        "15": "15000",
        "16": "8000",
        "17": "4000",
        "18": "2000",
        "19": "1000"
}
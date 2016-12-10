////
var push_apply = Function.apply.bind([].push);
var slice_call = Function.call.bind([].slice);
Object.defineProperty(Array.prototype, "pushArrayMembers", {
    value: function() {
        for (var i = 0; i < arguments.length; i++) {
            var to_add = arguments[i];
            for (var n = 0; n < to_add.length; n+=300) {
                push_apply(this, slice_call(to_add, n, n+300));
            }
        }
    }
});
// and use it like this:
// array1.pushArrayMembers(array2, array3);
/////

function Result(uri, fname, status, message){
    this.uri = uri;
    this.fname = fname;
    this.status = status;
    this.message = message;
}

function Point(lon, lat, zoom) { //x, y, z
    this.x = lon;
    this.y = lat;
    this.z = zoom;
}

const Statuses = {
    FAILED  : { value: 0, name: "Failed",  code: '-'},
    SKIPPED : { value: 1, name: "Skipped", code: '/'},
    OK      : { value: 2, name: "Ok",      code: '+'}
}


module.exports.Result   = Result;
module.exports.Point    = Point;
module.exports.Statuses = Statuses;
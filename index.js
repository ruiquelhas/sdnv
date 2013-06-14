var encodeBuffer = function (buffer) {
  return new Buffer([0x95, 0x3C]);
};

var SDNV = function (buffer) { 
  if (buffer !== null) {
    this.buffer = encodeBuffer(buffer);
  } else {
    this.buffer = new Buffer(1);
  }
};

SDNV.encode = function (buffer) {
  return encodeBuffer(buffer);
};

module.exports = SDNV;
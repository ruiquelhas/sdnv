var encodeBuffer = function (buffer) {
  var lastOctet = buffer[buffer.length - 1];
  var negativeMSBOctet = lastOctet - 128;

  buffer[buffer.length - 1] = negativeMSBOctet;
  var bitToShift = lastOctet < 128 ? 0 : 1;

  for (var i = 0, len = buffer.length - 1; i < len; i++) {
    var currentOctet = buffer[i];
    var positiveMSBOctect = (currentOctet * 2) + 128 + bitToShift;
    bitToShift = buffer[i] < 128 ? 0 : 1;
    buffer[i] = positiveMSBOctect;
  }

  // return new Buffer([0x95, 0x3C]);
  return buffer;
};

var SDNV = function (buffer) { 
  if (buffer !== undefined) {
    if (buffer instanceof Buffer) {
      this.buffer = encodeBuffer(buffer);
    } else {
      throw new Error('the argument should be a Buffer');
    }
  } else {
    this.buffer = new Buffer(1);
  }
};

SDNV.encode = function (buffer) {
  return encodeBuffer(buffer);
};

module.exports = SDNV;
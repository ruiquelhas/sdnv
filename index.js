var encodeBuffer = function (buffer) {
  var bufferCopy = new Buffer(buffer.length);
  buffer.copy(bufferCopy);

  var lastOctet = bufferCopy[bufferCopy.length - 1];
  var negativeMSBOctet = lastOctet - 128;

  bufferCopy[bufferCopy.length - 1] = negativeMSBOctet;
  var bitToShift = lastOctet < 128 ? 0 : 1;

  for (var i = 0, len = bufferCopy.length - 1; i < len; i++) {
    var currentOctet = bufferCopy[i];
    var positiveMSBOctect = (currentOctet * 2) + 128 + bitToShift;
    bitToShift = bufferCopy[i] < 128 ? 0 : 1;
    bufferCopy[i] = positiveMSBOctect;
  }

  return bufferCopy;
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
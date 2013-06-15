var OCTET_DESCRIPTION_SIZE = 128;

var isSingleOctect = function (buffer) { 
  return buffer.length < 2; 
};

var hasMSBEqualToZero = function(buffer) { 
  return buffer[0] < OCTET_DESCRIPTION_SIZE; 
};

var encodeBuffer = function (buffer) {
  var bufferCopy = new Buffer(buffer.length);
  buffer.copy(bufferCopy);

  // best case scenario (single octet with MSB = 0)
  if (isSingleOctect(bufferCopy) && hasMSBEqualToZero(bufferCopy)) {
    return bufferCopy;
  }

  // worst case scenario (single octet with MSB = 1)
  if (isSingleOctect(bufferCopy) && !hasMSBEqualToZero(bufferCopy)) {
    return new Buffer([0x7F]);
  }

  return new Buffer([0x7F]);

  // var lastOctet = bufferCopy[bufferCopy.length - 1];
  // var negativeMSBOctet = lastOctet - 128;
  // bufferCopy[bufferCopy.length - 1] = negativeMSBOctet;
  // var bitToShift = lastOctet < 128 ? 0 : 1;
  // for (var i = 0, len = bufferCopy.length - 1; i < len; i++) {
  //   var currentOctet = bufferCopy[i];
  //   var positiveMSBOctect = (currentOctet * 2) + 128 + bitToShift;
  //   bitToShift = bufferCopy[i] < 128 ? 0 : 1;
  //   bufferCopy[i] = positiveMSBOctect;
  // }
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
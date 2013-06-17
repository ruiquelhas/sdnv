var OCTET_MSB_VALUE = 128;

var getBufferCopy = function (buffer) {
  var result = new Buffer(buffer.length);
  buffer.copy(result);
  return result;
};

var getBufferLessSignicantSevenBits = function(buffer) {
  return (
    buffer[buffer.length - 1] >= OCTET_MSB_VALUE ?
    buffer[buffer.length - 1] - OCTET_MSB_VALUE :
    buffer[buffer.length - 1]
  );
};

var getBufferDecimalValue = function(buffer) {
  if (buffer.length < 2) {
    return buffer.readUInt8(0);
  }
  if (buffer.length < 3) {
    return buffer.readUInt16BE(0);
  }
  return buffer.readUInt32BE(0);
};

var encodeBuffer = function (buffer) {
  var bufferCopy = getBufferCopy(buffer);
  var x = getBufferLessSignicantSevenBits(bufferCopy);
  var y = getBufferDecimalValue(bufferCopy) >>> 7;
  
  if (y === 0) return new Buffer([x]);

  var z = OCTET_MSB_VALUE | getBufferLessSignicantSevenBits(new Buffer([y]));
  var remaining = new Buffer([z, x]);
  
  y = y >>> 7;
  if (y === 0) return remaining;
  
  return encodeBuffer(remaining);
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
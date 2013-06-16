var MSB_VALUE = 128;

var getBufferCopy = function (buffer) {
  var result = new Buffer(buffer.length);
  buffer.copy(result);
  return result;
};

var getBufferLessSignicantSevenBits = function(buffer) {
  return (
    buffer[buffer.length - 1] >= MSB_VALUE ?
    buffer[buffer.length - 1] - MSB_VALUE :
    buffer[buffer.length - 1]
  );
};

var getBufferDecimalValue = function(buffer) {
  var value = 0;
  for (var i = 0, len = buffer.length; i < len; i++) {
    value = value + buffer[i];
  }
  return value;
};

var encodeBuffer = function (buffer, carry) {
  var bufferCopy = getBufferCopy(buffer), result;
  var x = getBufferLessSignicantSevenBits(bufferCopy);
  var y = carry || getBufferDecimalValue(bufferCopy) >>> 7;

  if (y === 0) {
    result = new Buffer([x]);
  } else {
    var z = MSB_VALUE | getBufferLessSignicantSevenBits(new Buffer([y]));
    
    y = y >>> 7;
    if (y === 0) {
      result = new Buffer([z, x]);
    } else {
      result = encodeBuffer(remaining, y >>> 7);
    }
  }

  return result;
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
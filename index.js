var Transform = require('stream').Transform;

var OCTET_MSB_VALUE = 128;
var OCTET_SHIFT_SIZE = 7;
var HIGH_ORDER_VALUE = 64;
var OCTET_OVERFLOW = 256;
var DOUBLE_OCTET_OVERFLOW = 65536;

var INVALID_INPUT_ERROR = 'the argument should be a Buffer';

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
  var y = getBufferDecimalValue(bufferCopy) >> OCTET_SHIFT_SIZE;
  
  if (y === 0) return new Buffer([x]);

  var z = OCTET_MSB_VALUE | getBufferLessSignicantSevenBits(new Buffer([y]));
  var remaining = new Buffer([z, x]);
  
  y = y >> OCTET_SHIFT_SIZE;
  if (y === 0) return remaining;
  
  return encodeBuffer(remaining);
};

var getVariableLengthBuffer = function (decimalValue) {
  var buffer;

  if (decimalValue < OCTET_OVERFLOW) {
    buffer = new Buffer(1);
    buffer.writeUInt8(decimalValue, 0);
    return buffer;
  }

  if (decimalValue < DOUBLE_OCTET_OVERFLOW) {
    buffer = new Buffer(2);
    buffer.writeUInt16BE(decimalValue, 0);
    return buffer;
  }

  buffer = new Buffer(4);
  buffer.writeUInt32BE(decimalValue, 0);
  return buffer;
};

var decodeBuffer = function (buffer) {
  var bufferCopy = getBufferCopy(buffer), result = 0;
  
  var sweep = function (index) {
    result = result << OCTET_SHIFT_SIZE;
    var octetAsBuffer = new Buffer([bufferCopy[index]]);
    var lowOrderWord = getBufferLessSignicantSevenBits(octetAsBuffer);
    result = result + lowOrderWord;
    if (lowOrderWord >= HIGH_ORDER_VALUE || index === bufferCopy.length - 1) {
      return getVariableLengthBuffer(result);
    }
    return sweep(index + 1);
  };

  return sweep(0);
};

var isSupported = function (input) {
  return (
    typeof input !== 'undefined' &&
    input !== undefined && (
      input instanceof Buffer
    ) 
  );
};

var getTransformStream = function (fn) {
  var stream = new Transform();
  stream._transform = function(chunk, encoding, done) {
    stream.push(fn(chunk));
    done();
  };
  return stream;
};

var SDNV = function (input) {
  var self;
  
  if (isSupported(input)) {
    self = encodeBuffer(input);
  } else {
    throw new Error(INVALID_INPUT_ERROR);
  }

  self.decode = function () {
    return decodeBuffer(self);
  }

  return self;
};


// Class methods (utility functions)

SDNV.encode = function (input) {
  if (isSupported(input)) {
    return encodeBuffer(input);
  }
  throw new Error(INVALID_INPUT_ERROR);
};

SDNV.decode = function (input) {
  if (isSupported(input)) {
    return decodeBuffer(input);
  }
  throw new Error(INVALID_INPUT_ERROR);
};

SDNV.createReadStream = function () {
  return getTransformStream(encodeBuffer);
};

SDNV.createWriteStream = function () {
  return getTransformStream(decodeBuffer);
};

module.exports = SDNV;
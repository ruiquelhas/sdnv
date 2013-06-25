var 
  test = require('tap').test,
  Stream = require('stream'),
  SDNV = require('../index');

test('make sure a valid buffer results in a valid SNDV', function (t) {
  var buffer = new Buffer([0x0A, 0xBC]), sdnv = new SDNV(buffer);
  t.type(sdnv, "Buffer", 'should contain buffer data');
  t.end();
});

test('make sure the encoding works', function (t) {
  var runAssertions = function(input, output, ct) {
    // setup environment
    var sdnv = new SDNV(input);
    var encodedBuffer = SDNV.encode(input);
    // test the instance variable
    ct.equal(sdnv.toString('hex'), output.toString('hex'), 
      'the SDNV buffer should match the expected');
    // test the utility method
    ct.equal(encodedBuffer.toString('hex'), output.toString('hex'), 
      'the encoded buffer by the utility method should match the expected');
    ct.end();
  };
  t.test('for the 8-bit best case scenario', function(ct) {
    runAssertions(new Buffer([0x7F]), new Buffer([0x7F]), ct);
  });
  t.test('for the 8-bit worst case scenario', function (ct) {
    runAssertions(new Buffer([0x8F]), new Buffer([0x81, 0x0F]), ct);
  });
  t.test('for a high 16-bit value scenario', function (ct) {
    runAssertions(new Buffer([0x12, 0x34]), new Buffer([0xA4, 0x34]), ct);
  });
  t.test('for a low 16-bit value scenario', function (ct) {
    runAssertions(new Buffer([0x0A, 0xBC]), new Buffer([0x95, 0x3C]), ct);
  });
  t.end();
});

test('make sure the decoding works', function (t) {
  var runAssertions = function (fstInput, sndInput, output, ct) {
    // setup environment
    var sdnv = new SDNV(fstInput);
    var decodedFromSDNV = sdnv.decode();
    var decodedFromUtility = SDNV.decode(sndInput);
    // test the instance method
    ct.equal(decodedFromSDNV.toString('hex'), output.toString('hex'),
      'the decoded SDNV buffer should match the expected');
    // test the utility method
    ct.equal(decodedFromUtility.toString('hex'), output.toString('hex'),
      'the decoded buffer returned by the utility should match the expected');
    ct.end();
  };
  t.test('for the 8-bit best case scenario', function (ct) {
    runAssertions(new Buffer([0x7F]), new Buffer([0x7F]), new Buffer([0x7F]), ct);
  });
  t.test('for the 8-bit worst case scenario', function (ct) {
    runAssertions(new Buffer([0x8F]), new Buffer([0x81, 0x0F]), new Buffer([0x8F]), ct);
  });
  t.test('for a high 16-bit value scenario', function (ct) {
    runAssertions(new Buffer([0x12, 0x34]), new Buffer([0xA4, 0x34]), new Buffer([0x12, 0x34]), ct);
  });
  t.test('for a low 16-bit value scenario', function (ct) {
    runAssertions(new Buffer([0x0A, 0xBC]), new Buffer([0x95, 0x3C]), new Buffer([0x0A, 0xBC]), ct);
  });
  t.end();
});

test('make sure the encoding works when piping a readable stream', function (t) {
  var runAssertions = function (input, output, ct) {
    var src = new Stream();
    var encoder = SDNV.createReadStream();
    src.pipe(encoder);
    encoder.on('readable', function () {
      ct.equal(encoder.read().toString('hex'), output.toString('hex'), 
        'the emitted data buffer should match the expected');
      ct.end();
    });
    src.emit('data', input);
    src.emit('end');
  };
  t.test('for the 8-bit best case scenario', function (ct) {
    runAssertions(new Buffer([0x7F]), new Buffer([0x7F]), ct);
  });
  t.test('for the 8-bit worst case scenario', function (ct) {
    runAssertions(new Buffer([0x8F]), new Buffer([0x81, 0x0F]), ct);
  });
  t.test('for a high 16-bit value scenario', function (ct) {
    runAssertions(new Buffer([0x12, 0x34]), new Buffer([0xA4, 0x34]), ct);
  });
  t.test('for a low 16-bit value scenario', function (ct) {
    runAssertions(new Buffer([0x0A, 0xBC]), new Buffer([0x95, 0x3C]), ct);
  });
  t.end();
});

test('make sure the decoding works when piping a writable stream', function (t) {
  t.end();
});
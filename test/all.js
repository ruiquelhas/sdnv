var 
  test = require('tap').test,
  SDNV = require('../index');

test('make sure a valid buffer results in a valid SNDV', function (t) {
  var buffer = new Buffer([0x0A, 0xBC]), sdnv = new SDNV(buffer);
  t.ok(sdnv instanceof SDNV, 'should be able to create an SDNV instance');
  t.type(sdnv.buffer, "Buffer", 'should contain buffer data');
  t.end();
});

test('make sure the SDNV is valid when no buffer is passed', function (t) {
  var sdnv = new SDNV(), expectedBuffer = new Buffer(1);
  t.ok(sdnv instanceof SDNV, 'empty buffer should result in a default SDNV');
  t.type(sdnv.buffer, "Buffer", 'default SDNV should contain buffer data');
  t.end();
});

test('make sure the encoding works', function (t) {
  var runAssertions = function(input, output, ct) {
    // setup environment
    var sdnv = new SDNV(input);
    var encodedBuffer = SDNV.encode(input);
    // test the instance variable
    ct.equal(sdnv.buffer.toString('hex'), output.toString('hex'), 
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
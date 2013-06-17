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
    var buffer = input;
    var sdnv = new SDNV(buffer);
    var encodedBuffer = SDNV.encode(buffer);
    var expectedBuffer = output;
    // test the instance variable
    ct.equal(sdnv.buffer.toString('hex'), expectedBuffer.toString('hex'), 
      'the SDNV buffer should match the expected');
    // test the utility method
    ct.equal(encodedBuffer.toString('hex'), expectedBuffer.toString('hex'), 
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
  // t.test('for a low 16-bit value scenario', function (ct) {
  //   runAssertions(new Buffer([0x0A, 0xBC]), new Buffer([0xA4, 0x34]), ct);
  // });
  t.end();
});

test('make sure the decoding works', function (t) {
  t.end();
});
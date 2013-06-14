var 
  test = require('tap').test,
  SDNV = require('../index');

var 
  buff = new Buffer([0x0A, 0xBC]), 
  sdnv = new SDNV(buff);

test('make sure a valid buffer results in a valid SNDV', function (t) {
  t.ok(sdnv instanceof SDNV, 'should be able to create an SDNV instance');
  t.type(sdnv.buffer, "Buffer", 'should contain buffer data');
  t.end();
});

test('make sure the SDNV is valid when no buffer is passed', function (t) {
  var emptyBufferSDNV = new SDNV(), expectedBuffer = new Buffer(1);
  t.ok(emptyBufferSDNV instanceof SDNV, 'empty buffer should result ' + 
    'in a default SDNV');
  t.type(emptyBufferSDNV.buffer, "Buffer", 'default SDNV should contain ' +
    'buffer data');
  t.end();
});

test('make sure the encoding works', function (t) {
  var encoded = SDNV.encode(buff), expected = new Buffer([0x95, 0x3C]);
  // test the sdnv contents
  t.equal(sdnv.buffer.toString('hex'), expected.toString('hex'), 
    'the SDNV buffer should match the expected one');
  // test the utility method
  t.equal(encoded.toString('hex'), expected.toString('hex'), 
    'the encoded buffer by the utility method should match the expected one');
  t.end();
});

test('make sure the decoding works', function (t) {
  t.end();
});
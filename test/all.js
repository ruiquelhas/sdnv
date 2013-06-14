var test = require('tap').test;
var SDNV = require('../index');

var buff = new Buffer([0x0A, 0xBC]);
var sdnv = new SDNV(buff);

test('make sure the SDNV is valid', function (t) {
  t.ok(sdnv instanceof SDNV, 'should be able to create an SDNV instance');
  t.ok(sdnv.buffer instanceof Buffer, 'should contain buffer data');
  t.end();
});

test('make sure the encoding works', function (t) {
  var encoded = SDNV.encode(buff), expected = new Buffer([0x95, 0x3C]);
  // test the sdnv contents
  t.equal(sdnv.buffer.toString(), expected.toString(), 'the sdnv buffer \
    should match the expected one');
  // test the utility method
  t.equal(encoded.toString(), expected.toString(), 'the encoded buffer by \
    the utility method should match the expected one');
  t.end();
});

test('make sure the decoding works', function (t) {
  t.end();
});
var test = require('tap').test;
var SDNV = require('../index');

var buff = new Buffer(4);
var sdnv = new SDNV(buff);

test('make sure the SDNV is valid', function (t) {
  t.ok(sdnv instanceof SDNV, 'should be able to create an SDNV instance');
  t.ok(sdnv.buffer instanceof Buffer, 'should contain buffer data');
  t.equal(sdnv.buffer, buff, 'should contain the buffer given as paramater');
  t.end();
});

test('make sure the encoding works', function (t) {
  t.end();
});

test('make sure the decoding works', function (t) {
  t.end();
});
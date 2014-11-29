var test = require('tap').test;
var Stream = require('stream');

var SDNV = require('../');

var sdnv, decoded, encoded, encoder, decoder, source;

var testVector = {
  eightBitBestCase: {
    decoded: new Buffer([0x7F]),
    encoded: new Buffer([0x7F])
  },
  eightBitWorstCase: {
    decoded: new Buffer([0x8F]),
    encoded: new Buffer([0x81, 0x0F])
  },
  highSixteenBitCase: {
    decoded: new Buffer([0x12, 0x34]),
    encoded: new Buffer([0xA4, 0x34])
  },
  lowSixteenBitCase: {
    decoded: new Buffer([0x0A, 0xBC]),
    encoded: new Buffer([0x95, 0x3C])
  }
};

var setUp = function (options) {
  sdnv = new SDNV(options.decoded);
  encoded = SDNV.encode(options.decoded);
  decoded = SDNV.decode(options.encoded);
  encoder = SDNV.createEncodeStream();
  decoder = SDNV.createDecodeStream();
  source = new Stream();
};

var emitAndClose = function (aStream, data) {
  aStream.emit('data', data);
  aStream.emit('end');
};

var sweepTestVector = function (t, assert) {
  t.test('for the 8-bit best case scenario', function (t) {
    assert(t, testVector.eightBitBestCase);
  });

  t.test('for the 8-bit worst case scenario', function (t) {
    assert(t, testVector.eightBitWorstCase);
  });

  t.test('for a high 16-bit value scenario', function (t) {
    assert(t, testVector.highSixteenBitCase);
  });

  t.test('for a low 16-bit value scenario', function (t) {
    assert(t, testVector.lowSixteenBitCase);
  });
};

test('make sure a valid buffer results in a valid SNDV', function (t) {
  sweepTestVector(t, function (t, options) {
    setUp(options);
    t.type(sdnv, 'Buffer', 'should contain buffer data');
    t.end();
  });
});

test('make sure the encoding works on regular Buffer objects', function (t) {
  sweepTestVector(t, function (t, options) {
    setUp(options);

    t.test('with the encoding wrapper', function (t) {
      t.equal(sdnv.toString('hex'), options.encoded.toString('hex'),
        'the buffer wrapped by the SDNV should match the expected');
      t.end();
    });

    t.test('with the encoding utility method', function (t) {
      t.equal(encoded.toString('hex'), options.encoded.toString('hex'),
        'the buffer encoded by the utility method should match the expected');
      t.end();
    });
  });
});

test('make sure the decoding works on regular Buffer objects', function (t) {
  sweepTestVector(t, function (t, options) {
    setUp(options);

    t.test('with the encoding wrapper', function (t) {
      t.equal(sdnv.decode().toString('hex'), options.decoded.toString('hex'),
        'the buffer decoded by the instance method should match the expected');
      t.end();
    });

    t.test('with the encoding utility method', function (t) {
      t.equal(decoded.toString('hex'), options.decoded.toString('hex'),
        'the buffer decoded by the utility method should match the expected');
      t.end();
    });
  });
});

test('make sure the encoding works when reading from a stream', function (t) {
  sweepTestVector(t, function (t, options) {
    setUp(options);

    encoder.on('data', function (buff) {
      t.equal(buff.toString('hex'), options.encoded.toString('hex'),
        'the emitted data buffer should match the expected');
      t.end();
    });
    source.pipe(encoder);

    emitAndClose(source, options.decoded);
  });
});

test('make sure the decoding works when reading from a stream', function (t) {
  sweepTestVector(t, function (t, options) {
    setUp(options);

    decoder.on('data', function (buff) {
      t.equal(buff.toString('hex'), options.decoded.toString('hex'),
        'the emitted data buffer should match the expected');
      t.end();
    });
    source.pipe(decoder);

    emitAndClose(source, options.encoded);
  });
});

test('make sure the output matches the input when piping streams', function (t) {
  sweepTestVector(t, function (t, options) {
    setUp(options);

    decoder.on('data', function (buff) {
      t.equal(buff.toString('hex'), options.decoded.toString('hex'),
        'the emitted data buffer should match the expected');
      t.end();
    });
    source.pipe(encoder).pipe(decoder);

    emitAndClose(source, options.decoded);
  });
});

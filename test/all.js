var 
  test = require('tap').test,
  Stream = require('stream'),
  SDNV = require('../index');

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

var tearDown = function (over, planned) {
  if (arguments.length === 0 || over === planned) {
    source = null;
    decoder = null;
    encoder = null;
    decoded = null;
    encoded = null;
    sdnv = null;
  }
};

var sweepTestVector = function (t, assert) {
  t.plan(4);
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
    t.plan(1);
    setUp(options);
    t.type(sdnv, "Buffer", 'should contain buffer data');
    tearDown();
  });
});

test('make sure the encoding works on regular Buffer objects', function (t) {
  sweepTestVector(t, function (t, options) {
    var testNumber = 0, testPlan = 2;
    t.plan(testPlan);
    setUp(options);
    t.test('with the encoding wrapper', function (t) {
      t.plan(1);
      t.equal(sdnv.toString('hex'), options.encoded.toString('hex'),
        'the buffer wrapped by the SDNV should match the expected');
      testNumber += 1;
      tearDown(testNumber, testPlan);
    });
    t.test('with the encoding utility method', function (t) {
      t.plan(1);
      t.equal(encoded.toString('hex'), options.encoded.toString('hex'), 
        'the buffer encoded by the utility method should match the expected');
      testNumber += 1;
      tearDown(testNumber, testPlan);
    });
  });
});

test('make sure the decoding works on regular Buffer objects', function (t) {
  sweepTestVector(t, function (t, options) {
    var testNumber = 0, testPlan = 2;
    t.plan(testPlan);
    setUp(options);
    t.test('with the encoding wrapper', function (t) {
      t.plan(1);
      t.equal(sdnv.decode().toString('hex'), options.decoded.toString('hex'),
        'the buffer decoded by the instance method should match the expected');
      testNumber += 1;
      tearDown(testNumber, testPlan);
    });
    t.test('with the encoding utility method', function (t) {
      t.plan(1);
      t.equal(decoded.toString('hex'), options.decoded.toString('hex'), 
        'the buffer decoded by the utility method should match the expected');
      testNumber += 1;
      tearDown(testNumber, testPlan);
    });
  });
});

test('make sure the encoding works when piping a stream', function (t) {
  sweepTestVector(t, function (t, options) {
    setUp(options);
    source.pipe(encoder);
    encoder.on('readable', function () {
      t.plan(1);
      t.equal(encoder.read().toString('hex'), options.encoded.toString('hex'), 
        'the emitted data buffer should match the expected');
    });
    source.emit('data', options.decoded);
    source.emit('end');
    // this ensures all the events are emitted before tearDown
    tearDown();
  });
});

test('make sure the decoding works when piping a stream', function (t) {
  sweepTestVector(t, function (t, options) {
    setUp(options);
    source.pipe(decoder);
    decoder.on('readable', function () {
      t.plan(1);
      t.equal(decoder.read().toString('hex'), options.decoded.toString('hex'), 
        'the emitted data buffer should match the expected');
    });
    source.emit('data', options.encoded);
    source.emit('end');
    // this ensures all the events are emitted before tearDown
    tearDown();
  });
});
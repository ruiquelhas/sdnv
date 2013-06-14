module.exports = function (buffer) { 
  if (buffer !== null) {
    this.buffer = buffer;
  } else {
    this.buffer = new Buffer(1);
  }
};
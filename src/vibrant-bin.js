'use strict';

var Vibrant = require('node-vibrant');

var argv = require('yargs')
  .usage('Usage: $0 image')
  .boolean('hex')
  .default('quality', 5) // with 1 being highest but slowest
  .default('colors', 64)

  .demand(1)
  .argv;

var file = argv._.pop();
var vibrant = new Vibrant(file, {
  quality: argv.quality,
  colors: argv.colors
});

vibrant.getSwatches(function(err, swatches) {
  if (err) {
    console.log(err);
  }
  else {
    report(swatches, argv);
  }
});

function report(swatches, opts) {
  var hexer = require('rgb-hex');
  Object.keys(swatches).forEach(function(key) {
    var swatch = swatches[key];

    if (swatch) {
      var color = opts.hex ? '#' + hexer.apply(this, swatch.rgb) : swatch.rgb ;

      console.log(key + ': ' + color)
    }
  });
}

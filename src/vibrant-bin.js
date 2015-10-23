'use strict';

var Vibrant = require('node-vibrant');

var argv = require('yargs')
  .usage('Usage: $0 image')
  .boolean('hex')
  .boolean('output-palette')
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
  console.log('\nPalettes');
  console.log('---------');
  Object.keys(swatches).forEach(function(key) {
    var swatch = swatches[key];

    if (swatch) {
      var color = opts.hex ? '#' + hexer.apply(this, swatch.rgb) : swatch.rgb ;

      console.log(key + ': ' + color)
    }
  });

  if (opts['output-palette']) {
    var path = require('path');

    var outputFile = path.basename(file, path.extname(file)) + '-palette.png';
    console.log('\nWriting palette to ' + outputFile);
    createPaletteImage(swatches, outputFile);
  }
}

function createPaletteImage(swatches, filename) {
  var fs = require('fs');
  var Canvas = require('canvas');
  var cwidth = 900;
  var cheight = 200;
  var canvas = new Canvas(cwidth, cheight);
  var ctx = canvas.getContext('2d');

  var existant = Object.keys(swatches).filter(function(key) {
    return !!swatches[key];
  });

  var width = cwidth / existant.length;
  existant.forEach(function(key, index) {
    var swatch = swatches[key];

    ctx.fillStyle = 'rgb(' + swatch.rgb.join(',') + ')';
    ctx.fillRect(width*index, 0, width, cheight);

    return false;
  });

  var outfile = fs.createWriteStream(filename);
  canvas.pngStream().on('data', function(chunk) {
    outfile.write(chunk);
  });
}

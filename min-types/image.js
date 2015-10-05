var ImageMin = require('imagemin');

module.exports = function (content, opts, callback, helper) {


  opts = helper.extend({

    interlaced: true,  // gif: Interlace gif for progressive rendering.
    progressive: true,  // jpeg: Lossless conversion to progressive.
    optimizationLevel: 3, // png: Select an optimization level between `0` and `7`.
    multipass: true // svg: Optimize image multiple times until it's fully optimized.

  }, opts);


  new ImageMin()
    .src(content)
    .use(ImageMin.jpegtran(opts))
    .use(ImageMin.gifsicle(opts))
    .use(ImageMin.optipng(opts))
    .use(ImageMin.svgo(opts))
    .run(function (err, files) {
      if (err) return callback(err);
      callback(null, files[0].contents)
    });

};


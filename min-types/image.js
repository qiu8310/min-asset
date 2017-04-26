var imagemin = require('imagemin')
var imageminPlugin = {
  png: require('imagemin-optipng'),
  jpg: require('imagemin-jpegtran'),
  gif: require('imagemin-gifsicle'),
  svg: require('imagemin-svgo')
}

module.exports = function(content, opts, callback, helper) {
  var imageType = opts.imageType
  var defaultOpts = {
    png: {
      bitDepthReduction: true,
      colorTypeReduction: true,
      paletteReduction: true,
      optimizationLevel: 4 // Select an optimization level between `0` and `7`.
    },
    jpg: {
      progressive: true,
      arithmetic: false
    },
    gif: {
      interlaced: false,
      optimizationLevel: 2,
      colors: 0  // Num must be between 2 and 256
    },
    svg: {
    }
  }

  var newOpts = Object.keys(defaultOpts[imageType]).reduce(function(res, key) {
    var defaultOpt = defaultOpts[imageType][key]
    var defaultOptType = typeof defaultOpt
    var userOpt
    if (key in opts) {
      userOpt = opts[key]
      if (typeof userOpt !== defaultOptType) {
        if (defaultOptType === 'boolean') userOpt = userOpt !== 'false'
        else if (defaultOptType === 'number') userOpt = parseInt(userOpt) || 0
        else userOpt = defaultOpt
      }
    }
    res[key] = userOpt || defaultOpt
    return res
  }, {})

  imagemin.buffer(content, {
    plugins: [
      imageminPlugin[imageType](newOpts)
    ]
  })
    .then(function(buffer) {
      callback(null, buffer)
    })
    .catch(callback)
}


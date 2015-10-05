var minify = require('html-minifier').minify;


module.exports = function (content, opts, callback, helper) {

  opts = helper.extend({

    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyJS: true,
    minifyCSS: true

  }, opts);

  callback(null, minify(content.toString(), opts));

}

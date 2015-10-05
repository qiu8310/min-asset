var CleanCss = require('clean-css');

module.exports = function (content, opts, callback, helper) {

  opts = helper.extend({
    keepSpecialComments: 0,
    compatibility: 'ie7',
    rebase: false,
    debug: false
  }, opts);

  new CleanCss(opts).minify(content.toString(), function (err, data) {

    if (err) return callback(err);
    return callback(null, {content: data.styles, errors: data.errors, warnings: data.warnings})

  });

};

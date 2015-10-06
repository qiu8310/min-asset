var Uglify = require('uglify-js');

function run(obj, method, a, b, c) {
  return obj[method].call(obj, a, b, c);
}

module.exports = function (content, opts, callback, helper) {

  // compress
  // mangle
  ['compress', 'mangle'].forEach(function (k) {
    var v = opts[k];
    var rk = 'no' + k[0].toUpperCase() + k.slice(1);

    if (v === false || opts[rk]) opts[k] = false;
    else if (typeof v !== 'object') opts[k] = {};
    else opts[k] = helper.snake(v);
  });

  var compress = opts.compress,
    mangle = opts.mangle,
    debug = opts.debug,
    scope;

  delete opts.compress;
  delete opts.debug;
  delete opts.mangle;

  if (compress) {
    compress = helper.snake(opts); // 选项全是给 compress 的
    compress.warnings = !!debug;
  }

  scope = compress || mangle;


  try {

    var ast = Uglify.parse(content.toString());

    if (scope) run(ast, 'figure_out_scope');
    if (compress) ast = ast.transform(Uglify.Compressor(compress));
    if (scope) run(ast, 'figure_out_scope');

    if (mangle) run(ast, 'compute_char_frequency', mangle);
    if (mangle) run(ast, 'mangle_names', mangle);

    return callback(null, run(ast, 'print_to_string'));

  } catch (e) {
    return callback(e);
  }
};

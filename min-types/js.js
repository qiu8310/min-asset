var Uglify = require('uglify-js');

function run(obj, method, a, b, c) {
  return obj[method].call(obj, a, b, c);
}

module.exports = function (content, opts, callback, helper) {

  // compress
  // mangle
  var compress = opts.compress,
    mangle = opts.mangle,
    scope;

  if (compress == null) compress = true;
  if (mangle == null) mangle = true;

  if (compress) {
    if (typeof compress !== 'object') compress = {};
    else compress = helper.snake(compress);
  }

  if (mangle) {
    if (typeof mangle !== 'object') mangle = {};
    else mangle = helper.snake(mangle);
  }

  if (compress && !opts.debug) compress.warnings = false;

  scope = compress || mangle;

  var ast = Uglify.parse(content.toString());

  if (scope) run(ast, 'figure_out_scope');
  if (compress) ast = ast.transform(Uglify.Compressor(compress));
  if (scope) run(ast, 'figure_out_scope');

  if (mangle) run(ast, 'compute_char_frequency', mangle);
  if (mangle) run(ast, 'mangle_names', mangle);

  return callback(null, run(ast, 'print_to_string'));

};

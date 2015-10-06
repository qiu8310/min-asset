/*
 * min-asset
 * https://github.com/qiu8310/min-asset
 *
 * Copyright (c) 2015 Zhonglei Qiu
 * Licensed under the MIT license.
 */

var helper = {};

function parseOpts(opts) {
  Object.keys(opts).forEach(function (k) {
    var v = opts[k];
    if (/^no[A-Z]/.test(k) && v === true) {
      opts[k[2].toLowerCase() + k.slice(3)] = false;
    }
  });
}

/**
 *
 * 压缩
 *
 * 只支持对单个文件进行压缩，不支持合并文件，不支持 SourceMap (SourceMap 只有 Chrome 支持，
 * 在其它浏览器上出错了有 SourceMap 也没用，所以可以使用 Fiddle/Charles 的文件替换技术
 * 来调试线上压缩后文件，无需 SourceMap)
 *
 * @param  {Buffer|String}  content       - 要压缩的文件内容，注意，如果是 image 只能传 Buffer
 * @param  {String}         fileType      - 指定文件的类型，可以是下面几种值：image, js, css, json, html
 *                                          或者是文件路径，会自动获取它的后缀名
 * @param  {Object|Null}    [minOptions]  - 压缩选项，根据文件类型不同，压缩的选项也不同，但使用的都是对应压缩引擎的选项：
 *
 *                  - image => iamgemin
 *                  - js    => uglify-js
 *                  - html  => html-minifier
 *                  - css   => clean-css
 *                  - json  => 使用了系统的 JSON.stringify
 *
 *             为了是配置尽量简单，我提取了这么几个可以共用的配置：
 *
 *                  - debug           => 显示编译调试信息
 *
 * @param  {Function} 回调函数，参数是 err, data
 *
 *                    data 中包含了如下信息：
 *
 *                    - content       {Buffer}        - 压缩后的文件 Buffer 内容
 *                    - errors        {Array|Null}    - 压缩过程中的错误
 *                    - warnings      {Array|Null}    - 压缩过程中的警告
 *                    - originalSize  {Number}        - 压缩前的尺寸
 *                    - minifiedSize  {Number}        - 压缩后的尺寸
 *                    - timeSpent     {Number}        - 压缩所花的时间
 */
module.exports = function (content, fileType, minOptions, callback) {

  fileType = fileType.split('.').pop().toLowerCase();

  if (['svg', 'jpg', 'jpeg', 'png', 'gif'].indexOf(fileType) >= 0) fileType = 'image';
  else if ('htm' === fileType) fileType = 'html';

  if (typeof minOptions === 'function') {
    callback = minOptions;
    minOptions = {};
  } else if (!minOptions || typeof minOptions !== 'object') {
    minOptions = {};
  } else {
    parseOpts(minOptions);
  }

  if (!Buffer.isBuffer(content)) {
    if (['image'].indexOf(fileType) >= 0)
      return callback(new Error('Buffer needed for ' + fileType));
  }

  var startTime = Date.now();

  try {
    require('./min-types/' + fileType)(content, minOptions, function (err, data) {

      if (err) {
        if (!(err instanceof Error)) {
          err = new Error(JSON.stringify(err, null, 2));
        }

        return callback(err);
      }

      var minified = data.content;

      if (!minified) {
        minified = data;
        data = { content: minified };
      }

      if (!('originalSize' in data)) data.originalSize = content.length;
      if (!('minifiedSize' in data)) data.minifiedSize = minified.length;
      if (!('timeSpent' in data)) data.timeSpent = Date.now() - startTime;

      if (!Buffer.isBuffer(data.content)) data.content = new Buffer(data.content.toString());

      callback(null, data);

    }, helper);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') return callback(new Error('Not support minify ' + fileType));
    return callback(e);
  }
};

helper.extend = function (dft, obj) {
  Object.keys(obj).forEach(function (k) {
    dft[k] = obj[k];
  });
  return dft;
};

helper.snake = function (obj) {
  var res = {};
  var rpl = function (r) { return '_' + r.toLowerCase(); };

  Object.keys(obj).forEach(function (k) {
    res[k.replace(/[A-Z]/g, rpl)] = obj[k];
  });

  return res;
};






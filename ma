#!/usr/bin/env node
var prettyBytes = require('pretty-bytes');
var async = require('async');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');

var l = function (str, val) {
  if (val) str += ' :';
  str += '  ';
  return '\n  ' +  '\x1B[90m' + str + '\x1B[m' + '\x1B[33m' + (val || '') + '\x1B[m';
}

var argv = require('yargs-cn')
  .version(require('./package.json').version).alias('v', 'version')
  .usage("$0 [选项] <文件>")
  .demand(1)
  .options({
    outDir: {
      alias: 'o',
      desc: '将压缩的文件输出到指定的文件夹，如果指定为 true，则会在同目录下生成一个 .min 的文件，如果没指定，则会输出文件内容'
    },
    debug: {
      alias: 'd',
      desc: '设置成调试模式',
      type: 'boolean'
    },
    js: {
      alias: 'j',
      desc: 'JS 配置项，可以通过 --js.xx 或 -j.xx 的形式设置具体某个值，下面几项配置也类似' +
        l('noMangle') + '  不要混淆源码中的变量名称' +
        l('noDeadCode') + '  不要删除执行不到的代码' +
        l('noDropDebugger') + '  不要删除 debugger 代码' +
        l('noLoops') + '  不要优化循环相关的代码' +
        l('noUnused') + '  不要删除没使用的函数或变量' +
        l('noHoistFuns') + '  不要将函数的声明放到最上面' +
        l('hoistVars') + '  将变量的声明放到最上面（好像开启此项会增加代码量）' +
        l('noJoinVars') + '  不要将连续的 var 声明合并成一个' +
        l('dropConsole') + '  删除 console 相关的代码' +
        '\n\n更多配置，请去项目主页查看：https://github.com/mishoo/UglifyJS2#compressor-options\n'
    },

    css: {
      alias: 'c',
      desc: 'CSS 配置项，下面列出几个常用的配置' +
        l('compatibility', 'ie7') + ' 指定对浏览器的兼容性，并可以设置具体的处理规则' +
        '\n                       参看：https://github.com/jakubpawlowicz/clean-css#how-to-set-a-compatibility-mode' +
        l('keepSpecialComments', '0') + ' 是否保留特殊的注释，默认什么也不保留，' +
        '\n                           设置成 "1" 会保留第 1 行的特殊注释， "*" 是保留所有' +
        '\n\n更多配置，请去项目主页查看：https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-api\n'
    },

    html: {
      alias: 't',
      desc: 'html 配置项，下面列出的都是默认设置为 true 的配置' +
        l('collapseWhitespace') +
        l('collapseBooleanAttributes') +
        l('removeRedundantAttributes') +
        l('useShortDoctype') +
        l('removeScriptTypeAttributes') +
        l('removeStyleLinkTypeAttributes') +
        l('minifyJS') +
        l('minifyCSS') +
        '\n\n更多配置，请去项目主页查看： https://github.com/kangax/html-minifier#options-quick-reference\n'
    },

    image: {
      alias: 'i',
      desc: 'image 配置项' +
        l('interlaced', 'true') + '  GIF: Interlace gif for progressive rendering' +
        l('progressive', 'true') + '  JPEG: Lossless conversion to progressive' +
        l('optimizationLevel', '3') + '  PNG: Select an optimization level between `0` and `7`' +
        l('multipass', 'true') + '  SVG: Optimize image multiple times until it\'s fully optimized' +
        '\n'
    }
  })
  .strict()
  .help('help').alias('h', 'help')
  .showHelpOnFail(false, '请使用 --help 查看可用的选项')
  .epilog('需要了解更多信息，请访问 https://github.com/qiu8310/min-asset')
  .argv;


var ma = require('./index');

var types = {
  html: ',html,htm,',
  image: ',png,jpeg,jpg,gif,svg,',
  json: ',json,',
  css: ',css,',
  js: ',js,'
};

function fileType(file) {
  var ext = file.split('.').pop().toLowerCase();
  for (var k in types) {
    if (types[k].indexOf(',' + ext + ',') >= 0) return k;
  }
}

function saved(s) {
  return ' \x1B[35m saved ' + s + '\x1B[m';
}

function minCallback(file, memo, next) {
  return function (err, data) {
    if (err) return next(err);

    var diff = data.originalSize - data.minifiedSize;
    if (diff < 10) {
      console.log(file + ' \x1B[90m already optimized \x1B[m');
    } else {
      var s = prettyBytes(diff),
        r = (diff / data.originalSize * 100).toFixed() + '%';

      var toFile;

      if (typeof argv.outDir === 'string') {
        mkdirp.sync(argv.outDir);
        toFile = path.join(argv.outDir, path.basename(file));
      } else if (argv.outDir) {
        toFile = file.replace(/(\.\w+)$/, '.min$1');
      }

      if (toFile) {
        fs.writeFileSync(toFile, data.content);
        console.log(file + ' => ' + toFile + saved(s + ' - ' + r));
      } else {
        console.log(data.content.toString());
        console.log('\r\n' + saved(s + ' - ' + r));
      }

    }

    memo += diff;

    next(null, memo);
  };
}

async.reduce(
  argv._,
  0,
  function (memo, file, next) {

    var type = fileType(file);
    if (!type) return next(new Error('Not support minify file ' + file));

    fs.readFile(file, function (err, content) {
      if (err) return next(err);
      var opts = argv[type];
      if (typeof opts !== 'object') opts = {};
      if (argv.debug) opts.debug = true;
      ma(content, type, opts, minCallback(file, memo, next));
    });
  },

  function (err, result) {
    if (err) return console.log(err.stack || err);

    var len = argv._.length;
    if (len && result >= 10) {
      console.log('\nMinified \x1B[93m' + len + '\x1B[m file' + (len > 1 ? 's' : ''));
    }
  }
);



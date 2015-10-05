# min-asset

Minify any static file type, includes html, css, js, json, image.



## API

```
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

```


## CLI


```
  --outDir, -o   [S]  将压缩的文件输出到指定的文件夹，如果指定，则会在同目录下生成一个 .min 的文件
  --debug, -d         设置成调试模式
  --js, -j            JS 配置项，可以通过 --js.xx 或 -j.xx 的形式设置具体某个值，下面几项配置也类似
                        noMangle    不要混淆源码中的变量名称
                        noDeadCode    不要删除执行不到的代码
                        noDropDebugger    不要删除 debugger 代码
                        noLoops    不要优化循环相关的代码
                        noUnused    不要删除没使用的函数或变量
                        noHoistFuns    不要将函数的声明放到最上面
                        hoistVars    将变量的声明放到最上面（好像开启此项会增加代码量）
                        noJoinVars    不要将连续的 var 声明合并成一个
                        dropConsole    删除 console 相关的代码

                      更多配置，请去项目主页查看：https://github.com/mishoo/UglifyJS2#compressor-options

  --css, -c           CSS 配置项，下面列出几个常用的配置
                        compatibility :  ie7 指定对浏览器的兼容性，并可以设置具体的处理规则
                                             参看：https://github.com/jakubpawlowicz/clean-css#how-to-set-a-compatibility-mode
                        keepSpecialComments :  0 是否保留特殊的注释，默认什么也不保留，
                                                 设置成 "1" 会保留第 1 行的特殊注释， "*" 是保留所有

                      更多配置，请去项目主页查看：https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-api

  --html, -h          html 配置项，下面列出的都是默认设置为 true 的配置
                        collapseWhitespace
                        collapseBooleanAttributes
                        removeRedundantAttributes
                        useShortDoctype
                        removeScriptTypeAttributes
                        removeStyleLinkTypeAttributes
                        minifyJS
                        minifyCSS

                      更多配置，请去项目主页查看： https://github.com/kangax/html-minifier#options-quick-reference

  --image, -i         image 配置项
                        interlaced :  true  GIF: Interlace gif for progressive rendering
                        progressive :  true  JPEG: Lossless conversion to progressive
                        optimizationLevel :  3  PNG: Select an optimization level between `0` and `7`
                        multipass :  true  SVG: Optimize image multiple times until it's fully optimized


```











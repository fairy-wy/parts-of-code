### Loader
Loader可以帮助webpack将不同类型的文件转换为webpack可识别的模块

**loader的分类**

* pre： 前置 loader
* normal： 普通 loader
* inline： 内联 loader
* post： 后置 loader

**Loader 执行顺序**

* 4 类 loader 的执行优级为：pre > normal > inline > post
* 相同优先级的 loader 执行顺序为：从右到左，从下到上

```js
// 此时loader执行顺序：loader1 - loader2 - loader3
module: {
  rules: [
    {
      enforce: "pre",
      test: /\.js$/,
      loader: "loader1",
    },
    {
      // 没有enforce就是normal
      test: /\.js$/,
      loader: "loader2",
    },
    {
      enforce: "post",
      test: /\.js$/,
      loader: "loader3",
    },
  ],
}
```
```js
// 此时loader执行顺序：loader3 - loader2 - loader1
module: {
  rules: [
    {
      test: /\.js$/,
      loader: "loader1",
    },
    {
      test: /\.js$/,
      loader: "loader2",
    },
    {
      test: /\.js$/,
      loader: "loader3",
    },
  ],
}
```

**使用Loader方式**

* 配置方式：在 webpack.config.js 文件中指定 loader。（pre、normal、post）

  * test参数: 是一个正则表达式，我们会对应的资源文件根据test的规则去匹配。如果匹配到，那么该文件就会交给对应的loader去处理。

  * use参数: use表示匹配到test中匹配对应的文件应该使用哪个loader的规则去处理，use可以为一个字符串，也可以为一个数组。use 中不仅可以使用模块名称，还可以使用模块文件路径

  * enforce参数: loader中存在一个enforce参数标志这loader的顺序,比如这样一份配置文件:
```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      { test: /.css$/, use: 'sass-loader', enforce: 'pre' },
      { test: /.css$/, use: ['style-loader'', css-loader'] },
      { test: /.css$/, use: 'style-loader', enforce: 'post' },
    ],
  },
};
```
* 内联方式：在每个 import 语句中显式指定 loader。（inline loader）

```js
// 内联
import Styles from 'style-loader!css-loader?modules!./styles.css';
// 使用 css-loader 和 style-loader 处理 styles.css 文件
// 通过 ! 将资源中的 loader 分开

```

**特性**

* loader 支持链式传递。能够对资源使用流水线(pipeline)。一组链式的 loader 将按照相反的顺序执行。loader 链中的第一个 loader 返回值给下一个 loader。在最后一个 loader，返回 webpack 所预期的 JavaScript
* loader 可以是同步的，也可以是异步的
* loader 运行在 Node.js 中，并且能够执行任何可能的操作
* loader 接收查询参数。用于对 loader 传递配置
* loader 也能够使用 options 对象进行配置

**Loader 分类**

* 同步 Loader
```js
module.exports = function (content, map, meta) {
  /*
    第一个参数：err 代表是否有错误
    第二个参数：content 处理后的内容
    第三个参数：source-map 继续传递source-map
    第四个参数：meta 给下一个loader传递参数
  */
  this.callback(null, content, map, meta);
  // 同步loader中不能进行异步操作
  return; // 当调用 callback() 函数时，总是返回 undefined
};
```

* 异步 loader
```js
module.exports = function (content, map, meta) {
  // 异步操作
  const callback = this.async();
  // 进行异步操作
  setTimeout(() => {
    callback(null, result, map, meta);
  }, 1000);
};
```

* loader API
  * this.async ===> 异步回调 loader。返回 this.callback	const callback = this.async()
  * this.callback ===> 可以同步或者异步调用的并返回多个结果的函数	this.callback(err, content, sourceMap?, meta?)
  * this.getOptions(schema) ===>  获取 loader 的 options	this.getOptions(schema)
  * this.emitFile ===> 产生一个文件	this.emitFile(name, content, sourceMap)
  * this.utils.contextify ===> 返回一个相对路径	this.utils.contextify(context, request)
  * this.utils.absolutify ===> 返回一个绝对路径	this.utils.absolutify(context, request)

**自定义Loader**

每个 webpack 的 loader 都需要导出一个函数，这个函数就是我们这个 loader 对资源的处理过程，它的输入就是加载到的资源文件内容，输出就是我们加工后的结果。

* babel-loader ===> 将ES6语法降级成ES5语法

```js

const babel = require('@babel/core') // babel核心包
function loader(source){
  // this指向loader上下文 loaderContext
  // 告诉 loader-runner 这个 loader 将会异步地回调
  const cb = this.async(); 
  
  babel.transform(source, {
    ...this.query, // 获取loader的options选项 options: {presets: ['@babel/preset-env']}
    sourceMap: true, // 开启sourceMap
    filename: this.resourcePath.split('/').pop() // sourceMap的文件名
  }, function(err, result){
    // babel的转化过程是异步的
    cb(null, result.code, result.map)
  })
}
```
```js
// webpack.config.js
// 第一种方式在项目内部存在一些未发布的自定义loader时比较常见，直接使用绝对路径地址的形式指向loader文件所在的地址。 
module.exports = {
    ...
    module: {
        rules: [
            {
                test:/\.js$/,
                // .js后缀其实可以省略，后续我们会为大家说明这里如何配置loader的模块查找规则
                loader: path.resolve(__dirname,'../loaders/babel-loader.js')
            }
        ]
    }
}
```
```js
// webpack.config.js
// 第二种方式我们可以通过webpack中的resolveLoader的别名alias方式进行配置.当webpack在解析到loader中使用babel-loader时，查找到alias中定义了babel-loader的文件路径。就会按照这个路径查找到对应的loader文件从而使用该文件进行处理。
module.exports = {
    ...
    resolveLoader: {
        alias: {
            'babel-loader': path.resolve(__dirname,'../loaders/babel-loader.js')
        }
    },
    module: {
        rules: [
            {
                test:/\.js$/,
                loader: 'babel-loader'
            }
        ]
    }
}
```

### Plugin

插件就像是一个插入到生产线中的一个功能，在特定的时机对生产线上的资源做处理。

在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过Webpack提供的API改变输出结果。和手写loader一样，

 #### Tapable

 webpack核心机制为事件流机制，将各个插件串联起来，而完成这些的核心就是tapable。Tapable 事件流机制保证了插件的有序性，只需要插件监听webpack广播出来的关心的事件即可。webpack中最核心的负责编译的Compiler和负责创建bundles的Compilation都是Tapable的实例

 Tapable 为 webpack 提供了统一的插件接口（钩子）类型定义，它是 webpack 的核心功能库。webpack 中目前有十种 hooks，

 Tapable 还统一暴露了三个方法给插件，用于注入不同类型的自定义构建行为：

* tap：可以注册同步钩子和异步钩子
* tapAsync：回调方式注册异步钩子
* tapPromise：Promise 方式注册异步钩子

**自定义插件**

plugin的本质是类；我们在定义plugin时，其实是在定义一个类

1. webpack启动，执行new myPlugin(options)，初始化插件并获取实例
2. 初始化complier对象，调用myPlugin.apply(complier)给插件传入complier对象
3. 插件实例获取complier，通过complier监听webpack广播的事件，通过complier对象操作webpack

```js
// MyPlugin.js
class MyPlugin {
  constructor(options) {
    console.log("Plugin被创建了");
    console.log(options)
    // 插件传参
    this.options = options;
  }
//   apply函数，它会在webpack运行时被调用，并且注入compiler对象
  apply (compiler) {
    // 通过apply函数中注入的compiler对象进行注册事件  
    // 同步注册
    compiler.hooks.done.tap("MyPlugin", (compilation) => {
      console.log("compilation done");
    });

    // 异步注册
    // compiler.hooks.run.tapAsync("MyPlugin", (compilation, callback) => {
    //   setTimeout(()=>{
    //     console.log("compilation run");
    //     callback()
    //   }, 1000)
    // });
  }
}
module.exports = MyPlugin;
```
```js
//webpack.config.js
const MyPlugin = require('./plugins/MyPlugin')
module.exports = {
  plugins: [
    new MyPlugin({ title: 'MyPlugin' })
  ],
}
```





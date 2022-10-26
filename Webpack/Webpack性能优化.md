
### Webpack性能优化
#### 前言
webpack 性能优化可分为开发环境优化和生产环境优化。

* 开发环境优化又分为优化代码构建速度和优化代码调试。
* 生产环境优化又分为优化打包构建速度和优化代码运行性能。

#### 开发环境优化

**1. 优化构建打包速度**

* **HMR(hot module replacement)模块热替换**，在运行时更新部分模块的内容，而无需完全刷新。webpack-dev-server v4.0.0 开始，热模块替换是默认开启的。

    * style-loader内部实现了样式文件的热替换
    * js文件默认不能使用HMR，需要额外配置

```js
// webpack.config.js
module.exports = {
    // 配置HMR方法
    devServer: {
        hot: true,
    }
}
```
```js
// js文件模块热替换配置
if (module.hot) {
   module.hot.accept('./print.js', function() {
     console.log('Accepting the updated printMe module!');
     console.log('Updating print.js...');
   })
 }
```
无论是热替换还是暴力刷新，webpack 触发浏览器都可以简单的分为以下 3 步。

1. 观察文件是否有变化
2. 如果有变化通过 devServer 中的 webSocket 告诉浏览器 bundle.js 中的 webSocket client 有文件发生了变化。
3. 浏览器根据是否激活了热替换，来决定是替换内存中的 modules 对象，还是暴力刷新。

**2. 优化代码调试**

* **source-map**：source-map 的核心作用就是，能把打包后的js（bundle.js）的报错映射到源码。快速找到错误之处
```js
// webpack.config.js
module.exports = {
    // 配置source-map           
    devtool: 'source-map'
}         
```
devtool（开发环境默认为eval,生产环境默认为none）的其它配置:

1. 开发环境的配置

    * eval：每个模块都使用eval()执行，并且都有sourceURL。此选项会非常快地构建。主要缺点是，由于会映射到转换后的代码，而不是映射到原始代码，所以不能正确的显示行数。

    * eval-source-map：每个模块使用eval()执行，并且 source map 转换为 DataUrl 后添加到eval()中。初始化 source map 时比较慢，但是会在重新构建时提供比较快的速度，并且生成实际的文件。行数能够正确映射，因为会映射到原始代码中。

    * cheap-eval-source-map：类似eval-source-map，每个模块使用eval()执行。这是 "cheap(低开销)" 的 source map，因为它没有生成列映射，只是映射行数。并且仅显示转译后的代码。

    * cheap-module-eval-source-map：类似cheap-eval-source-map，并且，在这种情况下，源自 loader 的 source map 会得到更好的处理结果。然而，loader source map 会被简化为每行一个映射(mapping)。

2. 生产环境的配置

    * none：（省略devtool选项）表示不生成source*-map

    * source-map：外部生成map文件，会有错误代码的准确信息和源代码的错误准确的位置

    * hidden-source-map：外部生成一个map文件，他把budle.js文件中最后的注释删掉了。报错也不会找到具体信息

    * nosources-source-map：外部生成map文件，报错可以看到错误，但是错误位置不会有任何信息。不暴露所有的源代码。

#### 生产环境优化

**1. 优化打包构建速度**

* **oneOf**： 对于某种类型的文件，webpack 会从上至下匹配所有的 loader，使用oneOf，匹配到了后，立刻跳出循环。因此 oneOf 可以优化构建速度
```js
// webpack.config.js
module.exports = {
    // 配置oneOf方法
    module: {
            rules: [
                {
                    oneOf: [
                        {
                            test: /\.(png|jpg|jpeg)$/,
                            use: ['file-loader'],
                            exclude: /(node_modules|bower_components|dist)/
                        }
                    ]
                }
           ]
      }
}
```

* **babel 缓存**：浏览器第一次拿资源文件的时候，会从服务器上走 http 拉取，但是当刷新页面再次请求的时候，浏览器会直接从缓存（可以是内存，也可以是硬盘，自己配置）当中拿同名文件，因此省去了发送 http 请求拿资源的时间。babel 缓存一定要配合 hash 值使用，因为如果不配合 hash 值，你的文件明明修改了，但是 webpack 不认为服务上的文件和缓存文件有区别，它拿到的文件依然是本地的。

三种 hash 的区别：

1. hash：即使修改一个文件，打包生成的所有文件的hash值都会改变。
2. chunkHash：修改文件后，打包后生成的文件只会改变跟修改的文件相关的文件的hash值（修改index.js,index.js和index.css的打包后的hash都变）
3. contentHash：修改文件后，打包生成的文件只会改变修改文件的hash值

* **多进程打包**：有两种解决方案比较常用，一个是 thread-loader，一个是 happy-pack，但是 happy-pack 的维护者现在对这个库不再维护了，因此，推荐使用 thread-loader（多进程打包，不是线程）

```js
// webpack.config.js
module.exports = {
     module: {
                rules:
                    [
                        {
                            test: /\.(js|jsx)$/,
                            exclude: /(node_modules|bower_components|dist)/,
                            use: [
                                /**
                                 * 开启多进程打包，打开进程一般 600 ms，
                                 * 通信也有开销。
                                 */
                                {
                                     loader: "thread-loader",
                                     options: {
                                         workers: 3  // 进程的个数
                                     }
                                },
                                {
                                    loader: "babel-loader",
                                    options: {
                                        cacheDirectory: true
                                    }
                                }

                            ]
                        }
                   ]
              }
}   
```

* **externals**：防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。

* **dlls**：dlls 技术的原理是它可以帮你在本地提前打包好指定库，然后在项目再次打包的时候直接从本地引入而不需要再次打包。

```js
// webpack.config.js
module.exports = {
    module: {
        plugins:[
            // 告诉 webpack 哪些库不参与打包，同时使用时改变名称
            new webpack.DllReferencePlugin({
            manifest: resolve(__dirname, 'dll/manifest.json') // 从 manifest 里面找映射关系
            })，
            new AddAssetHtmlWebpackPlugin({
            filepath: resolve(__dirname, 'dll/iquery') // 
            })
        ]
    }

```
```js
// webpack.dll.js
{
  entry:{
    jquery: ['jquery']  
  }
  output:{
    filename: '[name].js',
    path: resolve(__dirname, 'dll'),
    library: '[name]_[hash]' // 你打包好的库叫什么名字
  },
  plugin:{
     new webpack.DllPlugin({
       name: '[name]_[hash]',
       // 库和名称的映射关系，（存放库的路径，库包含哈希的名称）
       path: resolve(__dirname, 'dll/manifest.json')
     })，
  }
}
```

总结：dll 和 external 的区别是，dll 是打包好放到本地服务上；external 是不打包直接从 cdn 上引入。两者为同一个问题提供了两种略有差异的解决方案。

**2. 优化代码运行性能**

* **tree shaking**：tree shaking 的意思是你的项目里面有些代码可能是从来没被引入的，比方说你定义了一个函数但是你从来没有引用到它。这个时候 tree shaking 可以在打包的时候帮你干掉这些代码。

前提条件，使用 tree shaking 必须：使用 ES6 module；使用 production

需要配合 package.json 里面 sideEffects: ["*.css"] 一同使用，否则可能会干掉打包好的 css 文件。

* **code split**：代码分割技术

```js
module.exports = {
    // 多入口  多个入口会打包生成多个 bundle.js 文件
    entry: {
        main: './src/js/index.js',
        test: './src/js/test.js'
    },
    output: {
        filename: 'js/[name].[contenthash:10].js'
        path: resolve(__dirname, 'build')   
    },

    // node_modules 中代码单独打包成一个 chunk;自动分析多入口 chunk 中，有没有公共文件，如果有会打包成一个单独 chunk
    optimization: {
        splitChunks:{
            chunks: 'all'
        }
    }

}
```
```js
// import 函数
// test.js 文件会单独打包成一个 chunk。
import('./test').then(res=>{
  console.log(res)
})
```

* **懒加载和预加载**

```js
// 懒加载  (点按钮的时候才加载 test.js 文件，即，把 test.js 放到内存里)
document.getElementById('btn').onclick = () => {
  import('./test').then(({mul})=> {
    console.log(mul(4,5))
  })
)
```
```js
// 预加载  
document.getElementById('btn').onclick = () => {
  import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test').then(({mul})=> {
    console.log(mul(4,5))
  })
)
```

* **pwa**：用户离线时也可以访问我们的页面。配置成功以后，浏览器在离线后可以从 service-worker 里拉取静态资源。

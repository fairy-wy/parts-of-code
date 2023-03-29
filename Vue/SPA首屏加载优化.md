
### 什么是首屏加载

首屏时间（First Contentful Paint），指的是浏览器从响应用户输入网址地址，到首屏内容渲染完成的时间，此时整个网页不一定要全部渲染完成，但需要展示当前视窗需要的内容

### 加载慢的原因

在页面渲染的过程，导致加载速度慢的因素可能如下：

* 网络延时问题
* 资源文件体积是否过大*
* 资源是否重复发送请求去加载了
* 加载脚本的时候，渲染内容堵塞了

### 首屏优化方案

* 减少http请求
   * 雪碧图：将众多小图标合并到同一张图上，利用css定位找到对应图片，用以减轻http请求压力。
   * 页面上使用到的icon，可以使用在线字体图标。字体图标可以减少很多图片的使用，从而减少http请求。
   * 行内图片（Base64 编码）：将图片的内容以Base64格式内嵌到HTML中，可以减少HTTP请求数量。网页上的图片资源如果采用http形式的url的话都会额外发送一次请求，网页发送的http请求次数越  多，会造成页面加载速度越慢。而采用Base64格式的编码，将图片转化为字符串后，图片文件会随着html元素一并加载，这样就可以减少http请求的次数，对于网页优化是一种比较好的手段。不会造成跨域请求的问题。缺点是增加了CSS文件的尺寸，造成数据库数据量的增大，IE6 IE7并不支持

* 减小入口文件体积
    * 路由懒加载：把不同路由对应的组件分割成不同的代码块，待路由被请求的时候会单独打包路由，使得入口文件变小，加载速度大大增加.以函数的形式加载路由，这样就可以把各自的路由文件分别打包，只有在解析给定的路由时，才会加载路由组件
    ```js
    routes:[ 
        path: 'Blogs',
        name: 'ShowBlogs',
        component: () => import('./components/ShowBlogs.vue')
    ]
    ```
    * 减小文件大小：利用uglify+tree-shaking删除无用代码

* 静态资源本地缓存
    * http缓存：采用HTTP缓存，设置Cache-Control，Last-Modified，Etag等响应头
    * 本地缓存：利用localStorage，sessionStorage本地缓存。

* UI框架按需加载
```js
import { Button, Input, Pagination, Table, TableColumn, MessageBox } from 'element-ui';
Vue.use(Button)
Vue.use(Input)
Vue.use(Pagination)
```

* 图片资源的压缩
   * 对于比较大的图片我们可以用image-webpack-loader 来压缩图片

* 组件重复打包：假设A.js文件是一个常用的库，现在有多个路由使用了A.js文件，这就造成了重复下载

    * 解决方案：在webpack的config文件中，修改CommonsChunkPlugin的配置为minChunks: 3，minChunks为3表示会把使用3次及以上的包抽离出来，放进公共依赖文件，避免了重复加载组件

* 开启GZip压缩：安装compression-webpack-plugin插件，在vue.config.js中configureWebpack配置插件

* 使用SSR：也就是服务端渲染，组件或页面通过服务器生成html字符串，再发送到浏览器。省去浏览器解析


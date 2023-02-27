
### 什么是首屏加载

首屏时间（First Contentful Paint），指的是浏览器从响应用户输入网址地址，到首屏内容渲染完成的时间，此时整个网页不一定要全部渲染完成，但需要展示当前视窗需要的内容

### 加载慢的原因

在页面渲染的过程，导致加载速度慢的因素可能如下：

* 网络延时问题
* 资源文件体积是否过大*
* 资源是否重复发送请求去加载了
* 加载脚本的时候，渲染内容堵塞了

### 首屏优化方案

* 减小入口文件积
    * 路由懒加载：把不同路由对应的组件分割成不同的代码块，待路由被请求的时候会单独打包路由，使得入口文件变小，加载速度大大增加.以函数的形式加载路由，这样就可以把各自的路由文件分别打包，只有在解析给定的路由时，才会加载路由组件
    ```js
    routes:[ 
        path: 'Blogs',
        name: 'ShowBlogs',
        component: () => import('./components/ShowBlogs.vue')
    ]
    ```

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
    * 页面上使用到的icon，可以使用在线字体图标
    * 雪碧图：将众多小图标合并到同一张图上，利用css定位找到对应图片，用以减轻http请求压力。

* 组件重复打包：假设A.js文件是一个常用的库，现在有多个路由使用了A.js文件，这就造成了重复下载

    * 解决方案：在webpack的config文件中，修改CommonsChunkPlugin的配置为minChunks: 3，minChunks为3表示会把使用3次及以上的包抽离出来，放进公共依赖文件，避免了重复加载组件

* 开启GZip压缩：安装compression-webpack-plugin插件，在vue.config.js中configureWebpack配置插件

* 使用SSR：也就是服务端渲染，组件或页面通过服务器生成html字符串，再发送到浏览器。省去浏览器解析


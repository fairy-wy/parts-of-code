### 前言

require和import本质上都是为了JS模块化编程使用的一个语法，语法一般都遵循这一定的语法规范，require遵循的是AMD/CommonJS规范，而import是es6新引入的一个语法标准，如果要兼容浏览器的话必须转化成es5的语法。

AMD：即Asynchronous Module Definition，中文名是异步模块定义，一个在浏览器端模块化开发的规范，它完整描述了模块的定义，依赖关系，引用关系以及加载机制。

CommonJS:和AMD类似，它与AMD的区别是它加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。CommonJS 模块化方案 require/exports 是为服务器端开发设计的。服务器模块系统同步读取模块文件内容，编译执行后得到模块接口

### 区别

**出现的时间、地点不同**

* require/exports	2009	CommonJS

* import/export	2015	ECMAScript2015（ES6）

**不同端(客户端/服务器)的使用限制**

* 原生浏览器不支持 require/exports，可使用支持 CommonJS 模块规范的 Browsersify、webpack 等打包工具，它们会将 require/exports 转换成能在浏览器使用的代码。
* import/export 在浏览器中无法直接使用，我们需要在引入模块的 <script> 元素上添加type="module" 属性。
* 即使 Node.js 13.2+ 可以通过修改文件后缀为 .mjs 来支持 ES6 模块 import/export，但是Node.js 官方不建议在正式环境使用。目前可以使用 babel 将 ES6 的模块系统编译成 CommonJS 规范（注意：语法一样，但具体实现还是 require/exports）。

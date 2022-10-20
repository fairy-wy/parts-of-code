
### vue渲染流程

vue首先会找到配置文件。在这里，定义了vue的程序入口文件。默认情况下，vue的入口文件是main.js

使用到vue项目的文件包括一个.html(index.html)，两个.js（main.js,router里的路由配置index.js），一个.vue（App.vue）文件

![](https://img-blog.csdn.net/20180928143434485?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MzIzNjYxMA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

main.js文件调用关系分为三步

* 确定将被挂载（替换）的元素---此处为index.html中的<div id="app"><div>。
* 注册组件（此处只有组件App），选择其中用于替换挂载元素（第一步中的元素）的模板组件（<App/>），即用App.vue替换index.html中的<div id="app"><div>。

* 注入路由器router：

1. 模板组件（App.vue）中有<router-view/>，将在其中渲染路由匹配到的组件
2. 注入（import）路由时指定的是router文件夹，即文件夹下所有routes
3. router文件夹下此时只有index.js文件，其中routes:[]规定了文件地址及其url地址映射
4. 根据文件地址，载入组件（First.vue），组件被渲染在<router-view/>中，显示在index.html中

**vue加载时文件的执行顺序**

1. 执行index.html文件
2. 执行main.js文件。main.js挂载了app.vue文件，用app.vue的templete替换index.html中的<div id="app"></div>
3. main.js中注入了路由文件，将对应的组件渲染到router-view中。
4. router-view中加载Layout文件
5. Layout 加载Navbar, Sidebar, AppMain

**Vue渲染过程**

1. vue把模板template解析，生成AST（抽象语法树：源代码语法结构的一种表示，以树状的形式表现语法结构）
2. 得到AST后，通过generate函数生成render函数
3. 实例进行挂载,根据根节点render函数的调用，递归的生成虚拟DOM
4. 对比虚拟dom，渲染到真实DOM



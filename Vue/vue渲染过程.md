
### vue渲染流程

vue首先会找到配置文件。在这里，定义了vue的程序入口文件。默认情况下，vue的入口文件是main.js

使用到vue项目的文件包括一个.html(index.html)，两个.js（main.js,router里的路由配置index.js），一个.vue（App.vue）文件

![](https://img-blog.csdn.net/20180928143434485?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MzIzNjYxMA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

main.js文件调用关系分为三步

* 确定将被挂载（替换）的元素---此处为index.html中的
```html
<div id="app"><div>
```
* 注册组件（此处只有组件App），选择其中用于替换挂载元素（第一步中的元素）的模板组件（<App/>），即用App.vue替换index.html中的
```html
<div id="app"><div>
```

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

**Vue渲染过程**

1. 数据初始化后，开始进行模板编译。使用parse()函数通过正则等方式提取出 <template></template> 模板里的标签元素、属性、变量等信息，并解析成抽象语法树 AST（AST对象）。

2. 遍历 AST 找出其中的静态节点和静态根节点，并添加标记<静态节点的static属性值为true,动态节点static属性值为false,并根据type属性值不同区分节点>（为了后面 diff算法的patch 过程中就会跳过静态节点的对比，优化性能）

3. 在根据generate()函数将AST生成 render 的函数

4. 在实例化时，会调用 _init 进行初始化。_init 内会调用 $mount 来挂载组件，而 $mount 方法实际调用的是 mountComponent。

5. mountComponent 除了调用一些生命周期的钩子函数外，最主要是 updateComponent，它就是负责渲染视图的核心方法，其只有一行核心代码：
```js
vm._update(vm._render(), hydrating)
```

6. vm._render 创建并返回 VNode，vm._update 接受 VNode 将其转为真实节点。updateComponent 会被传入 渲染Watcher，每当数据变化触发 Watcher 更新就会执行该函数，重新渲染视图。updateComponent 在传入 渲染Watcher 后会被执行一次进行初始化页面渲染。

**render函数构建vnode**

_render 内部会执行 render 方法并返回构建好的 VNode。render 一般是模板编译后生成的方法，也有可能是用户自定义。render函数的creatcreateElement 方法，它是创建 VNode 的核心方法，createElement 会返回一个 VNode，也就是调用 vm._render 时创建得到的VNode。之后 VNode 会传递给 vm._update 函数，用于生成真实dom。在首次渲染时，vm.$el 对应的是根节点 dom 对象，也就是我们熟知的 id 为 app 的 div。它作为 oldVNode 参数,进过diff算法的对比新旧虚拟dom，更新虚拟dom，最后会调用 createElm 方法，它就是将 VNode 转为真实dom 渲染到页面。

**总结**：渲染过程中。vue把先把模板template解析，生成AST。得到AST后，通过generate函数生成render函数。_render 开始构建 VNode，核心方法为 createElement，一般会创建普通的 VNode ，遇到组件就创建组件类型的 VNode，否则就是未知标签的 VNode，构建完成传递给 _update。patch 阶段根据 VNode 创建真实节点树，核心方法为 createElm，首先遇到组件类型的 VNode，内部会执行 $mount，再走一遍相同的流程。普通节点类型则创建一个真实节点，如果它有子节点开始递归调用 createElm，使用 insert 插入子节点，直到没有子节点就填充内容节点。最后递归完成后，同样也是使用 insert 将整个节点树插入到页面中，再将旧的根节点移除。

**render函数构建vnode**

_render 内部会执行 render 方法并返回构建好的 VNode。render 一般是模板编译后生成的方法，也有可能是用户自定义。render函数的creatcreateElement 方法，它是创建 VNode 的核心方法，createElement 会返回一个 VNode，也就是调用 vm._render 时创建得到的VNode。之后 VNode 会传递给 vm._update 函数，用于生成真实dom。在首次渲染时，vm.$el 对应的是根节点 dom 对象，也就是我们熟知的 id 为 app 的 div。它作为 oldVNode 参数,进过diff算法的对比新旧虚拟dom，更新虚拟dom，最后会调用 createElm 方法，它就是将 VNode 转为真实dom 渲染到页面。

**总结**：初始化调用 $mount 挂载组件。vue把模板template解析，生成AST。得到AST后，通过generate函数生成render函数。_render 开始构建 VNode，核心方法为 createElement，一般会创建普通的 VNode ，遇到组件就创建组件类型的 VNode，否则就是未知标签的 VNode，构建完成传递给 _update。patch 阶段根据 VNode 创建真实节点树，核心方法为 createElm，首先遇到组件类型的 VNode，内部会执行 $mount，再走一遍相同的流程。普通节点类型则创建一个真实节点，如果它有子节点开始递归调用 createElm，使用 insert 插入子节点，直到没有子节点就填充内容节点。最后递归完成后，同样也是使用 insert 将整个节点树插入到页面中，再将旧的根节点移除。



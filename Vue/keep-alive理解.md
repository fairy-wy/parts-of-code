
### keep-alive

keep-alive 是 Vue 的内置组件，当它包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和 transition 相似，keep-alive 是一个抽象组件：它自身不会渲染成一个 DOM 元素，也不会出现在父组件链中

**作用**： 

在组件切换过程中将状态保留在内存中，防止重复渲染DOM，减少加载时间及性能消耗，提高用户体验性。

**原理**： 

在 created 函数调用时将需要缓存的 VNode 节点保存在 this.cache 中,在 render（页面渲染） 时，如果 VNode 的 name 符合缓存条件（可以用 include 以及 exclude 控制），则会从 this.cache 中取出之前缓存的 VNode 实例进行渲染。

* include: 只有名称匹配的组件会被缓存。
* exclude: 任何名称匹配的组件都不会被缓存。
* max: 最多可以缓存多少组件实例。

```vue
// App.vue
<template>
    // 将缓存 name 为 test 的组件
    <keep-alive include="test">
        <router-view/>
    </keep-alive>
    	
    // 5. 将不缓存 name 为 home 的组件
    <keep-alive exclude='home'>
        <router-view/>
    </keep-alive>
</template>>
```

生命周期函数 (被包含在 < keep-alive > 中创建的组件，会多出两个生命周期的钩子: activated 与 deactivated)

* activated: 在 keep-alive 组件激活时调用， 该钩子函数在服务器端渲染期间不被调用。
* deactivated: 在 keep-alive 组件停用时调用，该钩子在服务器端渲染期间不被调用。

只有组件被 keep-alive 包裹时，这两个生命周期才会被调用，如果作为正常组件使用，是不会被调用，以及在 2.1.0 版本之后，使用 exclude 排除之后，就算被包裹在 keep-alive 中，这两个钩子依然不会被调用！另外在服务端渲染时此钩子也不会被调用的。

当引入keep-alive 的时候，页面第一次进入，钩子的触发顺序 created -> mounted -> activated，退出时触发 deactivated。
当再次进入（前进或者后退）时，只触发 activated。

我们知道 keep-alive 之后页面模板第一次初始化解析变成 HTML 片段后，再次进入就不在重新解析而是读取内存中的数据。
只有当数据变化时，才使用 VirtualDOM 进行 diff 更新。所以，页面进入的数据获取应该在 activated 中也放一份。
数据下载完毕手动操作 DOM 的部分也应该在activated中执行才会生效

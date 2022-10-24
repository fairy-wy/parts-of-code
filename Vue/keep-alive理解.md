### keep-alive

keep-alive 是 Vue 的内置组件，当它包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和 transition 相似，keep-alive 是一个抽象组件：它自身不会渲染成一个 DOM 元素，也不会出现在父组件链中

**作用**： 

在组件切换过程中将状态保留在内存中，防止重复渲染DOM，减少加载时间及性能消耗，提高用户体验性。

**属性**

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

**原理**： 

* created钩子会创建一个cache对象，用来作为缓存容器，保存vnode节点。在 created 函数调用时将需要缓存的 VNode 节点保存在 this.cache 中,

* render（页面渲染）时
  1. 先获取到插槽里的内容，用getFirstComponentChild方法获取第一个子组件，获取到该组件的name，如果有name属性就用name，没有就用tag名。
  2. 接下来会将这个name通过include与exclude属性进行匹配，如果匹配到exclude（说明不需要进行缓存）则不进行任何操作直接返回这个组件的 vnode；
  3. 否则的话走下一步缓存。匹配include成功后key在this.cache中查找，命中缓存时会直接从缓存中拿 vnode 的组件实例覆盖到目前的vnode上面，此时重新调整该组件key的顺序，将其从原来的地方删掉并重新放在this.keys中最后一个。
  4. 果没有命中缓存，即该组件还没被缓存过，则以该组件的key为键，组件vnode为值，将其存入this.cache中，并且把key存入this.keys中。
  否则将vnode存储在cache中。最后返回vnode（有缓存时该vnode的componentInstance已经被替换成缓存中的了）。

* 在mounted钩子函数里，调用了pruneCache方法，以观测 include 和 exclude 的变化。如果include 或exclude 发生了变化，即表示定义需要缓存的组件的规则或者不需要缓存的组件的规则发生了变化，那么就执行pruneCache函数。在该函数内对this.cache对象进行遍历，取出每一项的name值，用其与新的缓存规则进行匹配，如果匹配不上，则表示在新的缓存规则下该组件已经不需要被缓存，则调用pruneCacheEntry函数将其从this.cache对象删除即可。




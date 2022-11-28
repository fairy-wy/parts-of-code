### Vuex

Vuex是专门为Vuejs应用程序设计的状态管理工具。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生改变。它集中于MVC模式中的Model层，规定所有数据操作必须通过 action - mutation - statechange 的流程来进行，再结合Vue的数据视图双向绑定特效来实现页面的展示更新。

![](https://img2020.cnblogs.com/blog/2150951/202009/2150951-20200914181639511-333197550.png)

Vue组件接收交互行为，调用dispatch方法触发action相关处理，若页面状态需要改变，则调用commit方法提交mutation修改state，通过getters获取到state新值，提供了mapState、MapGetters、MapActions、mapMutations等辅助函数给开发在vm中处理store，重新渲染Vue Components，页面随之更新。

**vuex的使用**

```js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {}
})

```
```js
// main.js

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

```

**Vuex装载分析**

vuex的store是如何注入到组件中的？

要解答这个问题，我们先从vuex的使用表象上着手，从上面的介绍我们知道，使用vuex之前我们要对vuex进行安装！核心代码如下：
```js
Vue.use(Vuex); // vue的插件机制,安装vuex插件
```
上面的代码得益于vue的插件机制，会在调用vuex的 install方法时，装载vuex! 所以我们直接关注 install方法的实现，其核心代码如下：
```js
Vue.mixin({ beforeCreate: vuexInit });
```
可见，store注入 vue的实例组件的方式，是通过vue的 mixin机制，借助vue组件的生命周期 钩子 beforeCreate 完成的。

即每个vue组件实例化过程中，会在 beforeCreate 钩子前调用 vuexInit 方法。下面，我们将焦点聚焦在 vuexInit 函数。 下面为 vuexInit 的核心代码！
```js
this.$store = typeof options.store === 'function'
    ? options.store()
    : options.store
```
该代码的核心问题是this的指向，得益于mixin机制，this将指向vue组件实例！最终，我们可以再 vue组件实例上获得vuex 的store 对象的引用 $store！图示如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/11/17033b51855fb885~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)


vuex利用了vue的mixin机制，混合 beforeCreate 钩子 将store注入至vue组件实例上，并注册了 vuex store的引用属性 $store！

**核心概念**

* state：提供唯一的公共数据源，所有共享的数据统一放到store的state进行储存，相似与data。在vuex中state中定义数据，可以在任何组件中进行调用.修改state的k里面定义的变量值只能通过Mutation修改，不能直接修改
```html
<!-- 调用1：标签中直接调用-->
<p>{{$store.state.name}}</p>

<!-- 调用2：全局调用-->
this.$store.state.name

<!-- 调用3：从vuex中按需导入mapstate函数 -->
import { mapState } from "vuex";

computed: {
    ...mapState(['name'])
},
create () {
    console.log(this.name)
}
```

* Mutation：更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的事件类型 (type)和一个回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数。使用commit触发Mutation操作

```js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      name: 'zhangsan'
  },
  mutations: {
      setName (state, newName) {
          state.name = newName
      }
  },
  actions: {},
  modules: {}
})
```
```js
// 调用1：使用commit触发Mutation操作
handleClick () {
    this.$store.commit('setName' , 'lisi')
}

// 调用2：使用辅助函数mapMutations进行操作，具体方法同上
import {mapMutations} from 'vuex'

methods: {
    ...mapMutations(['setName']),
    updateState () {
        this.setName('lisi')
    }
}
```

* Action：Action和Mutation相似，Mutation 不能进行异步操作，若要进行异步操作，就得使用Action

```js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      name: 'zhangsan'
  },
  mutations: {
      setName (state, newName) {
          state.name = newName
      }
  },
  actions: {
    //   异步操作mutations
      asynsSetName (context) {
          setTimeOut(() => {
              context.commit('setName', 'lisi')
          }, 1000)
      }
  },
  modules: {}
})
```
```js
// 调用1：使用dispatch触发Mutation操作
handleClick () {
    this.$store.dispatch('asynsSetName')
}

// 调用2：使用辅助函数mapMutations进行操作，具体方法同上
import {mapActions} from 'vuex'

methods: {
    ...mapActions(['asynsSetName']),
    updateState () {
        this.asynsSetName()
    }
}
```

* Getter: 类似于vue中的computed，进行缓存，对于Store中的数据进行加工处理形成新的数据

*  Modules：当遇见大型项目时，数据量大，store就会显得很臃肿，为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：

    * 模块内部的mutation和getter接收的第一个参数是模块的局部状态对象state，即模块内部的state
    * 对于模块内部的actions，局部状态通过context.state暴露出来，根节点状态为context.rootState
    * 对于模块内部的getter。根节点回座位第三个参数暴露出来
    * 使用namespaced: true为当前模块开启独立的命名空间，防止模块中与根节点存在同名方法或者属性
```js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      name: 'zhangsan',
      count: 2
  },
  mutations: {
      setName (state, newName) {
          state.name = newName
      }
  },
  actions: {
    //   异步操作mutations
      asynsSetName (context) {
          setTimeOut(() => {
              context.commit('setName', 'lisi')
          }, 1000)
      }
  },
  modules: {
    userModules: {
        namespaced: true,
        state: {
            name: 'wangwu',
            count: 1
        },
        mutations: {
            addCount (state) {
                // 模块内部的state
                state.count ++
            }
        },
        getters: {
            sumAdd (state, getters, rootState) {
                return state.count + rootState.count  // 3
            }
        },
        actions: {
            increment ({state, commit, rootState}) {}
        },  
    },
    customeModules: {
        namespaced: true,
        state: {},
        mutations: {},
        actions: {}, 
    }
    
  }
```
```js
handleClick () {
    // 调用模块中的state
    console.log(this.$store.state.userModules.name)  // wangwu

    // 调用模块中的getters
    this.$store.getters('userModules/sumAdd')
    
    // 调用模块中的mutations
    this.$store.commit('userModules/addCount')

    // 调用模块中的actions
    this.$store.dispatch('userModules/increment')
}
```

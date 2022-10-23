
### mixins
mixins（混入），官方的描述是一种分发 Vue 组件中可复用功能的非常灵活的方式，mixins是一个js对象，它可以包含我们组件中script项中的任意功能选项，如data、components、methods 、created、computed等等。我们只要将共用的功能以对象的方式传入 mixins选项中，当组件使用 mixins对象时所有mixins对象的选项都将被混入该组件本身的选项中来，这样就可以提高代码的重用性，使你的代码保持干净和易于维护。

**作用**

当我们存在多个组件中的数据或者功能很相近时，我们就可以利用mixins将公共部分提取出来，通过 mixins封装的函数，组件调用他们是不会改变函数作用域外部的，最后达到扩展组件的作用。封装的mixin可以复用。

**创建mixins**

```js
// myMixins.js
export const myMixins = {
    components: {},
    data () {
        return {}
    },
    computed: {},
    created () {},
    mounted () {},
    methods: {}
}
```

**使用mixins**

```vue
<template>
  <div class="hello">
   <div ref="mainRef">{{msg}}</div>
  </div>
</template>
<script>
import myMixins from './mixins/myMixins.js'
export default {
  name: 'HelloWorld',
  mixins: [myMixins]  //mixins的使用
  data () {
    return: {
      msg: 'hello',
      updateCount: 0
    }
  },
  mounted () {},
}
</script>

```

**mixins特点**

* data对象会进行递归合并，如果有冲突存在同名，会使用组件中的数据
* 钩子函数会被合并起来执行，先执行混入的钩子函数，再执行组件对应的钩子函数
* 值为对象的选项，例如method,components,directives等。将会被合并成一个大对象，如果有冲突，以组件中的选项为准

```js
// myMixins.js
export default {
  data () {
    return {
      // myMixins中定义的变量
      message: 'hello',
      foo: 'abc'
    }
  },
  created () {
    // 钩子函数，在组件的created方法执行之前，调用hello方法
    console.log('我是mixins混入的钩子函数created')
    this.hello()
  },
  methods: {
    hello () {
      console.log('hello from mixins!')
    },
    hello2 () {
      console.log('hello2 from mixins!')
    }
  }
}
```
```vue
// test.vue
<template>
  <div></div>
</template>

<script>
// 导入myMixins
import myMixins from './component/myMixins'

export default {
  // 进行混入
  mixins: [myMixins],
  name: 'Test',
  data () {
    return {
      // Test1中定义的变量
      message: 'goodbye',
      bar: 'def'
    }
  },
  created () {
    // 打印数据
    console.log('我是组件中的钩子函数created')
    console.log(this.$data)
    this.hello2()
  },
  methods: {
    // Test中的method方法列表
    hello2 () {
      console.log('hello2 from test')
    }
  }
}
</script>

<style scoped>

</style>
```
执行结果：
```js
// 我是mixins混入的钩子函数created
// hello from mixins!
// 我是组件中的钩子函数created
// {message: 'goodbye', foo: 'abc', bar: 'def'}
// hello2 from test
```

**全局混入/组件混入**

全局混入
<!-- main.js中去全局混入 -->
```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import myMixins from '@/views/mixins-test/component/myMixins'

Vue.config.productionTip = false

// 全局混入
Vue.mixin(myMixins)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

组件混入
```vue
// test.vue
<template>
  <div class="hello"></div>
</template>
<script>
import myMixins from './mixins/myMixins.js'
export default {
  name: 'HelloWorld',
  mixins: [myMixins]  // 组价中mixins的使用

  data () {
    return: {}
  },
  mounted () {},
}
</script>
```

### extends

Vue.extend 属于 Vue 的全局 API，内容都是在 #app 下渲染，注册组件都是在当前位置渲染。如果要实现动态渲染组件,Vue.extend + vm.$mount 组合就派上用场了。

extend 创建的是 Vue 构造器，而不是我们平时常写的组件实例，所以不可以通过 new Vue({ components: testExtend }) 来直接使用，需要通过 new Profile().$mount(’#mount-point’) 来挂载到指定的元素上。

方法一
```vue
div id="mount-point"></div>
// 创建构造器
var Profile = Vue.extend({
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data: function () {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  },
  created () {},
  methods: {}
})

// 创建 Profile 实例，并挂载到一个元素上。
new Profile().$mount('#mount-point')

// 结果如下：
<p>Walter White aka Heisenberg</p>
```

方法二
```js
// extend.js
export default {
  data () {
    return {
      
    }
  },
  created () {
    
  },
  methods: {}
}
```
```vue
// test.vue
<template>
  <div></div>
</template>

<script>
// 导入extend
import extend from './component/extend.js'

export default {

  extends: extend,
  name: 'Test',
  data () {
    return {}
  },
  created () {
  },
  methods: {}
}
</script>
```

**特点**

* extends和mixins类似，通过暴露一个extends对象到组件中使用。
* extends会比mixins先执行。执行顺序：extends > mixins > 组件
* extends只能暴露一个extends对象，暴露多个extends不会执行







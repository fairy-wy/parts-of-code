### 计算属性 computed
特点

* 支持缓存，只有依赖数据发生改变，才会重新进行计算，并进行缓存
* 不支持异步，当 computed 内有异步操作时无效，无法监听数据的变化
* computed 属性值会默认走缓存，计算属性是基于它们的响应式依赖进行缓存的。也就是基 于 data 中声明过或者父组件传递的 props 中的数据通过计算得到的值
* 如果 computed 属性值是函数，那么默认会走 get 方法，函数的返回值就是属性的属性值；在computed中的，属性都有一个get和一个 set 方法，当数据变化时，调用 set 方法

使用场景：一个属性值受多个属性值影响

### 侦听属性 watch

特点

* 不支持缓存，数据变化，直接会触发相应的操作；
* watch 支持异步操作；监听的函数接收两个参数，第一个参数是最新的值；第二个参数是输入之前的值；当一个属性发生变化时，需要执行对应的操作，一对多；
* 监听数据必须是 data 中声明过或者组合式api中声明的响应式值或者父组件传递过来的 props 中的数据。当数据变化时触发其他操作，函数有两个参数：
* watch 默认情况下第一次的时候不会去做监听，如果需要在第一次加载的时候也需要去做监听的话需要设置 immediate:true；
* watch 默认情况下无法监听对象的改变，如果需要进行监听则需要进行深度监听 深度监听需要配置 handler（vue2中才需要） 函数以及 deep 为true。

```js
// vue3.0写法
mport { watch, ref, reactive } from 'vue'

export default {
  setup() {
   let obj= reactive({
        text:'hello'
    })
    watch(obj, (newValue, oldValue) => {
      // 回调函数
    }, {
      immediate: true,  // 第一次加载也需要监听
      deep: true  // 深度监听
    })
    return {
      obj
    }
  }
}
```

使用场景：一个数据影响多个数据

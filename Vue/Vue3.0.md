
### Vue3.0相比Vue2.0优化支处

**1. 虚拟DOM重写**

Vue3.0的虚拟Dom在编译过程中新增PatchFlag的标志对静态节点和动态节点进行区分，PatchFlag是Vue在运行时生成的，用作节点标记在渲染。只有带PatchFlag的这些节点会被真正的追踪，在后续更新的过程中，Vue会知道静态节点不用管，只需要追踪带有PatchFlag的动态节点

```html
<!-- 要编译的代码 -->
<div>
  <span>static<span/>
  <span>{{ msg }}</span>
  <span :id="hello" class="bar">{{ msg }}   </span>
  <span @click="onClick">
    {{msg}}
  </span>
</div>
```
```js
// 将上述代码编译成如下render函数
mport { createVNode as _createVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createBlock as _createBlock } from "vue"

export function render(_ctx, _cache) {
  return (_openBlock(), _createBlock("div", null, [
    _createVNode("span", null, "static"),

    // 下面添加了一个值为1的标记，这个标记就是PatchFlag
    _createVNode("span", null, _toDisplayString(_ctx.msg), 1 /* TEXT */)

    // 这个节点中不仅有TEXT的变化，还有PROPS变化，也就是后面数组中的id。而静态添加的class: "bar"并没有被添加到追踪中。PatchFlag变成了 9 /* TEXT, PROPS */, ["id"]
    _createVNode("span", {
      id: _ctx.hello,
      class: "bar"
    }, _toDisplayString(_ctx.msg), 9 /* TEXT, PROPS */, ["id"])

    // 优化前的
    // _createVNode("span", { onClick: _ctx.onClick }, _toDisplayString(_ctx.msg), 9 /* TEXT, PROPS */, ["onClick"])
    // 优化后
    _createVNode("span", {
      onClick: _cache[1] || (_cache[1] = $event => (_ctx.onClick($event)))
    }, _toDisplayString(_ctx.msg), 1 /* TEXT */)
  ]))
}
```
总结：

* 优化前：在一个默认的Virtual Dom的diff中，需要遍历所有节点，而且每一个节点都要比较旧的props和新的props有没有变化，不可避免的会影响性能

* 优化后：在动态更新时编译器永远只会关注真正会变的东西（即带有PatchFlag标志的节点），既跳出了Virtual Dom 更新性能瓶颈，又保留了可以手写render function的灵活性。

* 优化后：使用cacheHandlers之后，会自动会生成一个内联函数，在内联函数里面在引用当前组件最新的onClick，再把这个内联函数cache起来，第一次渲染的时候，创建这个内联函数，并将这个内联函数缓存起来，后续的更新就从缓存里面读同一个函数，同一个函数就没有更新的必要了，通过这种事件监听缓存的方式也能对性能提升起到作用。

**2. proxy实现响应式原理**

Proxy 对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）。proxy是es6新特性，为了对目标的作用主要是通过handler对象中的拦截方法拦截目标对象target的某些行为（如属性查找、赋值、枚举、函数调用等）。Proxy代理的是整个对象，不是某个特定属性。

```js
/* target: 目标对象，待要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。 */
/* handler: 一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 proxy 的行为。 */ 
const proxy = new Proxy(target, handler);
```

* 2.1 proxy的利弊

优点：3.0 将带来一个基于 Proxy 的 observer 实现，它可以提供覆盖语言 (JavaScript——译注) 全范围的响应式能力，消除了当前 Vue 2 系列中基于 Object.defineProperty 所存在的一些局限，这些局限包括：对属性的添加、删除动作的监测；对数组基于下标的修改、对于 .length 修改的监测；对 Map、Set、WeakMap 和 WeakSet 的支持；

缺点：低版本浏览器的兼容不好，只能兼容ie11以上

* 2.2 基本API

get捕获器 ===> get(target, propKey, receiver)

  * target:目标对象
  * propKey:待拦截属性名
  * receiver: proxy实例
  * 返回： 返回读取的属性
  * 作用：拦截对象属性的读取
  * 拦截操作：proxy[propKey]或者点运算符
  * 对应Reflect： Reflect.get(target, propertyKey, [receiver])

 set捕获器 ===> set(target,propKey, value,receiver)

  * value:新设置的属性值
  * 返回：严格模式下返回true操作成功；否则失败，报错
  * 作用： 拦截对象的属性赋值操作
  * 拦截操作： proxy[propkey] = value
  * 对应Reflect： Reflect.set(obj, prop, value, receiver)
  * 当对象的属性writable为false时，该属性不能在拦截器中被修改

deleteProperty 捕获器 ===> deleteProperty(target, propKey)
    
  * 返回：严格模式下只有返回true, 否则报错
  * 作用： 拦截删除target对象的propKey属性的操作
  * 拦截操作： delete proxy[propKey]
  * 对应Reflect： Reflect.delete(obj, prop)
  * 属性是不可配置属性时（configurable: false），不能删除

has捕获器 ===> has(target, propKey)

  * 作用: 拦截判断target对象是否含有属性propKey的操作
  * 拦截操作： propKey in proxy; 不包含for…in循环
  * 对应Reflect: Reflect.has(target, propKey)

ownKeys 捕获器 ===> ownKeys(target)
    
  * 返回： 数组（数组元素必须是字符或者Symbol,其他类型报错）
  * 作用： 拦截获取键值的操作
  * 拦截操作： Object.getOwnPropertyNames(proxy)  Object.getOwnPropertySymbols(proxy)  Object.keys(proxy)  for…in…循环
  * 对应Reflect： Reflect.delete(obj, prop)
  * 对应Reflect：Reflect.ownKeys()

* 2.3 原理

reactive函数把对象处理成响应式

利用reactive函数自己去确定哪些数据为响应式数据，如果目标对象target是readonly对象，直接返回目标对象，因为readonly对象不能设置成响应式对象；反之调用createReactiveObject函数继续流程。createReactiveObject 通过使用Proxy函数劫持target对象创建并返回响应式对象。eactive可递归调用（递归处理对象的属性还是对象的情况）

track 收集依赖

实现响应式，就是当数据变化后会自动实现一些功能，比如执行某些函数等。因为副作用渲染函数（effct函数）能触发组件的重新渲染而更新DOM，所以这里收集的依赖就是当数据变化后需要执行的副作用渲染函数。当执行get函数时就会收集对应组件的副作用渲染函数。

依赖收集的过程会创建三个集合，分别是targetMap,depsMap以及dep。targetMap 是一个 WeakMap，其 key 值是当前的 Proxy 对象 而 value 则是该对象所对应的 depsMap。depsMap 是一个 Map，key 值为触发 getter 时的属性值，而 value 则是触发过该属性值所对应的各个 effect.

trigger 分发依赖

trigger就是从get函数中收集来的依赖targetMap中找到对应的函数，然后执行这些副作用渲染函数，更新DOM。

**3. 生命周期**

* obeforeCreate===>setup(): 组件创建之前
* created =======> setup()：组件创建完成
* beforeMount ===> onBeforeMount：组件挂载之前
* mounted =======> onMounted：组件挂载完成
* beforeUpdate ===> onBeforeUpdate：组件更新之前
* updated =======>onUpdated：组件更新完成
* beforedestroy ==> onBeforeUnmount：组件销毁之前
* destroyed =====> onUnmounted：组件销毁完成

**4. 组合式API（composition API）**

```vue
<template>
  <!-- 父组件 -->
  <div class="father">
    <Child :name="name" :age="age" :height="height" @onAfterAYear="changeData" />
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import Child from '@/components/child'

export default {
  name: "Father",
  components: { Child },
  setup () {
    let state = reactive({
      name: '小明',
      age: 12,
      height: 155
    })

    const changeData = () => {
      state.name = '大明'
      state.age = 13
      state.height = 169
    }
    onMounted(() => {
      console.log('component is onMounted')
    })

    return {
      ...toRefs(state),
      onMounted,
      changeData
    }
  }
};
```













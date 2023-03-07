### 计算属性 computed
特点

* 支持缓存，只有依赖数据发生改变，才会重新进行计算，并进行缓存
* 不支持异步，当 computed 内有异步操作时无效，无法监听数据的变化
* computed 属性值会默认走缓存，计算属性是基于它们的响应式依赖进行缓存的。也就是基 于 data 中声明过或者父组件传递的 props 中的数据通过计算得到的值
* 如果 computed 属性值是函数，那么默认会走 get 方法，函数的返回值就是属性的属性值；在computed中的，属性都有一个get和一个 set 方法，当数据变化时，调用 set 方法

使用场景：一个属性值受多个属性值影响

**如何实现缓存**

下面将围绕一个例子，讲解一下computed初始化及更新时的流程，来看看计算属性是怎么实现的缓存，及依赖是怎么被收集的。

```html
<div id="app">
  <span @click="change">{{sum}}</span>
</div>
<script src="./vue2.6.js"></script>
<script>
  new Vue({
    el: "#app",
    data() {
      return {
        count: 1,
      }
    },
    methods: {
      change() {
        this.count = 2
      },
    },
    computed: {
      sum() {
        return this.count + 1
      },
    },
  })
</script>
```
* 初始化 computed：vue初始化时先执行init方法，里面的initState会进行计算属性的初始化
```js
if (opts.computed) {initComputed(vm, opts.computed);}
// 下面是initComputed的代码

var watchers = vm._computedWatchers = Object.create(null); 
// 依次为每个 computed 属性定义一个计算watcher
for (const key in computed) {
  const userDef = computed[key]
  watchers[key] = new Watcher(
      vm, // 实例
      getter, // 用户传入的求值函数 sum
      noop, // 回调函数 可以先忽视
      { lazy: true } // 声明 lazy 属性 标记 computed watcher
  )
  // 用户在调用 this.sum 的时候，会发生的事情
  defineComputed(vm, key, userDef)
}
// 每个计算属性对应的计算watcher的初始状态如下：

{
    deps: [],
    dirty: true,
    getter: ƒ sum(),
    lazy: true,
    value: undefined
}
```
可以看到它的 value 刚开始是 undefined，lazy 是 true，说明它的值是惰性计算的，只有到真正在模板里去读取它的值后才会计算。这个 dirty 属性其实是缓存的关键，先记住它。接下来看看比较关键的 defineComputed，它决定了用户在读取 this.sum 这个计算属性的值后会发生什么，继续简化，排除掉一些不影响流程的逻辑。
```js
Object.defineProperty(target, key, { 
    get() {
        // 从刚刚说过的组件实例上拿到 computed watcher
        const watcher = this._computedWatchers && this._computedWatchers[key]
        if (watcher) {
          // 只有dirty了才会重新求值
          if (watcher.dirty) {
            // 这里会求值，会调用get，会设置Dep.target
            watcher.evaluate()
          }
          // 这里也是个关键 等会细讲
          if (Dep.target) {
            watcher.depend()
          }
          // 最后返回计算出来的值
          return watcher.value
        }
    }
})
```
这个函数需要仔细看看，它做了好几件事，我们以初始化的流程来讲解它：首先 dirty 这个概念代表脏数据，说明这个数据需要重新调用用户传入的 sum 函数来求值了。我们暂且不管更新时候的逻辑，第一次在模板中读取到 {{sum}} 的时候它一定是 true，所以初始化就会经历一次求值。
```js
evaluate () {
  // 调用 get 函数求值
  this.value = this.get()
  // 把 dirty 标记为 false
  this.dirty = false
}
```
这个函数其实很清晰，它先求值，然后把 dirty 置为 false。再回头看看我们刚刚那段 Object.defineProperty 的逻辑，下次没有特殊情况再读取到 sum 的时候，发现 dirty是false了，是不是直接就返回 watcher.value 这个值就可以了，这其实就是计算属性缓存的概念。

* 依赖收集：初始化完成之后，最终会调用render进行渲染，而render函数会作为watcher的getter，此时的watcher为渲染watcher。
```js
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
// 创建一个渲染watcher，渲染watcher初始化时，就会调用其get()方法，即render函数，就会进行依赖收集
new Watcher(vm, updateComponent, noop, {}, true /* isRenderWatcher */)
看一下watcher中的get方法

get () {
    // 将当前watcher放入栈顶，同时设置给Dep.target
    pushTarget(this)
    let value
    const vm = this.vm
    // 调用用户定义的函数，会访问到this.count，从而访问其getter方法，下面会讲到
    value = this.getter.call(vm, vm)
    // 求值结束后，当前watcher出栈
    popTarget()
    this.cleanupDeps()
    return value
 }
```
渲染watcher的getter执行时（render函数），会访问到this.sum，就会触发该计算属性的getter，即在initComputed时定义的该方法，会把与sum绑定的计算watcher得到之后，因为初始化时dirty为true，会调用其evaluate方法，最终会调用其get()方法，把该计算watcher放入栈顶，此时Dep.target也为该计算watcher。

接着调用其get方法，就会访问到this.count，会触发count属性的getter（如下），就会将当前Dep.target存放的watcher收集到count属性对应的dep中。此时求值结束，调用popTarget()将该watcher出栈，此时上个渲染watcher就在栈顶了，Dep.target重新为渲染watcher。
```js
// 在闭包中，会保留对于 count 这个 key 所定义的 dep
const dep = new Dep()

// 闭包中也会保留上一次 set 函数所设置的 val
let val

Object.defineProperty(obj, key, {
  get: function reactiveGetter () {
    const value = val
    // Dep.target 此时就是计算watcher
    if (Dep.target) {
      // 收集依赖
      dep.depend()
    }
    return value
  },
})
// dep.depend()
depend () {
  if (Dep.target) {
    Dep.target.addDep(this)
  }
}
// watcher 的 addDep函数
addDep (dep: Dep) {
  // 这里做了一系列的去重操作 简化掉 

  // 这里会把 count 的 dep 也存在自身的 deps 上
  this.deps.push(dep)
  // 又带着 watcher 自身作为参数
  // 回到 dep 的 addSub 函数了
  dep.addSub(this)
}
class Dep {
  subs = []

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
}
```
通过这两段代码，计算watcher就被属性所绑定dep所收集。watcher依赖dep，dep同时也依赖watcher，它们之间的这种相互依赖的数据结构，可以方便知道一个watcher被哪些dep依赖和一个dep依赖了哪些watcher。接着执行watcher.depend()
```js
// watcher.depend
depend () {
  let i = this.deps.length
  while (i--) {
    this.deps[i].depend()
  }
}
还记得刚刚的 计算watcher 的形态吗？它的 deps 里保存了 count 的 dep。也就是说，又会调用 count 上的 dep.depend()

class Dep {
  subs = []

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
}
```
这次的 Dep.target 已经是 渲染watcher 了，所以这个 count 的 dep 又会把 渲染watcher 存放进自身的 subs 中。最终count的依赖收集完毕，它的dep为:
```js
{
    subs: [ sum的计算watcher，渲染watcher ]
}
```

* 派发更新：那么来到了此题的重点，这时候 count 更新了，是如何去触发视图更新的呢？再回到 count 的响应式劫持逻辑里去：
```js
// 在闭包中，会保留对于 count 这个 key 所定义的 dep
const dep = new Dep()

// 闭包中也会保留上一次 set 函数所设置的 val
let val

Object.defineProperty(obj, key, {
  set: function reactiveSetter (newVal) {
      val = newVal
      // 触发 count 的 dep 的 notify
      dep.notify()
    }
  })
})
```
这里触发了我们刚刚精心准备的 count 的 dep 的 notify 函数。
```js
class Dep {
  subs = []

  notify () {
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```
这里的逻辑就很简单了，把 subs 里保存的 watcher 依次去调用它们的 update 方法，也就是；调用 计算watcher 的 update；调用 渲染watcher 的 update；计算watcher的update
```js
update () {
  if (this.lazy) {
    this.dirty = true
  }
}
```
仅仅是把 计算watcher 的 dirty 属性置为 true，静静的等待下次读取即可（再次执行render函数时，会再次访问到sum属性，此时的dirty为true，就会进行再次求值）。渲染watcher的update。这里其实就是调用 vm._update(vm._render()) 这个函数，重新根据 render 函数生成的 vnode 去渲染视图了。而在 render 的过程中，一定会访问到su 这个值，那么又回到sum定义的get上：
```js
Object.defineProperty(target, key, { 
    get() {
        const watcher = this._computedWatchers && this._computedWatchers[key]
        if (watcher) {
          // 上一步中 dirty 已经置为 true, 所以会重新求值
          if (watcher.dirty) {
            watcher.evaluate()
          }
          if (Dep.target) {
            watcher.depend()
          }
          // 最后返回计算出来的值
          return watcher.value
        }
    }
})
```
由于上一步中的响应式属性更新，触发了 计算 watcher 的 dirty 更新为 true。所以又会重新调用用户传入的 sum 函数计算出最新的值，页面上自然也就显示出了最新的值。至此为止，整个计算属性更新的流程就结束了。

**小结**

* 初始化data和computed,分别代理其set以及get方法, 对data中的所有属性生成唯一的dep实例。
* 对computed中的sum生成唯一watcher,并保存在vm._computedWatchers中
* 执行render函数时会访问sum属性，从而执行initComputed时定义的getter方法，会将Dep.target指向sum的watcher,并调用该属性具体方法sum。
* sum方法中访问this.count，即会调用this.count代理的get方法，将this.count的dep加入sum的watcher,同时该dep中的subs添加这个watcher。
* 设置vm.count = 2，调用count代理的set方法触发dep的notify方法，因为是computed属性，只是将watcher中的dirty设置为true。
* 最后一步vm.sum，访问其get方法时，得知sum的watcher.dirty为true,调用其watcher.evaluate()方法获取新的值。

总结：初始刷时会为computed的计算属性生成唯一的watcher实例，并且初始化的时候值为undefined，dirty属性标识是否需要进行重新计算，初始化的时候为true,在计算属性时候会访问到data里的属性，会调用data中的响应式代理的get方法，从而计算出计算属性的值并且将dirty值置为false,下次使用直接使用缓存，不用重新计算。在data的属性值变化的时候更新方法中会将当前watcher对应的dirty置为true,如此依赖该data属性的计算属性在render访问时就会重新计算。从未达到computed缓存效果



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

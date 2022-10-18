### 响应式原理

Vue.js 实现响应式的核心是利用了 ES5 的 Object.defineProperty

#### vue数据初始化
在 Vue 的初始化阶段，_init 方法执行的时候，会执行 initState(vm) 方法，

```js
function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  // 初始化props
  if (opts.props) { initProps(vm, opts.props); }
  // 初始化methods
  if (opts.methods) { initMethods(vm, opts.methods); }
  // 初始化data
  if (opts.data) {
    initData(vm);
  } else {
    // 如果没有定义data，则创建一个空对象，并设置为响应式
    observe(vm._data = {}, true /* asRootData */);
  }
  // 初始化computed
  if (opts.computed) { initComputed(vm, opts.computed); }
  // 初始化watch
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
```

* initState 方法:主要是对 props、methods、data、computed 和 wathcer 等属性做了初始化操作.

* initProps 方法：props 的初始化主要过程，就是遍历定义的 props 配置。遍历的过程主要做两件事情：一个是调用 defineReactive 方法将组件的props数据设置为响应式数据;二是proxy(vm, "_props", key);为props做了一层代理，用户通过vm.xxx可以代理访问到vm._props上的值。

* initData 方法：data在初始化选项合并时会生成一个函数，只有在执行函数时才会返回真正的数据，所以initData方法会先执行拿到组件的data数据，并且会对对象每个属性的命名进行校验，保证不能和props，methods重复。最后的核心方法是observe,observe方法（observe具体的行为是将数据对象添加一个不可枚举的属性__ob__，标志对象是一个响应式对象，并且拿到每个对象的属性值，重写getter,setter方法）是将数据对象标记为响应式对象，并对对象的每个属性进行响应式处理；proxy会对data做一层代理，直接通过vm.XXX可以代理访问到vm._data上挂载的对象属性。

```js
function initData(vm) {
  var data = vm.$options.data;
  // 根实例时，data是一个对象，子组件的data是一个函数，其中getData会调用函数返回data对象
  data = vm._data = typeof data === 'function'? getData(data, vm): data || {};
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    {
      // 命名不能和方法重复
      if (methods && hasOwn(methods, key)) {
        warn(("Method \"" + key + "\" has already been defined as a data property."),vm);
      }
    }
    // 命名不能和props重复
    if (props && hasOwn(props, key)) {
      warn("The data property \"" + key + "\" is already declared as a prop. " + "Use prop default value instead.",vm);
    } else if (!isReserved(key)) {
      // 数据代理，用户可直接通过vm实例返回data数据
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}
```

#### 响应式系统核心

* Observer类，实例化一个Observer类会通过Object.defineProperty对数据的getter,setter方法进行改写，在getter阶段进行依赖的收集,在数据发生更新阶段，触发setter方法进行依赖的更新
* Watcher类，实例化watcher类相当于创建一个依赖，简单的理解是数据在哪里被使用就需要产生了一个依赖。当数据发生改变时，会通知到每个依赖进行更新，前面提到的渲染wathcer便是渲染dom时使用数据产生的依赖。
* Dep类，既然watcher理解为每个数据需要监听的依赖，那么对这些依赖的收集和通知则需要另一个类来管理，这个类便是Dep,Dep需要做的只有两件事，收集依赖和派发更新依赖。

**observe** 

在 vue 初始化的时候，initState 方法中会调用一个方法 observe，observe看obj身上有没有 __ob__ 属性,如果没有的话就实例化一个 new Observer实例.
```js
export function observe(value) {
  // 如果value不是对象，什么都不做
  if (typeof value != 'object') return
  // 定义ob
  var ob
  if (typeof value.__ob__ !== 'undefined') {
    // 判断对象是否有__ob__这个属性，可以理解为响应式标志
    ob = value.__ob__
  } else {
    //如果没有的话就生成一个实例对象，Observer类的内部去转化生生一个响应式对象
    ob = new Observer(value)
  }
  return ob
}
```

**Observer 类（观察者）**

这个类的目的是将数据变成响应式对象，利用Object.defineProperty对数据的getter,setter方法进行改写。在数据读取getter阶段我们会进行依赖的收集，在数据的修改setter阶段，我们会进行依赖的更新.因此在数据初始化阶段，我们会利用Observer这个类为data添加一个__ob__属性， __ob__属性是作为响应式对象的标志,将数据对象修改为相应式对象，而这是所有流程的基础。
```js
export default class Observer {
  constructor(value) {
    // 每一个Observer的实例身上，都有一个dep
    this.dep = new Dep()
    // 给实例（this，一定要注意，构造函数中的this不是表示类本身，而是表示实例）添加了__ob__属性，值是这次new的实例
    def(value, '__ob__', this, false)
    // 不要忘记初心，Observer类的目的是：将一个正常的object转换为每个层级的属性都是响应式（可以被侦测的）的object
    // 检查它是数组还是对象
    if (Array.isArray(value)) {
      // 如果是数组，要非常强行的蛮干：将这个数组的原型，指向arrayMethods
      Object.setPrototypeOf(value, arrayMethods)
      // 让这个数组变的observe
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  // 遍历
  walk(value) {
    for (let k in value) {
      defineReactive(value, k)
    }
  }
  // 数组的特殊遍历
  observeArray(arr) {
    for (let i = 0, l = arr.length; i < l; i++) {
      // 逐项进行observe
      observe(arr[i])
    }
  }
}
```
由于Object.defineProperty不支持数组的检测，所以当数据是数组时，为了让其也变成响应式添加__ob__属性，因此需要特殊处理一个数组数据。本质上就是重写数组上面的七个方法

值得注意的是 push，unshift，splice 三个方法会插入新的数据，此时为了使其也成为响应式数据，需要再次调用 Observer 类里面的 observeArray 方法，遍历每一项使其具有响应式。注意def的第三个参数是函数，也就是给定义的新方法名定义的函数，只有调用这个方法名的时候才会调用这些新方法。所以初始化data中有数组，不直接调用方法的原因。
```js
// 得到Array.prototype
const arrayPrototype = Array.prototype

// 以Array.prototype为原型创建arrayMethods对象，并暴露
export const arrayMethods = Object.create(arrayPrototype)

// 要被改写的7个数组方法
const methodsNeedChange = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
]

methodsNeedChange.forEach((methodName) => {
  // 备份原来的方法，因为push、pop等7个函数的功能不能被剥夺
  const original = arrayPrototype[methodName]
  // 定义新的方法
  def(
    arrayMethods,
    methodName,
    function () {
      // 恢复原来的功能
      const result = original.apply(this, arguments)
      // 把类数组对象变为数组
      const args = [...arguments]
      // 把这个数组身上的__ob__取出来，__ob__已经被添加了，为什么已经被添加了？因为数组肯定不是最高层，比如obj.g属性是数组，obj不能是数组，第一次遍历obj这个对象的第一层的时候，已经给g属性（就是这个数组）添加了__ob__属性。
      const ob = this.__ob__

      // 有三种方法push\unshift\splice能够插入新项，现在要把插入的新项也要变为observe的
      let inserted = []

      switch (methodName) {
        case 'push':
        case 'unshift':
          inserted = args
          break
        case 'splice':
          // splice格式是splice(下标, 数量, 插入的新项)
          inserted = args.slice(2)
          break
      }

      // 判断有没有要插入的新项，让新项也变为响应的
      if (inserted) {
        ob.observeArray(inserted)
      }
      // 新插入的数据也会触发依赖通知watcher更新视图
      ob.dep.notify()
      return result
    },
    false
  )
})
```

**Object.defineProperty**

defineReactive###1是响应式构建的核心.defineReactive 函数最开始初始化 Dep 对象的实例，接着拿到 obj 的属性描述符，然后对子对象递归调用 observe 方法，这样就保证了无论 obj 的结构多复杂，它的所有子属性也能变成响应式的对象，这样我们访问或修改 obj 中一个嵌套较深的属性，也能触发 getter 和 setter。最后利用 Object.defineProperty 去给 obj 的属性 key 添加 getter 和 setter。

```js
export default function defineReactive(data, key, val) {
  const dep = new Dep()
  // 如果参数只有两个的话，val值就是传入对象中的那个key的值
  if (arguments.length == 2) {
    val = data[key]
  }

  // 子元素要进行observe，至此形成了递归。这个递归不是函数自己调用自己，而是多个函数、类循环调用
  let childOb = observe(val) //形成递归的关键

  Object.defineProperty(data, key, {
    // 可枚举
    enumerable: true,
    // 可以被配置，比如可以被delete
    configurable: true,
    // getter
    get() {
      console.log('你试图访问' + key + '属性')
      // 如果现在处于依赖收集阶段
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
        }
      }
      return val
    },
    // setter
    set(newValue) {
      console.log('你试图改变' + key + '属性', newValue)
      if (val === newValue) {
        return
      }
      val = newValue
      // 当设置了新值，这个新值也要被observe
      childOb = observe(newValue)
      // 发布订阅模式，通知dep
      dep.notify()
    },
  })
}
```

#### 依赖收集
需要用到数据的地方，称为依赖.在 getter 中收集依赖，在 setter 中触发依赖。

defineReactive 方法里，开始会声明一个 const dep = new Dep(),在 get 函数中通过 dep.depend 做依赖收集，set 中 dep.notify()触发依赖。
主要有两个重要的类 Dep 类和 Watcher 类

**Dep 类(订阅者)**

通过 defineReactive 方法将 data 中的数据进行响应式后，虽然可以监听到数据的变化了，但是无法通知视图更新，此时 Dep 就是帮我们收集【究竟要通知到哪里的】。我们如何知道 data 中的某个属性被使用了，答案就是 defineReactive 中 Object.defineProperty 的 get 读取属性时候.

Dep 实际上就是对 Watcher 的一种管理，Dep收集的依赖就是Watcher，它的主要作用是用来存放 Watcher 观察者对象。我们可以把 Watcher 理解成一个中介的角色，数据发生变化时通知它，然后它再通知其他地方。

依赖收集阶段会做下面几件事：

1. 为当前的watcher(该场景下是渲染watcher)添加拥有的数据。
2. 为当前的数据收集需要监听的依赖

```js
let uid = 0
export default class Dep {
  constructor() {
    this.id = uid++
    // 用数组存储自己的订阅者。subs是英语subscribes订阅者的意思。
    // 这个数组里面放的是Watcher的实例
    this.subs = []
  }
  // 添加订阅
  addSub(sub) {
    this.subs.push(sub)
  }
  // 添加依赖
  depend() {
    // Dep.target就是一个我们自己指定的全局的位置，你用window.target也行，只要是全剧唯一，没有歧义就行
    // 因为在同一时间只能有一个全局的 Watcher 被计算，另外它的自身属性 subs 也是 Watcher 的数组
    if (Dep.target) {
      this.addSub(Dep.target)
    }
  }
  // 通知更新
  notify() {
    // 浅克隆一份
    const subs = this.subs.slice()
    // 遍历
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```

**Watcher 类 (监听器)**

Watcher 是一个中介，通过观察依赖，在数据发生变化时通过 Watcher 中转，通知组件更新。

- 依赖就是 Watcher。只有 Watcher 触发的 getter 才会收集依赖，哪个 Watcher 触发了 getter，就把哪个 Watcher 收集到 Dep 中

* data中属性值被访问时，会被getter函数拦截，根据我们旧有的知识体系可以知道，实例挂载前会创建一个渲染watcher。与此同时，updateComponent的逻辑会执行实例的挂载，在这个过程中，模板会被优先解析为render函数，而render函数转换成Vnode时，会访问到定义的data数据，这个时候会触发gettter进行依赖收集。而此时数据收集的依赖就是这个渲染watcher本身。

* computed的初始化过程也会遍历computed的每一个属性值，并为每一个属性实例化一个computed watcher，其中{ lazy: true}是computed watcher的标志，最终会调用defineComputed将数据设置为响应式数据

- Dep 使用发布订阅模式，当数据发生变化时，会循环依赖列表，把所有的 Watcher 都通知一遍
- Watcher 把自己设置到全局的一个指定位置，然后读取数据，因为读取了数据，所以会触发这个数据的 getter。在 getter 中就能得到当前正在读取数据的 Watcher，并把这个 Watcher 收集到 Dep 中

```js
let uid = 0
export default class Watcher {
  constructor(target, expression, callback) {
    this.id = uid++
    // 目标对象
    this.target = target
    // 传入的点语法字符串expression，通过方法获取深层的值
    this.getter = parsePath(expression)
    this.callback = callback
    this.value = this.get()
  }
  update() {
    // 更新时，调用run方法
    this.run()
  }
  get() {
    // 进入依赖收集阶段。让全局的Dep.target设置为Watcher本身，那么就是进入依赖收集阶段
    Dep.target = this
    const obj = this.target
    let value

    // 只要能找，就一直找
    try {
      value = this.getter(obj)
    } finally {
      // 找不到时，就设置为空
      Dep.target = null
    }

    return value
  }
  run() {
    // 得到并唤起方法传入回调函数
    this.getAndInvoke(this.callback)
  }
  getAndInvoke(cb) {
    const value = this.get()

    if (value !== this.value || typeof value == 'object') {
      const oldValue = this.value
      this.value = value
      // 回调函数三个参数 目标对象，新值，旧值
      cb.call(this.target, value, oldValue)
    }
  }
}

```

#### 派发更新
派发更新阶段会做以下几件事：

* 判断数据更改前后是否一致，如果数据相等则不进行任何派发更新操作。
* 新值为对象时，会对该值的属性进行依赖收集过程。
* 通知该数据收集的watcher依赖,遍历每个watcher进行数据更新,这个阶段是调用该数据依赖收集器的dep.notify方法进行更新的派发。
* 更新时会将每个watcher推到队列中，等待下一个tick到来时取出每个watcher进行run操作





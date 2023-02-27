
#### 前言

js的Dom更新是同步的，vue的Dom更新是异步的

### vue异步更新原理

#### vue的更新是批量且异步的

Vue 在更新 DOM 时是异步执行的。当数据发生变化，Vue将开启一个异步更新队列，视图需要等队列中所有数据变化完成之后，再统一进行更新

首先看一个例子
、
```vue
<template>
  <div class="hello">
   <div ref="mainRef">{{msg}}</div>
   <p ref="ageRef">年龄： {{age}}</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return: {
      msg: 'hello',
      updateCount: 0,
      age: 18
    }
  },
  mounted () {
    this.msg = 'goodBye'
    this.age = 20

    console.log('sync', this.$refs.mainRef.innerText)  // sync hello
    console.log('sync', this.$refs.ageRef.innerText)  // sync 18

    this.$nextTick(() => {
      console.log('nextTick', this.$refs.mainRef.innerText)  //nextTick goodBye
      console.log('nextTick', this.$refs.ageRef.innerText)  // nextTick 20
    })
  },
  // 更新钩子函数
  updated () {
    this.updateCount ++ 
    console.log(this.updateCount)  // 1
  }
}
</script>

```
以上例子分析：

* 我们对两种数据进行修改时，updated钩子函数只会执行一次，也就我们同时更新了多个数据，Dom只会更新一次。
* 数据修改后，Dom的中的数据并没有马上更新，我们拿到的依然是更新前的数据。在$nextTick里面才拿到了更新的数据
* 数据在发现变化的时候，vue并不会立刻去更新Dom，而是将修改数据的操作放在了一个异步操作队列中，如果我们一直修改相同数据，异步操作队列还会进行去重，等待同一事件循环中的所有数据变化完成之后，会将队列中的事件拿来进行处理，进行DOM的更新

#### 异步更新原理剖析
Vue中DOM更新一定是由于数据变化引起的，由响应式原理可知，数据的变动触发set的派发更新，通过dep.notify通知watcher更新
```js
// src/core/observer/watcher.js
class Dep {
    notify() {
    //subs是Watcher的实例数组
    const subs = this.subs.slice()
    for(let i=0, l=subs.length; i<l; i++){
        subs[i].update()
    }
  }
}
```

遍历subs里每一个Watcher实例，然后调用实例的update方法，update方法里面记录了更新的Dom的方法.vue默认就是走的异步更新机制，它会实现一个队列进行缓存当前需要更新的watcher
```js
// watcher.js
// 当依赖发生变化时，触发更新
update() {
  if(this.lazy) {
    // 懒执行会走这里, 比如computed
    this.dirty = true
  }else if(this.sync) {
    // 同步执行会走这里，比如this.$watch() 或watch选项，传递一个sync配置{sync: true}
    this.run()
  }else {
    // 将当前watcher放入watcher队列， 一般都是走这里
    queueWatcher(this)
  }
​
} 

```
```js
// scheduler.js
/*将一个观察者对象push进观察者队列，在队列中已经存在相同的id则该观察者对象将被跳过，除非它是在队列被刷新时推送*/
export function queueWatcher (watcher: Watcher) {
  /*获取watcher的id*/
  const id = watcher.id
  /*检验id是否存在，已经存在则直接跳过，不存在则标记在has中，用于下次检验*/
  if (has[id] == null) {
    has[id] = true
    // 如果flushing为false， 表示当前watcher队列没有在被刷新，则watcher直接进入队列
    if (!flushing) {
      queue.push(watcher)
    } else {
      // 如果watcher队列已经在被刷新了，这时候想要插入新的watcher就需要特殊处理
      // 保证新入队的watcher刷新仍然是有序的
      let i = queue.length - 1
      while (i >= 0 && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      // wating为false，表示当前浏览器的异步任务队列中没有flushSchedulerQueue函数
      waiting = true
      // 这就是我们常见的this.$nextTick 
      nextTick(flushSchedulerQueue)
    }
  }
```
以上vue并不是跟随数据变化立即更新视图的，它而是维护了一个异步操作队列（watcher队列），并且id重复的watcher只会推进队列一次，将刷新队列的方法（flushSchedulerQueue）通过nextTick使其在下一个事件循环中进行执行，刷新队列时，依次调用watcher的run方法进行更新dom，更新视图。

```js
// 更新视图的具体方法
function flushSchedulerQueue() {
  let watcher, id;
  // 排序，先渲染父节点，再渲染子节点
  // 这样可以避免不必要的子节点渲染，如：父节点中 v-if 为 false 的子节点，就不用渲染了
  queue.sort((a, b) => a.id - b.id);
  // 遍历所有 Watcher 进行批量更新。
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    // 更新 DOM
    watcher.run();
  }
}
```

### nextTick
nextTick -- 将传入的flushSchedulerQueue 添加到callbacks 数组中，然后执行了timerFunc 方法。

```js
// next-tick.js
const callbacks = []
let pending = false

export function nextTick (cb, ctx) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  // 因为内部会调nextTick，用户也会调nextTick，但异步只需要一次
  if (!pending) {
    pending = true
    timerFunc()
  }
  // 执行完会会返回一个promise实例，这也是为什么$nextTick可以调用then方法的原因
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
} 
```

timerFunc方法 -- 是根据浏览器兼容性创建的一个异步方法，执行完该方法就会调用flushSchedulerQueue 方法进行具体的DOM更新。
```js
复制代码
let timerFunc;
// 判断是否兼容 Promise
if (typeof Promise !== "undefined") {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks);
  };
  // 判断是否兼容 MutationObserver
  // https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
} else if (typeof MutationObserver !== "undefined") {
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  // 判断是否兼容 setImmediate
  // 该方法存在一些 IE 浏览器中
} else if (typeof setImmediate !== "undefined") {
  // 这是一个宏任务，但相比 setTimeout 要更好
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // 如果以上方法都不知道，使用 setTimeout 0
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

// 异步执行完后，执行所有的回调方法，也就是执行 flushSchedulerQueue
function flushCallbacks() {
  for (let i = 0; i < copies.length; i++) {
    callbacks[i]();
  }
}
```

**总结**

Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个异步操作队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher（数据多次变更） 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。

nextTick函数（即下一个事件循环的“tick”）。传入的回调函数（Dom更新的方法）会在callbacks中存起来，根据一个状态标记 pending 来判断当前是否要执行 timerFunc()。

timerFunc() 是根据当前环境判断使用哪种方式实现，按照 Promise.then和 MutationObserver以及setImmediate的优先级来判断，支持哪个就用哪个，如果执行环境不支持，就会降级为 setTimeout 0，尽管它有执行延迟，可能造成多次渲染，timerFunc()函数中会执行 flushCallbacks函数进行Dom更新，从而实现异步更新。









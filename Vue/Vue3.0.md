### 设计目标

不以解决实际业务痛点的更新都是耍流氓，下面我们来列举一下Vue3之前我们或许会面临的问题

* 随着功能的增长，复杂组件的代码变得越来越难以维护
* 缺少一种比较「干净」的在多个组件之间提取和复用逻辑的机制
* 类型推断不够友好
* bundle的时间太久了

而 Vue3 做了哪些事情？

* 更小：

    * Vue3移除一些不常用的 API。

    * 引入tree-shaking，可以将无用模块“剪辑”，仅打包需要的，使打包的整体体积变小了,Tree shaking是基于ES6模板语法（import与exports），主要是借助ES6模块的静态编译思想，在编译时就能确定模块的依赖关系，以及输入和输出的变量.Tree shaking无非就是做了两件事：

        * 编译阶段利用ES6 Module判断哪些模块已经加载
        * 判断那些模块和变量未被使用或者引用，进而删除对应代码


* 更快

    * diff算法优化：vue3在diff算法中相比vue2增加了静态标记，关于这个静态标记，其作用是为了会发生变化的地方添加一个flag标记，下次发生变化的时候直接找该地方进行比较。

    * 静态提升：Vue3中对不参与更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用，这样就免去了重复的创建节点，大型应用会受益于这个改动，免去了重复的创建操作，优化了运行时候的内存占用
    ```html
    <span>你好</span>
    <div>{{ message }}</div>
    ```
    ```js
    // 没有做静态提升之前
    export function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (_openBlock(), _createBlock(_Fragment, null, [
        _createVNode("span", null, "你好"),
        _createVNode("div", null, _toDisplayString(_ctx.message), 1 /* TEXT */)
    ], 64 /* STABLE_FRAGMENT */))
    }
    ```
    ```js
    // 做了静态提升之后
    const _hoisted_1 = /*#__PURE__*/_createVNode("span", null, "你好", -1 /* HOISTED */)

    export function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (_openBlock(), _createBlock(_Fragment, null, [
        _hoisted_1,
        _createVNode("div", null, _toDisplayString(_ctx.message), 1 /* TEXT */)
    ], 64 /* STABLE_FRAGMENT */))
    }
    // Check the console for the AST
    // 静态内容_hoisted_1被放置在render 函数外，每次渲染的时候只要取 _hoisted_1 即可
    // 同时 _hoisted_1 被打上了 PatchFlag ，静态标记值为 -1 ，特殊标志是负整数表示永远不会用于 Diff
    ```

    * 事件监听缓存：默认情况下绑定事件行为会被视为动态绑定，所以每次都会去追踪它的变化
    ```html
    <div>
        <button @click = 'onClick'>点我</button>
    </div>
    ```
    ```js
    // 没开启事件监听器缓存
    export const render = /*#__PURE__*/_withId(function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (_openBlock(), _createBlock("div", null, [
        _createVNode("button", { onClick: _ctx.onClick }, "点我", 8 /* PROPS */, ["onClick"])
                                                // PROPS=1<<3,// 8 //动态属性，但不包含类名和样式
    ]))
    })
    ```
    ```js
    // 开启事件侦听器缓存后
    export function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (_openBlock(), _createBlock("div", null, [
        _createVNode("button", {
        onClick: _cache[1] || (_cache[1] = (...args) => (_ctx.onClick(...args)))
        }, "点我")
    ]))
    }
    // 开启事件侦听器缓存后，会自动会生成一个内联函数，在内联函数里面在引用当前组件最新的onClick，再把这个内联函数cache起来，第一次渲染的时候，创建这个内联函数，并将这个内联函数缓存起来，后续的更新就从缓存里面读同一个函数，同一个函数就没有更新的必要了，通过这种事件监听缓存的方式也能对性能提升起到作用。
    // 开启了缓存后，没有了静态标记。也就是说下次diff算法的时候直接使用
    ```

* 响应式原理的优化

    * vue2.0通过Object.defineProproty()实现响应式，但是存在缺点如下：

        * 检测不到对象属性的添加和删除（解决方法：Vue.$set和Vue.$delete进行检测）
        * 数组API方法无法监听到（解决方法：重写数组7大方法==>push,unshift;shift,pop;splice;sort;reverse）
        * 需要对每个属性进行遍历监听，如果嵌套对象，需要深层监听，造成性能问题
    
    * vue3.0通过proxy代理实现响应式。Proxy的监听是针对一个对象的，那么对这个对象的所有操作会进入监听操作，这就完全可以代理所有属性了。为了对目标的作用主要是通过handler对象中的拦截方法拦截目标对象target的某些行为（如属性查找、赋值、枚举、函数调用等.缺点是低版本浏览器的兼容不好，只能兼容ie11及以上。

* TypeScript支持

    * Vue3是基于typeScript编写的，提供了更好的类型检查，能支持复杂的类型推导

* 组合式API：通过这种形式，我们能够更加容易维护我们的代码，将相同功能的变量和变量的操作进行一个集中式的管理。其两大显著的优化:

    * 优化逻辑组织

    * 优化逻辑复用
    ```js
    //方法一：setup 在setup()中可以通过返回值return来指定哪些内容要暴露给外部使用，暴露后的内容乐意直接在模板使用
    export default {
        setup() {
            // ref可以将任意类型的数据处理成响应式的
            // ref在生成响应式代理时，他是将值包装成一个带有value为key的对象 -->{value: 0}
            // 修改或者访问ref对象时，必须通过 对象.value 来访问其中的值
            // 在组件模板中，ref对象在模板中自动解包，不用使用 对象.value
            const count = ref(0)   // ==>{value: 0}
            let changeCount = () => {
                count.value ++ 
            }
            
            // reactive也可以将对象处理成响应式，只针对于对象,只能返回对象的响应式代理
            // 返回一个对象的响应式代理，返回的是一个深层次的响应式对象
            // 可以使用shallowReactive()创建一个浅层响应式对象
            let user = reactive({
                name:: 'zhangsan',
                age: 18,
                gender: '男'
            })
            let changeUser = () => {
                user.age = 20
            }

            const name = 'zhangsan'  // 普通变量，不是响应式的变量，改变不会引起视图的变化

            onMounted(() => console.log('component mounted!'))
            return {
                count,
                changeCount,
                user,
            }
        }
    }
    <template>
        <p>{{count}}</p>
        <p>{{user.name}} -- {{user.age}}</p>
        <button @click="changeUser">点我改变</button>
    </template>
    ```
    ```js
    //方法二：setup  
    <script setup>
        const count = ref(0)   // ==>{value: 0}
        let changeCount = () => {
            count.value ++ 
        }
    </script>
    <template>
        <p>{{count}}</p>
    </template>
    ```

* 提高自身可维护性

* 开放更多底层功能

* 生命周期

    * obeforeCreate===>setup(): 组件创建之前
    * created =======> setup()：组件创建完成
    * beforeMount ===> onBeforeMount：组件挂载之前
    * mounted =======> onMounted：组件挂载完成
    * beforeUpdate ===> onBeforeUpdate：组件更新之前
    * updated =======>onUpdated：组件更新完成
    * beforedestroy ==> onBeforeUnmount：组件销毁之前
    * destroyed =====> onUnmounted：组件销毁完成


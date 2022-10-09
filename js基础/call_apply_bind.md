#### 前言
在javascript中，call、apply、bind是标准提供的改变函数执行上下文的方法，白话就是改变this的指向。区别在于：

* call和apply都是调用后立即返回结果，而bind是调用之后返回一个函数，二次调用返回结果
* call第一个参数为目标对象，其余参数依次传入fn.call(obj, arg1, arg2…)
* apply第一个参数为目标对象，第二个参数为一个数组fn.apply(obj, [arg1, arg2…])
* bind的绑定函数还可以作为构造函数使用

#### call
简单实现原理：将待执行函数置于目标上下文去执行，执行完成后删除，得到结果。

手写实现
```js
Function.prototype.call (context) {
     // 获取代指向的对象 没有就使用window
    let ctx = context || window
    // 将当前调用Call的函数临时赋值给指向对象的函数
    ctx.fn = this
    // 获取第一个参数后面的所有参数
    const arg = [...arguments].slice(1);
    // 执行
    let result = ctx.fn(...arg)
    // 删除 避免污染全局
    delete ctx.fn
    // 返回结果
    return result
}
```

#### apply
与call函数如出一辙，只是传参不同而已

手写实现
```js
Function.prototype.apply (context, args) {
     // 获取代指向的对象 没有就使用window
    let ctx = context || window
    // 将当前调用Call的函数临时赋值给指向对象的函数
    ctx.fn = this
    // 执行
    let result = ctx.fn(...args)
    // 删除 避免污染全局
    delete ctx.fn
    // 返回结果
    return result
}
```

#### bind
bind与call和apply不一样，第一次调用是绑定函数，第二次调用是返回结果，那么我们就需要返回一个函数.

注意：
* bind还支持柯里化的参数传递，第一次传递一部分参数，第二次传递剩余的参数
* bind函数还有一个性质，bind的绑定函数可以作为构造函数使用；那么作为构造函数，this就必须指向new 出来的实例。

手写实现
```js
Function.prototype.bind(context) {
    const that = this
    // ...args: 展开剩余参数
    // 获取第一个参数后面的所有参数 [柯里化]
    const oArg = [...arguments].slice(1);
    // bind函数可以当做构造函数使用,作为构造函数，this需要指向new出来的实例
     let fn = function (...args) {
        let ctx = context
        if(this instanceof fn) {
            ctx = this
        }
        return that.apply(ctx,[...args, ...oArg])
     }
     //  访问原型上的属性和方法，实现继承， 为了访问到构造函数原型对性上的方法
     fn.prototype = Object.create(this.prototype)
     return fn
}
```

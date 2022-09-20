// call, apply, bind
function Call(context) {
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

function Apply(context, args) {
    let ctx = context || window
    ctx.fn = this
    let result = ctx.fn(...arg)
    delete ctx.fn
    return result
}

function Bind(context) {
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
        return that.Apply(ctx,[...args, ...oArg])
     }
    //  访问原型上的属性和方法，实现继承， 为了访问到构造函数原型对性上的方法
     fn.prototype = Object.create(this.prototype)
     return fn
}
// Object.create
// 思路：将传入的对象作为原型
function ObjCreate (proto,  propertyObj) {
    if(propertyObj === null) {
        throw new TypeError('error')
    } else {
        // 定义一个空的构造函数
        function F () {}
        // 将构造函数原型指向传入的第一个参数
        F.prototype = proto
        // 原型指向后实例化一个对象
        let obj = new F()
        if(proto===null) {
            // 如果proto为null,则创建的对象原型为空
            obj.__proto__ = null
        }
        return obj
    }
}


// new操作符
function New () {
    // 获取构造函数
    let constructor = Array.prototype.shift.call(arguments)

    // 创建一个对象obj，并把创建的对象的原型指向构造函数的原型对象  原型链构建。
    // 换句话说：以构造函数的原型创建新对象
    let obj = Object.create(constructor.prototype)

    // 将this指向新创建的对象实例，并执行函数
    let result = constructor.apply(obj, arguments)

    // 不同return的返回结果不同, 判断返回结果
    let flag = result && (typeof result === "object" || typeof result === "function");

    return flag ? result : obj;
}


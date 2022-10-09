### Object.Create
Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。

**语法**:Object.create(proto, [propertiesObject])
* proto：新创建对象的原型对象。表示要继承的对象
* propertiesObject：可选
  1. 若没有指定为 undefined，则是要添加到新创建对象的可枚举属性
  2. 即其自身定义的属性，而不是其原型链上的枚举属性）对象的属性描述符以及相应的属性名称。
  3. 这些属性对应Object.defineProperties()的第二个参数
  4. 返回值：一个新对象，带着指定的原型对象和属性。

  **注**：Object.create(null) 创建的对象是一个空对象，在该对象上没有继承 Object.prototype 原型链上的属性或者方法

```js
var obj = {
    name: 'mini',
    age: 18
}
var myObj = Object.create(obj, {
    like: {
        // value是该属性的属性值，默认为undefined。
        value: 'money',  
        // writable是一个布尔值，表示属性值（value）是否可改变（即是否可写），默认为true。
        writable: true,  
        // configurable是一个布尔值，表示可配置性，默认为true。如果设为false，将阻止某些操作改写该属性，比如无法删除该属性，也不得改变该属性的属性描述对象（value属性除外
        configurable: true,  
        //enumerable是一个布尔值，表示该属性是否可遍历，默认为true。如果设为false，会使得某些操作（比如for...in循环、Object.keys()）跳过该属性。
        enumerable: true
    }, 
    hate: {
        configurable: true,
        // get是一个函数，表示该属性的取值函数（getter），默认为undefined。
        get: function () {
            console.log(111); 
            return 'love'
        },
        // set是一个函数，表示该属性的存值函数（setter），默认为undefined。
        set: function (value) {
            console.log(value) 
            return value
        }
    }
})
console.log(myObj)
// {
//     like: 'money',
//     hate: 'love',
//     get hate: ƒ (),
//     set hate: ƒ (value),
//     [[Prototype]]: Object
// }
```
**底层实现**
```js
function ObjectCreate (proto, propertyObj) {
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
```

**应用**
* 创建对象
* 用于继承
```js
var A = function () {}
A.prototype.sayNmae = function () {
    console.log(123)
}
var B = function () {}
B.prototype = Object.create(A.prototype)
var b = new B()
console.log(b.sayName)  // 123
``` 

### New
**new的特性**
* 构建的实例对象能够继承构造函数的属性和构造韩原型链上的方法和属性
* 当构造函数返回引用类型时，构造里面的属性不能使用，只能使用返回的对象
* 当构造函数返回基本类型时，和没有返回值的情况相同，构造函数不受影响

**new操作符到底做了什么？**
* 获取实参中的第一个参数（构造函数），就是调用New函数传进来的第一个参数，暂时记为Constructor；
* 使用Constructor的原型链结合Object.create来创建一个对象，此时新对象的原型链为Constructor函数的原型对象；（结合我们上面讨论的，要访问原型链上面的属性和方法，要使用实例对象的__proto__属性）
* 改变Constructor函数的this指向，指向新创建的实例对象，然后call方法再调用Constructor函数，为新对象赋予属性和方法；（结合我们上面讨论的，要访问构造函数的属性和方法，要使用call或apply）
* 返回新创建的对象，为Constructor函数的一个实例对象。

**底层实现**
```js
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
```

**总结**
new是用来做继承的，而创建对象的其实是Object.create(null)。在new操作符的作用下，我们使用新创建的对象去继承了他的构造函数上的属性和方法、以及他的原型链上的属性和方法！



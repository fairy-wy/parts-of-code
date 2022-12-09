### Object.freeze()

Object.freeze() 方法可以冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。freeze() 返回和传入的参数相同的对象。Object.freeze()的返回值就是被冻结的对象，该对象完全等于传入的对象，所以我们一般不需要接收返回值

被冻结的对象有以下几个特性：

* 不能添加新属性
* 不能删除已有属性
* 不能修改已有属性的值
* 不能修改原型
* 不能修改已有属性的可枚举性、可配置性、可写性*

```js

var obj = {
    name: '张三',
    age: 18,
    address: '上海市'
}
obj.__proto__.habit = '运动'
 
// 冻结对象
Object.freeze(obj)
 
// 不能添加新属性
obj.sex = '男'
console.log(obj)    // {name: "张三", age: 18, address: "上海市"}
 
// 不能删除原有属性
delete obj.age
console.log(obj)    // {name: "张三", age: 18, address: "上海市"}
 
// 不能修改已有属性的值
obj.name = '李四'
console.log(obj)    // {name: "张三", age: 18, address: "上海市"}
 
// 不能修改原型
obj.__proto__ = '随便什么值'
console.log(obj.__proto__)  // {habit: "运动", constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, …}
 
// 不能修改已有属性的可枚举性、可配置性、可写性
Object.defineProperty(obj,'address',{ // TypeError: Cannot redefine property: address
    enumerable: false,
    configurable: false,
    writable: true

})
```

冻结数组
```js
var arr = [1,2,3,4,5]
Object.freeze(arr)
arr[0]='新值'
console.log(arr)    // [1, 2, 3, 4, 5]
```

浅冻结
```js
var obj = {
    name: '张三',
    info: {
        a: 1,
        b: 2
    }
}
Object.freeze(obj)

obj.name = '李四'
console.log(obj)    // {info: {a: 1, b: 2},name: "张三"}

obj.info.a = 66
console.log(obj.info)   // {a: 66, b: 2}
```
**对象中如果还有对象的时候，Object.freeze()失效了。Object.freeze()只支持浅冻结**

封装深冻结
```js
function deepFreeze(obj) {
    // 获取所有属性
    var propNames = Object.getOwnPropertyNames(obj)
 
    // 遍历
    propNames.forEach(item => {
        var prop = obj[item]
        // 如果某个属性的属性值是对象，则递归调用
        if (prop instanceof Object && prop !== null) {
            deepFreeze(prop)
        }
    })
    // 冻结自身
    return Object.freeze(obj)
}
```

**应用场景**

Object.freeze()可以提高性能，如果你有一个对象，里面的内容特别特别多，而且都是一些静态数据，你确保不会修改它们，那你其实可以用Object.freeze()冻结起来，这样可以让性能大幅度提升，提升的效果随着数据量的递增而递增。一般什么时候用呢？对于纯展示的大数据，都可以使用Object.freeze提升性能。

**Vue中使用Object.freeze**

在vue项目中,data初始化 里面一般会有很多变量,后续如果不想使用它,可以使用Object.freeze()。这样可以避免vue初始化时候,做一些无用的操作,从而提高性能
```js
data(){
    return{
        list:Object.freeze({'我不需要改变'})
    }
}
```

**Object.freeze()原理**

模拟Object.freeze()原理主要用到两个关键方法，Object.definedProperty()、Object.seal()。

* Object.definedProperty()方法可以定义对象的属性的特性。如可不可以删除、可不可以修改等等
```js

Object.defineProperty(person, 'name', {
    configurable: false,// 表示能否通过delete删除属性，能否修改属性的特性...
    enumerable: false,// 表示是否可以枚举。直接在对象上定义的属性，基本默认true
    writable: false,// 表示能否修改属性的值。直接在对象上定义的属性，基本默认true
    value: 'xm'// 表示属性的值。访问属性时从这里读取，修改属性时，也保存在这里。
})
```

* Object.seal()方法可以让对象不能被扩展、删除属性等等。用法：Object.seal(person).通过Object.seal()方法可以实现不能删除，不能新增对象属性等等功能。通过这两个方法就可以实现一个简单的freeze方法了
```js
function myFreeze(obj) {
    if (obj instanceof Object) {
        Object.seal(obj);
        let p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                Object.defineProperty(obj, p, {
                    writable: false
                });
                myFreeze(obj[p]);
            }
        }
    }
}
```

### for本身
for 循环是出现最早，也是应用最普遍的一个遍历，能够满足绝大多数的遍历。可以遍历 数组、对象、字符串

```js
// 遍历数组
let arr = [1,2,3,4,5]
for(var i=0;i<arr.length;i++) {
    console.log(arr[i])
}
// 1 2 3 4 5
```
```js
// 遍历对象
var obj = {
    name: 'tom',
    age: 18
}
let keys = Object.keys(obj)
for(var i=0;i<keys.length;i++) {
    console.log(keys[i] + ':' + obj[keys[i]])
}
// name:tom
// age:18
```

### forEach
forEach是ES5提出的，挂载在可迭代对象原型上的方法，例如Array Set Map。forEach是一个迭代器，负责遍历可迭代对象。迭代：迭代是递归的一种特殊形式，是迭代器提供的一种方法，默认情况下是按照一定顺序逐个访问数据结构成员

与for之间区别：
* forEach 的参数
```js
let arr = []
arr.forEach((item, index, arr) => {}, this)
// item：数组当前遍历的元素，默认从左往右依次获取数组元素。
// index：数组当前元素的索引，第一个元素索引为0，依次类推。
// arr：当前遍历的数组。
// this：回调函数中this指向。
```
```js
let arr = [1,2,3,4]
let person = {
    name: 'zhangsan'
}
arr.forEach(function (item, index, arr){
    console.log(`当前元素为${item}索引为${index}属于数组${arr}`)
    console.log(this.name)  // zhangsan
}, person)
```
* forEach 的中断
 在js中有break return continue 对函数进行中断或跳出循环的操作，我们在 for循环中会用到一些中断行为，对于优化数组遍历查找是很好的，但由于forEach属于迭代器，只能按序依次遍历完成，所以不支持上述的中断行为
```js
let arr = [1,2,3,4]
arr.forEach(function(item, index) {
    if (item === 2) {
        break; // 报错
    } else if (item === 1) {
        continue; // 报错
    }
})
```

如果我一定要在 forEach 中跳出循环呢？其实是有办法的，借助try/catch：
```js
try {
    let arr = [1,2,3,4]
    arr.forEach(function(item, index) {
        if (item === 2) {
           throw new Error('loopBreak')
        }
    })
} catch (e){
    if (e.message === 'loopBreak') throw e
}

```

若遇到 return 并不会报错，但是不会生效
```js
let arr = [1,2,3,4]
function fn (arr, num) {
    arr.forEach(function(item, index) {
        if (item === num) {
            return index
        }
    })
}
console.log(fn(arr, 2))  // undefined
```

* forEach 删除自身元素，index不可被重置
在 forEach 中我们无法控制 index 的值，它只会无脑的自增直至大于数组的 length 跳出循环。所以也无法删除自身进行index重置，index不会随着函数体内部对它的增减而发生变化
```js
let arr = [1,2,3,4]
arr.forEach(function(item, index) {
   console.log(index)  
  index ++ 
})
// 0 1 2 3
```

* for 循环可以控制循环起点
```js
let arr = [1,2,3,4,5]
for(var i=2;i<arr.length;i++) {
    console.log(arr[i])
}
// 3 4 5
```

* for循环和forEach的性能区别
在性能对比方面我们加入一个 map 迭代器，它与 filter 一样都是生成新数组。我们对比 for forEach map 的性能在浏览器环境中都是什么样的：性能比较：for > forEach > map 在chrome 62 和 Node.js v9.1.0环境下：for 循环比 forEach 快1倍，forEach 比 map 快20%左右。

原因分析for：for循环没有额外的函数调用栈和上下文，所以它的实现最为简单。forEach：对于forEach来说，它的函数签名中包含了参数和上下文，所以性能会低于 for 循环。map：map 最慢的原因是因为 map 会返回一个新的数组，数组的创建和赋值会导致分配内存空间，因此会带来较大的性能开销。如果将map嵌套在一个循环中，便会带来更多不必要的内存消耗。当大家使用迭代器遍历一个数组时，如果不需要返回一个新数组却使用 map 是违背设计初衷的。在我前端合作开发时见过很多人只是为了遍历数组而用 map 的：


###  for...in
for...in 语句以任意顺序迭代一个对象的除 Symbol 以外的可枚举属性，包括继承的可枚举属性。自原型链上的可枚举属性(可枚举属性：enumerable为true的).
```js
var arr = ['red', 'green', 'blue']
 
for(let item in arr) {
  console.log('for in item', item)
}
//   for in item 0
//   for in item 1
//   for in item 2
```
语法：
```js
for (variable in object)
```
* variable：在每次迭代时，variable 会被赋值为不同的属性名。
* object：非 Symbol 类型的可枚举属性被迭代的对象。

```js
let obj = {
    name: 'zhangsan',
    age: 18
}
Object.defineProperty(obj, 'sex', {
    value: 'male',
    enumerable: true
})
Object.defineProperty(obj, 'hobby', {
    value: 'money',
    enumerable: false
})
for(let item in obj) {
  console.log(item)
}
// name
// age
// sex
```

* for...in 是为遍历对象属性而构建的，不建议与数组一起使用
* 在处理有 key-value 数据，用于获取对接的 key，也就是获取键值
* 只遍历可枚举属性。像 Array 和 Object 使用内置构造函数所创建的对象都会继承自 Object.prototype 和 String.prototype 的不可枚举属性，这种是无法遍历的
* for...in可以使用 break 或者 continue 去中断循环.不可以直接用 return 去中断循环,return 不能直接中断循环，必须放在函数中
```js
let obj = {
    a: 'a',
    b: 'b',
    c: 'c'
}
for(let item in obj) {
    if (item === 'b') {
        break;
    }
    console.log(item)
}
// a
```
```js
let obj = {
    a: 'a',
    b: 'b',
    c: 'c'
}
for(let item in obj) {
    if (item === 'b') {
        return;
    }
    console.log(item)
} 
// 报错  Uncaught SyntaxError: Illegal return statement

function test() {
    let obj = {
        a: 'a',
        b: 'b',
        c: 'c'
    }
    for(let item in obj) {
        if (item === 'b') {
            return;
        }
        console.log(item)
    }
}
test() // a
```
* for...in 循环不仅遍历数字键名，还会遍历手动添加的其它键，甚至包括原型链上的键。for...of 则不会这样
```js
let arr = [1, 2, 3]
arr.set = 'world'  // 手动添加的键
Array.prototype.name = 'hello'  // 原型链上的键
 
for(let item in arr) {
  console.log('item', item)
}
 
/*
  item 0
  item 1
  item 2
  item set
  item name
*/

for(let value of arr) {
  console.log('value', value)
}
/*
  value 1
  value 2
  value 3
*/
```

### for...of
for...of 语句在可迭代(拥有 Iterator 接口)对象（包括 Array，Map，Set，String，TypedArray，arguments 对象等等）上创建一个迭代循环，调用自定义迭代钩子，并为每个不同属性的值执行语句.遍历获得键值

语法:
```js
for (variable of object){}
```
* variable: 在每次迭代中，将不同属性的值分配给变量。
* iterable: 被迭代枚举其属性的对象。
```js
var arr = ['red', 'green', 'blue']
for(let item of arr) {
  console.log('for of item', item)
}
//   for of item red
//   for of item green
//   for of item blue
```

* 对于普通对象，没有部署原生的 iterator 接口，直接使用 for...of 会报错
```js
var obj = {
   'name': 'Jim Green',
   'age': 12
 }
 
 for(let key of obj) {
   console.log('for of obj', key)
 }
 // Uncaught TypeError: obj is not iterable
```
* for...of可以使用 break 或者 continue 去中断循环.不可以直接用 return 去中断循环,return 不能直接中断循环，必须放在函数中
```js
let arr = [1,2,3,4]
for(let item of arr) {
    if (item === 3) {
        break;
    }
    console.log(item)
}
// 1
// 2
```
```js
let arr = [1,2,3,4]
for(let item of arr) {
    if (item === 3) {
        return;
    }
    console.log(item)
}
// 报错 Uncaught SyntaxError: Illegal return statement

function test () {
    let arr = [1,2,3,4]
    for(let item of arr) {
        if (item === 3) {
            return;
        }
        console.log(item)
    }
}
test()
// 1
// 2
```






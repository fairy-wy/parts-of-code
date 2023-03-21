### ES6数组扩展

* 扩展运算符的应用：ES6通过扩展元素符...，好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。通过扩展运算符实现的是浅拷贝
```js
console.log(...[1, 2, 3]) // 1 2 3

console.log(1, ...[2, 3, 4], 5) // 1 2 3 4 5

// 可以将伪数组结构转为数组
[...document.querySelectorAll('div')] // [<div>, <div>, <div>]

// 数组复制
const a1 = [1, 2];
const [...a2] = a1;
console.log(a2) // [1, 2]

// 数组的合并
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];
[...arr1, ...arr2, ...arr3]  // [ 'a', 'b', 'c', 'd', 'e' ]
```

* 构造函数新增的方法
    * Array.from()：将两类对象转为真正的数组：类似数组的对象和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）
    * 类数组（伪数组）：类数组是一个拥有length属性，并且属性为非负整数的普通对象，类数组不能直接调用数组方法。常见的类数组有函数的参数对象arguments，以及通过选择器得到的html节点表列表。
    ```js
    let arrayLike = {
        '0': 'a',
        '1': 'b',
        '2': 'c',
        length: 3
    };
    let arr2 = Array.from(arrayLike); 
    console.log(arr2) // ['a', 'b', 'c']

    // 还可以接受第二个参数，用来对每个元素进行处理，将处理后的值放入返回的数组
    let arr = Array.from([1, 2, 3], (x) => x * x)
    console.log(arr2) // [1, 4, 9]
    ```
    * Array.of()：用于将一组值，转换为数组。返回一个数组。
    ```js
    Array.of(3, 11, 8) // [3,11,8]

    // 没有参数的时候，返回一个空数组
    Array.of() // []
    // 当参数只有一个的时候，实际上是指定数组的长度
    Array.of(3) // [3]
    // 参数个数不少于 2 个时，Array()才会返回由参数组成的新数组 
    Array.of(3, 11, 8) // [3, 11, 8]
    ```

* 关于数组实例对象新增的方法有如下：

    * copyWithin()：将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。参数如下：

        * target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
        * start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。
        * end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算。
    ```js
    // 将从 3 号位直到数组结束的成员（4 和 5），复制到从 0 号位开始的位置，结果覆盖了原来的 1 和 2
    [1, 2, 3, 4, 5].copyWithin(0, 3)  // [4, 5, 3, 4, 5] 
    ```
    * find()：用于找出第一个符合条件的数组成员，参数是一个回调函数，接受三个参数依次为当前的值、当前的位置和原数组。
    * findIndex()：返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1
    ```js
    [1, 5, 10, 15].find(function(value, index, arr) {
        return value > 9;
    }) // 10

    [1, 5, 10, 15].findIndex(function(value, index, arr) {
        return value > 9;
    }) // 2

    // 这两个方法都可以接受第二个参数，用来绑定回调函数的this对象
    function f(v){
        return v > this.age;
    }
    let person = {name: 'John', age: 20};
    [10, 12, 26, 15].find(f, person);   // 26
    ```
    * fill()：使用给定值，填充一个数组
    ```js
    ['a', 'b', 'c'].fill(7) // [7, 7, 7]

    new Array(3).fill(7)
    // [7, 7, 7]
    ```
    * entries()，keys()，values()：keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历
    ```js
    for (let index of ['a', 'b'].keys()) {
        console.log(index);
    }
    // 0
    // 1

    for (let elem of ['a', 'b'].values()) {
        console.log(elem);
    }
    // 'a'
    // 'b'

    for (let [index, elem] of ['a', 'b'].entries()) {
        console.log(index, elem);
    }
    // 0 "a"
    ```
    * includes()：用于判断数组是否包含给定的值。方法的第二个参数表示搜索的起始位置，默认为0参数为负数则表示倒数的位置
    ```js
    [1, 2, 3].includes(2)     // true
    [1, 2, 3].includes(4)     // false
    [1, 2, NaN].includes(NaN) // true

    [1, 2, 3].includes(3, 3);  // false
    [1, 2, 3].includes(3, -1); // true
    ```
    * flat()：将数组扁平化处理，返回一个新数组，对原数据没有影响。flat()默认只会“拉平”一层，如果想要“拉平”多层的嵌套数组，可以将flat()方法的参数写成一个整数，表示想要拉平的层数，默认为1
    ```js
    [1, 2, [3, 4]].flat() // [1, 2, 3, 4]

    [1, 2, [3, [4, 5]]].flat() // [1, 2, 3, [4, 5]]

    [1, 2, [3, [4, 5]]].flat(2) // [1, 2, 3, 4, 5]
    ```
    * flatMap()：对原数组的每个成员执行一个函数相当于执行Array.prototype.map()，然后对返回值组成的数组执行flat()方法。该方法返回一个新数组，不改变原数组。flatMap()方法还可以有第二个参数，用来绑定遍历函数里面的this
    ```js
    // 相当于 [[2, 4], [3, 6], [4, 8]].flat()
    [2, 3, 4].flatMap((x) => [x, x * 2])
    // [2, 4, 3, 6, 4, 8]
    ```

* 排序稳定性：将sort()默认设置为稳定的排序算法
```js
const arr = [
  'peach',
  'straw',
  'apple',
  'spork'
];
const stableSorting = (s1, s2) => {
  if (s1[0] < s2[0]) return -1;
  return 1;
};
arr.sort(stableSorting)
// ["apple", "peach", "straw", "spork"]
```

### ES6对象扩展

* 属性的遍历：ES6 一共有 5 种方法可以遍历对象的属性。

    * for...in：循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）

    * Object.keys(obj)：返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名

    * Object.getOwnPropertyNames(obj)：回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名

    * Object.getOwnPropertySymbols(obj)：返回一个数组，包含对象自身的所有 Symbol 属性的键名

    * Reflect.ownKeys(obj)：返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举
```js
Reflect.ownKeys({ [Symbol()]:0, b:0, 10:0, 2:0, a:0 })
// ['2', '10', 'b', 'a', Symbol()]
```

* 属性的简写
```js
// ES6中，当对象键名与对应值名相等的时候，可以进行简写
const baz = {foo:foo}
// 等同于
const baz = {foo}

// 方法也能够进行简写.简写的对象方法不能用作构造函数，否则会报错
const obj = {
  method: function() {
    return "Hello!";
  }
}
// 等同于
const obj = {
  method() {
    return "Hello!";
  }
};
new obj.method() // 报错
```

* 属性名表达式
```js
// ES6 允许字面量定义对象时，将表达式放在括号内.属性名表达式与简洁表示法，不能同时使用，会报错
let lastWord = 'last word';
const a = {
  'first word': 'hello',
  [lastWord]: 'world'
};
a['first word'] // "hello"
a[lastWord] // "world"
a['last word'] // "world"

// 表达式还可以用于定义方法名
let obj = {
  ['h' + 'ello']() {
    return 'hi';
  }
};
obj.hello() // hi
```

* super关键字: this关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字super，指向当前对象的原型对象
```js
const proto = {
  foo: 'hello'
};
const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};

Object.setPrototypeOf(obj, proto); // 为obj设置原型对象
obj.find() // "hello"
```

* 扩展运算符的应用
```js
// 在解构赋值中，未被读取的可遍历的属性，分配到指定的对象上面.解构赋值必须是最后一个参数，否则会报错
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
console.log(x) // 1
console.log(y) // 2
console.log(z) // { a: 3, b: 4 }

// 解构赋值是浅拷贝
let obj = { a: { b: 1 } };
let { ...x } = obj;
obj.a.b = 2; // 修改obj里面a属性中键值
x.a.b // 2，影响到了结构出来x的值
```

* 对象新增的方法
    * Object.is()：严格判断两个值是否相等，与严格比较运算符（===）的行为基本一致，不同之处只有两个：一是+0不等于-0，二是NaN等于自身
    ```js
    +0 === -0 //true
    NaN === NaN // false

    Object.is(+0, -0) // false
    Object.is(NaN, NaN) // true
    ```
    * Object.assign()：Object.assign()方法用于对象的合并，将源对象source的所有可枚举属性，复制到目标对象target。Object.assign()方法的第一个参数是目标对象，后面的参数都是源对象
    ```js
    const target = { a: 1, b: 1 };
    const source1 = { b: 2, c: 2 };
    const source2 = { c: 3 };

    Object.assign(target, source1, source2);
    console.log(target) // {a:1, b:2, c:3}
    ```
    * Object.getOwnPropertyDescriptors()：返回指定对象所有自身属性（非继承属性）的描述对象
    * Object.setPrototypeOf()：设置一个对象的原型对象
    * Object.getPrototypeOf()：用于读取一个对象的原型对象
    * Object.keys()：返回自身的（不含继承的）所有可遍历（enumerable）属性的键名的数组
    * Object.values()：返回自身的（不含继承的）所有可遍历（enumerable）属性的键对应值的数组
    * Object.entries()：返回一个对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对的数组
    ```js
    var obj = { foo: 'bar', baz: 42 };
    Object.keys(obj) // ["foo", "baz"]
    Object.values(obj) // ["bar", 42]
    Object.entries(obj) // [ ["foo", "bar"], ["baz", 42] ]
    ```
    * Object.fromEntries()：用于将一个键值对数组转为对象
    ```js
    Object.fromEntries([
        ['foo', 'bar'],
        ['baz', 42]
    ])
    // { foo: "bar", baz: 42 }
    ```


### 前言

**强引用**

强引用就是将对象保留在内存中的引用，防止对象被垃圾回收
```js
let cat = { name: "Kitty" };
const pets = [cat];

cat = null;
console.log(pets); // [{ name: "Kitty" }]
```
通过将变量 cat 创建为对象，并把这个对象放入一个数组 pets 中，然后通过将它的值设置为 null 来删除其对原始对象的引用。

尽管我们再也无法访问 cat 变量，但由于在 pets 数组和这个对象之间存在强引用关系，因此这个对象其实仍保留在内存中，并且可以通过 pets[0] 访问到它。 换句话说，强引用可以防止垃圾回收从内存中删除对象。

**弱引用**

弱引用是对对象的引用，如果它还是对内存中对象的唯一引用，就能顺利地进行垃圾回收。
```js
let pets = new WeakMap();
let cat = { name: "Kitty" };
pets.set(cat, "Kitty");
console.log(pets); // WeakMap {{…} => 'Kitty'}
cat = null;

// 等待垃圾回收后
console.log(pets); // WeakMap{}
```
通过利用 WeakMap 及其附带的弱引用，我们可以看到两种类型的引用之间的差异。虽然对原始 cat 对象的强引用仍然存在，但 cat 对象仍然存在于 WeakMap 中，我们可以毫无问题地访问它。

但是，当我们通过将 cat 变量重新赋值 null 来覆盖对原始 cat 对象的引用时，由于内存中对原始对象的唯一引用是来自我们创建的 WeakMap 的弱引用，所以它不会阻止垃圾回收的发生。这意味着当 JavaScript 引擎再次运行垃圾回收过程时，cat 对象将从内存和我们分配给它的 WeakMap 中删除。

### Set
ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。Set本身是一个构造函数，用来生成 Set 数据结构。

**特点**
* Set成员的值都是唯一的，所以Set 结构不会添加重复的值。
```js
const s = new Set();

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

for (let i of s) {
  console.log(i);
}
// 2 3 5 4
```

* Set函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。
```js
// 例一  数组
const set = new Set([1, 2, 3, 4, 4]);
[...set]
// [1, 2, 3, 4]

// 例二
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size // 5

// 例三 类似数组的对象作为参数。
const set = new Set(document.querySelectorAll('div'));
set.size // 56

// 类似数组的对象作为参数。
const set = new Set();
document
 .querySelectorAll('div')
 .forEach(div => set.add(div));
set.size // 56
```

* 向 Set 加入值的时候，不会发生类型转换，所以5和"5"是两个不同的值。Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（===），主要的区别是向 Set 加入值时认为NaN等于自身，而精确相等运算符认为NaN不等于自身。
```js
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}
//  向 Set 实例添加了两次NaN，但是只会加入一个。这表明，在 Set 内部，两个NaN是相等的。
```

* 去重
```js
// 字符串的去重
[...new Set('ababbc')].join('')
// "abc"

// 数组去重
let set = [...new Set([1,2,3,2,5,6,3])]
console.log(set)  //  [1, 2, 3, 5, 6]
```

* Set 可以很容易地实现并集（Union）、交集（Intersect）和差集（Difference）
```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// （a 相对于 b 的）差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```

**Set实例的属性和方法**

属性

* Set.prototype.constructor：构造函数，默认就是Set函数。
* Set.prototype.size：返回Set实例的成员总数

方法

* Set.prototype.add(value)：添加某个值，返回 Set 结构本身。
* Set.prototype.delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
* Set.prototype.has(value)：返回一个布尔值，表示该值是否为Set的成员。
* Set.prototype.clear()：清除所有成员，没有返回值。
```js
let s = new Set()
s.add(1).add(2).add(2);
// 注意2被加入了两次

console.log(s.size) // 2

console.log(s.has(1)) // true
console.log(s.has(3)) // false

s.delete(2);
console.log(s.has(2)) // false

s.clear()
console.log(s.size)  // 0
```
* Set.prototype.keys()：返回键名的遍历器
* Set.prototype.values()：返回键值的遍历器
* Set.prototype.entries()：返回键值对的遍历器
* Set.prototype.forEach()：使用回调函数遍历每个成员
```js
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

**WeakSet**

WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。

* WeakSet 的成员只能是对象，而不能是其他类型的值。
```js
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}

const b = [3, 4];
const ws = new WeakSet(b);
// Uncaught TypeError: Invalid value used in weak set(…)
```
* WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。WeakSet 里面的引用，都不计入垃圾回收机制
* ES6 规定 WeakSet 不可遍历。(WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的)

语法： WeakSet 是一个构造函数，可以使用new命令，创建 WeakSet 数据结构。作为构造函数，WeakSet 可以接受一个数组或类似数组的对象作为参数。（实际上，任何具有 Iterable 接口的对象，都可以作为 WeakSet 的参数。）该数组的所有成员，都会自动成为 WeakSet 实例对象的成员。

方法：

* WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员。
* WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员。
* WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。
```js
const ws = new WeakSet();
const obj = {};
const foo = {};

ws.add(window);
ws.add(obj);

ws.has(window); // true
ws.has(foo);    // false

ws.delete(window);
ws.has(window);    // false
// WeakSet 没有size属性，没有办法遍历
```

### Map
ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现

```js
const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"
```

**特点**

* 作为构造函数，Map 也可以接受一个数组作为参数.任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数。
```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```

* 如果对同一个键多次赋值，后面的值将覆盖前面的值。
```js
const map = new Map();
map
.set(1, 'aaa')
.set(1, 'bbb');

map.get(1) // "bbb"
```

* 有对同一个对象的引用，Map 结构才将其视为同一个键.同理，同样的值的两个实例，在 Map 结构中被视为两个键。(Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题)
```js
const map = new Map();

const k1 = ['a'];
const k2 = ['a'];

map
.set(k1, 111)
.set(k2, 222);

map.get(k1) // 111
map.get(k2) // 222
```

* NaN不严格相等于自身，但 Map 将其视为同一个键。
```js
map.set(NaN, 123);
map.get(NaN) // 123
```

**实例的属性和操作方法**

属性：

* size属性返回 Map 结构的成员总数。

方法：

* Map.prototype.set(key, value)：set方法设置键名key对应的键值为value，然后返回当前的Map对象（因此可以采用链式写法。）。如果key已经有值，则键值会被更新，否则就新生成该键。
* Map.prototype.get(key)： get方法读取key对应的键值，如果找不到key，返回undefined
* Map.prototype.has(key)： has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。
* Map.prototype.delete(key)： delete方法删除某个键，返回true。如果删除失败，返回false。
* Map.prototype.clear()： clear方法清除所有成员，没有返回值。
```js
const map = new Map();
map.set('foo', 'foo_text');
map.set('bar', 'bar_text');
map.set(undefined, 'haha')

console.log(map.size) // 3

console.log(map.get('bar'))  // bar_text

console.log(map.has('foo'))  // true

map.delete('foo')
console.log(map.has('foo'))  // false

map.clear()
console.log(map.size)  // 0
```

* Map.prototype.keys()：返回键名的遍历器。
* Map.prototype.values()：返回键值的遍历器。
* Map.prototype.entries()：返回所有成员的遍历器。
* Map.prototype.forEach()：遍历 Map 的所有成员。
```js
const map = new Map([
  ['F', 'no'],
  ['T',  'yes'],
]);

for (let key of map.keys()) {
  console.log(key);
}
// "F"
// "T"

for (let value of map.values()) {
  console.log(value);
}
// "no"
// "yes"

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"
```

**与其他数据结构的互相转换**

* Map 转为数组 (使用扩展运算符（...）。)
```js
const myMap = new Map()
  .set(true, 7)
  .set({foo: 3}, ['abc']);
console.log(myMap)
[...myMap]
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
```

* 数组 转为 Map
```js
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
// Map {
//   true => 7,
//   Object {foo: 3} => ['abc']
// }
```

* Map 转为对象 (如果所有 Map 的键都是字符串，它可以无损地转为对象。如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名。)
```js
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const myMap = new Map()
  .set('yes', true)
  .set('no', false);
strMapToObj(myMap)
// { yes: true, no: false }
```

* 对象转为 Map
```js
let obj = {"a":1, "b":2};
let map = new Map(Object.entries(obj));
```
```js
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

objToStrMap({yes: true, no: false})
// Map {"yes" => true, "no" => false}
```

* Map 转为 JSON.Map 转为 JSON 要区分两种情况。一种情况是，Map 的键名都是字符串，这时可以选择转为对象 JSON。Map 的键名有非字符串，这时可以选择转为数组 JSON。
```js
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}

let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap)
// '{"yes":true,"no":false}'
```
```js
function mapToArrayJson(map) {
  return JSON.stringify([...map]);
}

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap)
// '[[true,7],[{"foo":3},["abc"]]]'
```

* JSON 转为 Map (JSON 转为 Map，正常情况下，所有键名都是字符串;有一种特殊情况，整个 JSON 就是一个数组，且每个数组成员本身，又是一个有两个成员的数组。这时，它可以一一对应地转为 Map。这往往是 Map 转为数组 JSON 的逆操作)
```js
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}

jsonToStrMap('{"yes": true, "no": false}')
// Map {'yes' => true, 'no' => false}
```
```js
function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
}

jsonToMap('[[true,7],[{"foo":3},["abc"]]]')
// Map {true => 7, Object {foo: 3} => ['abc']}
```

**WeakMap**

WeakMap结构与Map结构类似，也是用于生成键值对的集合。WeakMap与Map的区别:

* WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。
```js
const map = new WeakMap();
map.set(1, 2)
// TypeError: 1 is not an object!
map.set(Symbol(), 2)
// TypeError: Invalid value used as weak map key
map.set(null, 2)
// TypeError: Invalid value used as weak map key
```

* WeakMap的键名所指向的对象，不计入垃圾回收机制。(WeakMap 它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。注意：WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。)
```js
const wm = new WeakMap();
let key = {};
let obj = {foo: 1};

wm.set(key, obj);
obj = null;  //  即使在 WeakMap 外部消除了obj的引用，WeakMap 内部的引用依然存在。
wm.get(key)
// Object {foo: 1}  
```

* WeakMap没有遍历操作（即没有keys()、values()和entries()方法），也没有size属性

* WeakMap无法清空，即不支持clear方法。因此，WeakMap只有四个方法可用：get()、set()、has()、delete()。
```js
const wm = new WeakMap();

// size、forEach、clear 方法都不存在
wm.size // undefined
wm.forEach // undefined
wm.clear // undefined
```

WeakMap 的用途 
`
* WeakMap 应用的典型场合就是 DOM 节点作为键名
```js
let myWeakmap = new WeakMap();

myWeakmap.set(
  document.getElementById('logo'),
  {timesClicked: 0})
;

document.getElementById('logo').addEventListener('click', function() {
  let logoData = myWeakmap.get(document.getElementById('logo'));
  logoData.timesClicked++;
}, false);

// document.getElementById('logo')是一个 DOM 节点，每当发生click事件，就更新一下状态。我们将这个状态作为键值放在 WeakMap 里，对应的键名就是这个节点对象。一旦这个 DOM 节点删除，该状态就会自动消失，不存在内存泄漏风险。
```
* WeakMap 的另一个用处是部署私有属性。
```js
const _counter = new WeakMap();
const _action = new WeakMap();

class Countdown {
  constructor(counter, action) {
    _counter.set(this, counter);
    _action.set(this, action);
  }
  dec() {
    let counter = _counter.get(this);
    if (counter < 1) return;
    counter--;
    _counter.set(this, counter);
    if (counter === 0) {
      _action.get(this)();
    }
  }
}

const c = new Countdown(2, () => console.log('DONE'));

c.dec()
c.dec()
// DONE
//Countdown类的两个内部属性_counter和_action，是实例的弱引用，所以如果删除实例，它们也就随之消失，不会造成内存泄漏。
```
**Map和WeakMap区别**

* Map的键可以是任意类型，WeakMap只接受对象作为键，不接受其它类型的值作为键
* Map的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键；WeakMap的键是弱引用，键所指向的对象是可以被垃圾回收，此时键是无效的。
* Map可以被遍历，WeakMap不能被遍历


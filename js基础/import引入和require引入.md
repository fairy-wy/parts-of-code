### 前言

require和import本质上都是为了JS模块化编程使用的一个语法，语法一般都遵循这一定的语法规范，require遵循的是AMD/CommonJS规范，而import是es6新引入的一个语法标准，如果要兼容浏览器的话必须转化成es5的语法。

AMD：即Asynchronous Module Definition，中文名是异步模块定义，一个在浏览器端模块化开发的规范，它完整描述了模块的定义，依赖关系，引用关系以及加载机制。

CommonJS:和AMD类似，它与AMD的区别是它加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。CommonJS 模块化方案 require/exports 是为服务器端开发设计的。服务器模块系统同步读取模块文件内容，编译执行后得到模块接口

### 区别

**出现的时间、地点不同**

* require/exports	2009	CommonJS

* import/export	2015	ECMAScript2015（ES6）

**不同端(客户端/服务器)的使用限制**

* 原生浏览器不支持 require/exports，可使用支持 CommonJS 模块规范的 Browsersify、webpack 等打包工具，它们会将 require/exports 转换成能在浏览器使用的代码。
* import/export 在浏览器中无法直接使用，我们需要在引入模块的 <script> 元素上添加type="module" 属性。
* 即使 Node.js 13.2+ 可以通过修改文件后缀为 .mjs 来支持 ES6 模块 import/export，但是Node.js 官方不建议在正式环境使用。目前可以使用 babel 将 ES6 的模块系统编译成 CommonJS 规范（注意：语法一样，但具体实现还是 require/exports）。

**require/exports 是运行时动态加载，import/export 是静态编译**

CommonJS 加载的是一个对象（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

**require/exports 输出的是一个值的拷贝，import/export 模块输出的是值的引用**

* require/exports 输出的是值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。require/exports 针对基础数据类型是值的拷贝，导出复杂数据类型时浅拷贝该对象
```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```
```js
// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
```

* import/export 模块输出的是值的引用。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。
```js
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}
```
```js
// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```

**用法不一致**

* import/export 不能对引入模块重新赋值/定义
```js
// lib.js
export let obj = {};

// main.js
import { obj } from './lib';

obj.prop = 123; // OK
obj = {}; // Uncaught TypeError: Assignment to constant variable.
```

* ES6 模块可以在 import 引用语句前使用模块，CommonJS 则需要先引用后使用
```js
export var e='export';
console.log(e) //export
import {e} from './webUtils.js';
console.log(e) //export
```
```js
exports.e = 'export';
console.log(a)  // ReferenceError: a is not defined
a = require('./utils');
console.log(a)  
```

* import/export 只能在模块顶层使用，不能在函数、判断语句等代码块之中引用；require/exports 可以。

### 扩展

**exports和module exports**

无论使用 exports 暴露成员，或是 module.exports 暴露成员，最终暴露的结果，都是以 module.exports 所指向的对象为准。

module.exports 和 exports 的联系

* 在 module 对象中，包含 exports 属性，而我们就是通过这个属性（module.exports），向外暴露(共享)成员的。

* exports 是 node 为了简化向外共享成员的代码，提供的一个新方式，在默认情况下，exports 和 module.exports 指向的是同一个对象（为了不混淆，你可以理解为 exports 是 module.exports 对象地址的一个引用，exports 本质是一个变量）

* module.exports 和 exports是全等的

module.exports 和 exports 的使用注意点

* 在使用 module.exports 时，我们可以将某一个对象赋值给 module.exports（module.exports = Object），也可以为 module.exports 挂载新属性（ module.exports.name = ‘zs’），这些都没有问题，你都可以在引用的文件中拿到修改后的模块成员（module.exports 所指的对象）。

* 如果你将某一对象或某一变量直接赋值给了 exports（例如：const project = ‘张三’; exports = project; ），那么你在引用的文件中只能拿到一个 {}。

* 原因是因为 exports 在默认情况下是指向 module.exports 对象的引用，如果为 exports 赋值了，那么也就是说 exports 不再指向 module.exports 所指的对象的地址，而我们向外共享成员的最终结果是 module.exports 所指的对象，如此便会导致错误。
```js
//test.js
const object = { name: "zhangsan", age: 18 }
exports = object;
```
```js
//main.js
const ex = require("./test")
console.log(ex);  // 结果是一个空对象
```

总结：我们向外暴露时，是以 module.exports 为标准的，module.exports 和 exports 同指一个对象，但是最终暴露结果以 module.exports 的为准，上面的代码中，exports 改变了指向，而我们又没有为 module.exports 挂载任何的属性或方法，所以就拿到了空对象。

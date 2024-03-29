#### 前言
在JavaScript代码运行之前其实是有一个编译阶段的。编译之后才是从上到下，一行一行解释执行。变量提升就发生在编译阶段，它把变量和函数的声明提升至作用域的顶端。（编译阶段的工作之一就是将变量与其作用域进行关联）。

**注意**
* 提升的部分只是变量声明，赋值语句和可执行的代码逻辑还保持在原地不动
* 提升只是将变量声明提升到变量所在的变量范围的顶端，并不是提升到全局范围

#### 变量的创建、初始化和赋值
**var 声明的「创建、初始化和赋值」过程**
```js
function fn(){
  var x = 1
  var y = 2
}
fn()
```
在执行 fn 时，会有以下过程（不完全）：

* 进入 fn，为 fn 创建一个环境。
* 找到 fn 中所有用 var 声明的变量，在这个环境中「创建」这些变量（即 x 和 y）。
* 将这些变量「初始化」为 undefined。
* 开始执行代码
* x = 1 将 x 变量「赋值」为 1
* y = 2 将 y 变量「赋值」为 2

也就是说 var 声明会在代码执行之前就将「创建变量，并将其初始化为 undefined」。就解释了为什么在 var x = 1 之前 console.log(x) 会得到 undefined。

**function 声明的「创建、初始化和赋值」过程**

```js
fn2()
function fn2(){
  console.log(2)
}
```

JS 引擎会有以下过程：

* 找到所有用 function 声明的变量，在环境中「创建」这些变量。
* 将这些变量「初始化」并「赋值」为 function(){ console.log(2) }。
* 开始执行代码 fn2()

也就是说 function 声明会在代码执行之前就「创建、初始化并赋值」

**注意**
* 变量声明和函数声明都会得到变量提升，但函数声明（优先级更高）会最先得到提升，然后是变量声明。
```js
foo();    //输出的结果为1
var foo;
function foo(){
    console.log(1);
}
foo = function(){
    console.log(2);
}   
```
* 函数声明会提升，但是函数表达式就不了
* 对于函数声明来说，如果定义了相同的函数变量声明，后定义的声明会覆盖掉先前的声明
```js
foo();    //输出3
function foo(){
    console.log(1);
}
var foo = function(){
    console.log(2);
}  
function foo(){
    console.log(3);
}   
```

**let 声明的「创建、初始化和赋值」过程**

```js
{
  let x = 1
  x = 2
}
```
我们只看 {} 里面的过程：

* 找到所有用 let 声明的变量，在环境中「创建」这些变量
* 开始执行代码（注意现在还没有初始化）
* 执行 x = 1，将 x 「初始化」为 1（这并不是一次赋值，如果代码是 let x，就将 x 初始化为 undefined）
* 执行 x = 2，对 x 进行「赋值
」
这就解释了为什么在 let x 之前使用 x 会报错

```js
let x = 'global'
{
  console.log(x) // Uncaught ReferenceError: x is not defined
  let x = 1
}
```
原因有两个

* console.log(x) 中的 x 指的是下面的 x，而不是全局的 x
* 执行 log 时 x 还没「初始化」，所以不能使用（也就是所谓的暂时死区）
暂时死区: 所谓暂时死区，就是不能在初始化之前，使用变量。let 会产生暂时性死区，在当前的执行上下文中，会进行变量提升，但是未被初始化，所以在执行上下文执行阶段，执行代码如果还没有执行到变量赋值，就引用此变量就会报错，此变量未初始化。

看到这里，你应该明白了 let 到底有没有提升

* let 的「创建」过程被提升了，但是初始化没有提升。
* var 的「创建」和「初始化」都被提升了。
* function 的「创建」「初始化」和「赋值」都被提升了。

**注意**
* let声明的变量名不可以在统一作用域不可以重复，会报错
* 最后看 const，其实 const 和 let 只有一个区别，那就是 const 只有「创建」和「初始化」，没有「赋值」过程。const的初始化值不可以改变。const定义基本数据类型，这个值是不可以修改的。那么我们用const定义对象,对象的属性是可以改变的

![图解](https://fangyinghang.com/images/let-in-js/3.jpg)

#### 问题
**如何理解 let x = x 报错之后，再次 let x 依然会报错？**

这个问题说明：如果 let x 的初始化过程失败了，那么

* x 变量就将永远处于 created 状态。
* 你无法再次对 x 进行初始化（初始化只有一次机会，而那次机会你失败了）。
* 由于 x 无法被初始化，所以 x 永远处在暂时死区（也就是盗梦空间里的 limbo）！
* 有人会觉得 JS 坑，怎么能出现这种情况；其实问题不大，因为此时代码已经报错了，后面的代码想执行也没机会。




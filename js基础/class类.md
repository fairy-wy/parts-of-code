### 前言

传统的JS只有对象的概念，没有class类的概念，因为JS是基于原型的面向对象语言，原型对象特点就是将属性全部共享给新对象。ES6引入了class类这个概念，通过class关键字可以定义类，这就是更符合我们平时所理解的面向对象的语言。

### 类定义

注意：

* 类定义不会被提升，这意味着，必须在访问前对类进行定义，否则就会报错
* 类中方法不需要 function 关键字。
* 方法间不能加分号。
```js
// 匿名类
let Example = class {
    constructor(a) {
        this.a = a;
    }
}
// 命名类
let Example = class Example {
    constructor(a) {
        this.a = a;
    }
}
```

### 类声明

注意：不可重复声明
```js
class Example {
    constructor(a) {
        this.a = a;
    }
}
```

### 类的主体

**属性**

* prototype：ES6 中，prototype 仍旧存在，虽然可以直接在类中定义方法，但是其实方法还是定义在 prototype 上的。
```js
class Example {
    add (a, b) {
        return a + b
    }
}
Example.prototype = {
    //methods
}
```

* 静态属性：class 本身的属性，使用static关键字直接定义在类内部的属性（ Class.propname ），不需要实例化。 ES6 中规定，Class 内部只有静态方法，没有静态属性。静态属性不能被子类继承，子类不能调用；静态属性只能通过类名来调用，不能通过类的实例来调
```js
class Example {
// 新提案
    static a = 2;
}
// 目前可行写法
Example.b = 2;
```

* 公共属性
```js
class Example{}
Example.prototype.a = 2;
```

* 实例属性：定义在实例对象（ this ）上的属性。
```js
class Example {
    a = 2;
    constructor () {
        console.log(this.a);
    }
}
```

name 属性：返回跟在 class 后的类名(存在时)。
```js
let Example = class Exam {
    constructor(a) {
        this.a = a;
    }
}
console.log(Example.name); // Exam
 
let Example = class {
    constructor(a) {
        this.a = a;
    }
}
console.log(Example.name); // Example
```

**方法**

* constructor 方法：constructor 方法是类的默认方法，创建类的实例化对象时被调用。
```js
class Example{
    constructor(){
      console.log('我是constructor');
    }
}
// 实例化对象
let obj = new Example(); // 我是constructor

class Test {
    constructor(){
        // 默认返回实例对象 this
    }
}
console.log(new Test() instanceof Test); // true
 
class Example {
    constructor(){
        // 指定返回对象
        return new Test();
    }
}
console.log(new Example() instanceof Example); // false
```

* 静态方法: 静态方法通过static关键字声明，静态方法不会被子类继承，子类不能调用。静态方法中的this，指向的是类class，不是类的实例。因此静态方法只能通过类名来调用，不能通过实例来调用
```js
class Example{
    static sum(a, b) {
        console.log(a+b);
    }
}
Example.sum(1, 2); // 3
let obj = new Example()
obj.sum(1,4)  // 报错  Uncaught TypeError: obj.sum is not a function
```

* 原型方法: 在constructor外定义，没有function关键字.不能直接class类调用，会被子类继承，只能通过实例化的方法调用
```js
class Example {
    sum(a, b) {
        console.log(a + b);
    }
}
Example.sum(1, 3) // 报错  Uncaught TypeError: Example.sum is not a function
let exam = new Example();
exam.sum(1, 2); // 3
```

* 实例方法
```js
class Example {
    constructor() {
        this.sum = (a, b) => {
            console.log(a + b);
        }
    }
}
```
question：static定义的方法可以直接访问，不带static关键字的只能通过实例化对象访问，为什么？

每一个class对象加载进内存中都会有一个父对象xxxklass对其进行管理，通过这个xxxklass可以访问到class对象中的任意方法或属性。这种访问方式是不安全的，并且不会暴露给开发者，所以通过关键字static修饰的方法或属性你能直接访问（其实是通过xxxklass访问的），其他非static定义的实行和方法不能直接访问（通过实例化对象访问）。

**类的实例化**

* new：class 的实例化必须通过 new 关键字实例化类。
```js
class Example {
    constructor(a, b) {
        this.a = a;
        this.b = b;
        console.log('Example');
    }
    sum() {
        return this.a + this.b;
    }
}
let exam1 = new Example(2, 1);
let exam2 = new Example(3, 1);

 
console.log(Object.getPrototypeOf(exam1) === Object.getPrototypeOf(exam2));// true
 
Object.getPrototypeOf(exam1).sub = function() {
    return this.a - this.b;
}
console.log(exam1.sub()); // 1
console.log(exam2.sub()); // 2
```

**封装与继承**

* getter / setter: getter 不可单独出现,getter 与 setter 必须同级出现
```js
class Example{
    constructor(a, b) {
        this.a = a; // 实例化时调用 set 方法
        this.b = b
    }
    get a(){
        console.log('getter');
        return this.a;
    }
    set a(a){
        console.log('setter');
        this.a = a; // 自身递归调用
    }
}
let exam = new Example(1,2); // 不断输出 setter ，最终导致 RangeError


class Example1{
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
    get a(){
        console.log('getter');
        return this._a;
    }
    set a(a){
        console.log('setter');
        this._a = a;
    }
}
let exam1 = new Example1(1,2); // 只输出 setter , 不会调用 getter 方法
console.log(exam1._a, '_a'); // 1 _a 可以直接访问
console.log(exam1.a, 'a')  // getter 1 a
```

* extends: 通过 extends 实现类的继承。子类 constructor 方法中必须有 super ，且必须出现在 this 之前
```js
class Father1 {
    constructor(){}
    // 或者都放在子类中
    get a() {
        return this._a;
    }
    set a(a) {
        this._a = a;
    }
}
class Child1 extends Father1 {
    constructor(){
        super();
    }
}
let test1 = new Child1();
test1.a = 2;
console.log(test1.a); // 2
```

* super：子类 constructor 方法中必须有 super ，且必须出现在 this 之前；调用父类方法, super 作为对象，在普通方法中，指向父类的原型对象，在静态方法中，指向父类
```js
class Father {
    test(){
        return 0;
    }
    static test1(){
        return 1;
    }
}
class Child2 extends Father {
    constructor(){
        super();
        // 调用父类普通方法
        console.log(super.test()); // 0
    }
    static test3(){
        // 调用父类静态方法
        return super.test1+2;
    }
}
Child2.test3(); // 3
```
注意： 不可继承常规对象。
```js
var Father = {
    // ...
}
class Child extends Father {
     // ...
}
// Uncaught TypeError: Class extends value #<Object> is not a constructor or null
 
// 解决方案
Object.setPrototypeOf(Child.prototype, Father);
```

**class类特点**

* class类必须new调用，不能直接执行。class类直接执行的话会报错，而es5中的类和普通函数并没有本质区别，执行肯定是ok的。
* class类不存在变量提升
* class类无法遍历它实例原型链上的属性和方法
```js
function Foo (color) {
    this.color = color
}
Foo.prototype.like = function () {
    console.log(`like${this.color}`)
}
let foo = new Foo()
for (let key in foo) {
    // 原型上的like也被打印出来了
    console.log(key)  // color、like
}

class Foo {
    constructor (color) {
        this.color = color
    }
    like () {
        console.log(`like${this.color}`)
    }
}
let foo = new Foo('red')
for (let key in foo) {
    // 只打印一个color,没有打印原型链上的like
    console.log(key)  // color
}
```
* new.target属性.es6为new命令引入了一个new.target属性，它会返回new命令作用于的那个构造函数。如果不是通过new调用或Reflect.construct()调用的，new.target会返回undefined
```js
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

let obj = {}
Person.call(obj, 'red') // 此时使用非new的调用方式就会报错
```
* class类有static静态方法.static静态方法只能通过类调用，不会出现在实例上；另外如果静态方法包含 this 关键字，这个 this 指的是类，而不是实例。static声明的静态属性和方法都不可以被子类继承。
```js
class Foo {
  static bar() {
    this.baz(); // 此处的this指向类
  }
  static baz() {
    console.log('hello'); // 不会出现在实例中
  }
  baz() {
    console.log('world');
  }
}

Foo.bar() // hello
```
总结： 

1. 类中的构造器constructor不是必须写得，要对实例进行一些初始化操作才写，如添加特定的属性
2. 如果A类继承了B类，且A类中写了构造器constructor，那么A类构造器constructor中必须调用super.
3. 类中定义的方法都是放在了类的原型对象上




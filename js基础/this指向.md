#### 前言
this的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定this到底指向谁，实际上this的最终指向的是那个调用它的对象。

```js
function a() {
    var user = "追梦子";
    console.log(this.user); //undefined
    console.log(this); //Window
}
a();
```
this最终指向的是调用它的对象，这里的函数a实际是被Window对象所点出来的，下面的代码就可以证明。

```js
var o = {
    user:"追梦子",
    fn:function(){
        console.log(this.user); //追梦子
    }
}
window.o.fn();
```
这里的this为什么不是指向window，如果按照上面的理论，最终this指向的是调用它的对象，这里先说个而外话，window是js中的全局对象，我们创建的变量实际上是给window添加属性，所以这里可以用window点o对象。

**注意**
* 如果一个函数中有this，但是它没有被上一级的对象所调用，那么this指向的就是window，这里需要说明的是在js的严格版中this指向的不是window，但是我们这里不探讨严格版的问题.严格版中的默认的this不再是window，而是undefined。
* 如果一个函数中有this，这个函数有被上一级的对象所调用，那么this指向的就是上一级的对象。
```js
var o = {
    a:10,
    b:{
        a:12,
        fn:function(){
            console.log(this.a); //12
        }
    }
}
o.b.fn();
```
* 如果一个函数中有this，这个函数中包含多个对象，尽管这个函数是被最外层的对象所调用，this指向的也只是它上一级的对象，
```js
var o = {
    a:10,
    b:{
        // a:12,
        fn:function(){
            console.log(this.a); //undefined
        }
    }
}
o.b.fn();
```
尽管对象b中没有属性a，这个this指向的也是对象b，因为this只会指向它的上一级对象，不管这个对象中有没有this要的东西。

特殊情况
```js
var o = {
    a:10,
    b:{
        a:12,
        fn:function(){
            console.log(this.a); //undefined
            console.log(this); //window
        }
    }
}
var j = o.b.fn;
j();
```
这里this指向的是window，this永远指向的是最后调用它的对象，也就是看它执行的时候是谁调用的，虽然函数fn是被对象b所引用，但是在将fn赋值给变量j的时候并没有执行所以最终指向的是window.

#### 构造函数版this
```js
function Fn(){
    this.user = "追梦子";
}
var a = new Fn();
console.log(a.user); //追梦子
```
这里之所以对象a可以点出函数Fn里面的user是因为new关键字可以改变this的指向，将这个this指向对象a，为什么我说a是对象，因为用了new关键字就是创建一个对象实例。new操作符会改变函数this的指向问题,首先new关键字会创建一个空的对象，然后会自动调用一个函数apply方法，将this指向这个空对象，这样的话函数内部的this就会被这个空的对象替代。

#### this碰到return时
返回值是一个对象，那么this指向的就是那个返回的对象，如果返回值不是一个对象那么this还是指向最后调用函数的实例。还有一点就是虽然null也是对象，但是在这里this还是指向那个调用函数的实例，因为null比较特殊。

```js
function Fn() {  
    this.user = '追梦子';  
    return {};  
}
var a = new Fn;  
console.log(a.user); //undefined

function Fn(){  
    this.user = '追梦子';  
    return function(){};
}
var a = new Fn;  
console.log(a.user); //undefined
```
```js
function Fn(){  
    this.user = '追梦子';  
    return 1;
}
var a = new Fn;  
console.log(a.user); //追梦子

function Fn() {  
    this.user = '追梦子';  
    return undefined;
}
var a = new Fn;  
console.log(a.user); //追梦子
```
```js
function Fn() {  
    this.user = '追梦子';  
    return null;
}
var a = new Fn;  
console.log(a.user); //追梦子
```

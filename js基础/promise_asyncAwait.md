### Promise
Promise对象用于异步操作

**前言**
promise出现的原因
* 一个请求需要依赖另外一个请求，层层嵌套，出现回调地狱。promise的的出现使用多重链式调用，可以避免层层嵌套回调
* 为了代码更加具有可读性和可维护性，我们需要将数据请求与数据处理明确的区分开来

#### 1. 基本用法
promise对象代表一个未完成、但预计将来会完成的操作。

它有以下三种状态：
* pending：初始值，不是fulfilled，也不是rejected
* fulfilled：代表操作成功
* rejected：代表操作失败

Promise有两种状态改变的方式，既可以从pending转变为fulfilled，也可以从pending转变为rejected。一旦状态改变，就「凝固」了，会一直保持这个状态，不会再发生变化。当状态发生变化，promise.then绑定的函数就会被调用。Promise一旦新建就会「立即执行」，无法取消。这也是它的缺点之一。

我们使用new来构建一个Promise。Promise接受一个「函数」作为参数，该函数的两个参数分别是resolve和reject。这两个函数就是就是「回调函数」，由JavaScript引擎提供。

* resolve函数的作用：在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；
* reject函数的作用：在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise实例生成以后，可以用then方法指定resolved状态和reject状态的回调函数。

```js
let promise = new Promise(function(resolve, reject) {
    if (/* 异步操作成功 */) {
        resolve(data);
    } else {
        /* 异步操作失败 */
        reject(error);
    }
})
promise.then(function(data) {
  // do something when success
}, function(error) {
  // do something when failure
});
```

#### 基本API
##### then

语法：Promise.prototype.then(onFulfilled, onRejected)

then方法它有两个参数，分别为Promise从pending变为fulfilled和rejected时的回调函数（第二个参数非必选），并返回的是一个新的Promise实例（不是原来那个Promise实例）。且返回值将作为参数传入这个新Promise的resolve函数。因此，我们可以使用链式写法

```js
var promise = new Promise(function(resolve, reject) {
  console.log('before resolved');
  resolve(123);
  console.log('after resolved');
});

promise.then(function(data) {
  console.log(data); // 123
  return 456
}).then(function (value) {
    console.log(value); // 456
})
```

当前then函数的回调函数的参数是由上一个then函数中的回调函数的返回值传入的。

1. 当上一个then函数的回调函数返回值的类型如object，number等，则该返回值作为下一个then函数的回调函数的参数的值传入。
2. 当上一个then函数的回调函数返回值的类型为Promise<T>类型，则下一个then函数的回调函数的参数的值的类型为T即模板中指定的类型。
3. 如果then中抛出异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调onRejected，如果没有这个回调函数，则到catch方法中；

```js
// 针对1，2
Promise.resolve(2)
    .then(function(data) {
      console.log(data); // 2
      return 'hello world'
    }).then(function (data) {
        console.log(data); // hello world
    }).then(function (data) {
        console.log(data); // undefined  因为前面的then没有返回值
    }).then(function () {
        return Promise.resolve('money')  // 返回一个promise对象类型
    }).then(function (data) {
        console.log(data); // money
    })
```
```js
// 针对3
Promise.resolve(2)
    .then(function(data) {
      console.log(data); // 2
      throw new Error('error')
    }).then(function (data) {
        console.log(data); 
    }, function(err) {
        console.log(err, 'err');  // Error: error  at <anonymous>:4:13 'err'
    }).catch(function(err) {
        console.log(err, 'catch')   //不执行
    })

Promise.resolve(2)
    .then(function(data) {
      console.log(data); // 2
      throw new Error('error')
    }).then(function (data) {
        console.log(data); 
    }).catch(function(err) {
        console.log(err, 'catch')  // Error: error  at <anonymous>:4:13 'catch'
    })
```

**值穿透**
.then 或者 .catch 的参数期望是函数，传入非函数就会发生值穿透；Promise方法链通过 return 传值，没有 return 就只是相互独立的任务而已

```js
Promise.resolve(1)
    .then(function() {
        return 2
    }).then(Promise.resolve(3))
    .then(function(data) {
        console.log(data)  // 2
    })
```

##### catch

语法：Promise.prototype.catch(onRejected)

```js
var promise = new Promise(function (resolve, reject) {
    throw new Error('test');
});
/*******等同于*******/
var promise = new Promise(function (resolve, reject) {
    reject(new Error('test'));
});

//用catch捕获
promise.catch(function (error) {
    console.log(error);
});
// Error: test
```

总结：
* promise对象的错误，会一直向后传递，直到被捕获。即错误总会被下一个catch所捕获。then方法指定的回调函数，若抛出错误，也会被下一个catch捕获。catch中也能抛错，则需要后面的catch来捕获。
* 如果没有使用catch方法指定处理错误的回调函数，Promise对象抛出的错误不会传递到外层代码，即不会有任何反应（只有Chrome会抛错，且promise状态变为rejected，Firefox和Safari中错误不会被捕获，也不会传递到外层代码，最后没有任何输出，promise状态也变为rejected。），这是Promise的另一个缺点。
```js
var promise = new Promise(function (resolve, reject) {
    resolve(x);
});
promise.then(function (data) {
    console.log(data, 'data');
});
// Promise {<rejected>: ReferenceError: x is not defined
// Uncaught (in promise) ReferenceError: x is not defined
//     at <anonymous>:2:13
//     at new Promise (<anonymous>)
//     at <anonymous>:1:15
```
* promise状态一旦改变就会凝固，不会再改变。因此promise一旦fulfilled了，再抛错，也不会变为rejected，就不会被catch了。
```js
var promise = new Promise(function(resolve, reject) {
  resolve('test');
  throw 'error';
});
promise.then((data) => {
    console.log(data, 'data')  // test data
}).catch(function(e) {
   console.log(e, 'err');      // 不执行
});
```
* 如果在then中抛错，而没有对错误进行处理（即catch），那么会一直保持reject状态，直到catch了错误
```js
function taskA() {
    console.log(x);
    console.log("Task A");
}
function taskB() {
    console.log("Task B");
}
function onRejected(error) {
    console.log("Catch Error: A or B", error);
}
function finalTask() {
    console.log("Final Task");
}
var promise = Promise.resolve();
promise
    .then(taskA)
    .then(taskB)
    .catch(onRejected)
    .then(finalTask);
// -------output-------
// Catch Error: A or B,ReferenceError: x is not defined
// Final Task
```
* 在异步回调中抛错，不会被catch到
```js
var promise = new Promise(function(resolve, reject) {
  setTimeout(function() {
    throw 'Uncaught Exception!';
  }, 1000);
});

promise.catch(function(e) {
  console.log(e);       // 不执行
});
```

##### all
Promise.all方法接受一个数组（或具有Iterator接口）作参数，数组中的对象（p1、p2、p3）均为promise实例（如果不是一个promise，该项会被用Promise.resolve转换为一个promise)。它的状态由这三个promise实例决定。这多个 promise 是同时开始、并行执行的，而不是顺序执行

```js
var p = Promise.all([p1, p2, p3]);
```
* 当p1, p2, p3状态都变为fulfilled，p的状态才会变为fulfilled，并将三个promise返回的结果，按参数的顺序（而不是 resolved的顺序）存入数组，传给p的回调函数
* 当p1, p2, p3其中之一状态变为rejected，p的状态也会变为rejected，并把第一个被reject的promise的返回值，传给p的回调函数

```js
// resolve情况
var p1 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 3000, "first");
});
var p2 = new Promise(function (resolve, reject) {
    resolve('second');
});
var p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, "third");
}); 

Promise.all([p1, p2, p3]).then(function(values) { 
  console.log(values);  
});
//约 3s 后
// ["first", "second", "third"] 

// reject情况
var p1 = new Promise((resolve, reject) => { 
  setTimeout(resolve, 1000, "one"); 
}); 
var p2 = new Promise((resolve, reject) => { 
  setTimeout(reject, 2000, "two"); 
});
var p3 = new Promise((resolve, reject) => {
  reject("three");
});

Promise.all([p1, p2, p3]).then(function (value) {
    console.log('resolve', value);
}, function (error) {
    console.log('reject', error);    // => reject three
});
// reject three
```

##### race
Promise.race方法同样接受一个数组（或具有Iterator接口）作参数。当p1, p2, p3中有一个实例的状态发生改变（变为fulfilled或rejected），p的状态就跟着改变。并把第一个改变状态的promise的返回值，传给p的回调函数。

```js
var p = Promise.all([p1, p2, p3]);
```
```js
var p1 = new Promise(function(resolve, reject) { 
    setTimeout(reject, 500, "one"); 
});
var p2 = new Promise(function(resolve, reject) { 
    setTimeout(resolve, 100, "two"); 
});

Promise.race([p1, p2]).then(function(value) {
    console.log('resolve', value); 
}, function(error) {
    //not called
    console.log('reject', error); 
});
// resolve two
```
* 在第一个promise对象变为resolve后，并不会取消其他promise对象的执行
```js
var fastPromise = new Promise(function (resolve) {
    setTimeout(function () {
        console.log('fastPromise');
        resolve('resolve fastPromise');
    }, 100);
});
var slowPromise = new Promise(function (resolve) {
    setTimeout(function () {
        console.log('slowPromise');
        resolve('resolve slowPromise');
    }, 1000);
});
// 第一个promise变为resolve后程序停止
Promise.race([fastPromise, slowPromise]).then(function (value) {
    console.log(value);    // => resolve fastPromise
});
// fastPromise
// resolve fastPromise
// slowPromise     //仍会执行
```

##### resolve
Promise对象立即进入resolved状态，并将结果success传递给then指定的onFulfilled回调函数。由于Promise.resolve()也是返回Promise对象，因此可以用.then()处理其返回值。
```js
Promise.resolve('Success');

/*******等同于*******/
new Promise(function (resolve) {
    resolve('Success');
});

Promise.resolve('success').then(function (value) {
    console.log(value);
});
// success
```

* Promise.resolve()的另一个作用就是将thenable对象（即带有then方法的对象）转换为promise对象。
```js
var p1 = Promise.resolve({ 
    then: function (resolve, reject) { 
        resolve("this is an thenable object!");
    }
});
console.log(p1 instanceof Promise);     // => true

p1.then(function(value) {
    console.log(value);     // => this is an thenable object!
  }, function(e) {
    //not called
});
```

##### reject
Promise对象立即进入rejected状态，并将错误对象传递给then指定的onRejected回调函数。
```js
Promise.reject(new Error('error'));

/*******等同于*******/
new Promise(function (resolve, reject) {
    reject(new Error('error'));
});
```

##### finally
finally方法方法返回一个Promise，用于指定不管 Promise 对象最后状态如何，都会执行的操作.finally方法的回调函数不接受任何参数，意味着没有办法知道promise的状态是fulfilled还是rejected。说明finally里面的操作与状态无关，不依赖于promise的执行结果。inally()的实现原理无非就是无论then后面成功还是失败，promise是fulfilled还是rejected，都会执行准备好的回调函数

```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

### async/await
#### async
用于声明异步函数，返回值为一个 Promise 对象，它以类似 同步 的方式来写异步方法，语法与声明函数类似
```js
async function fn() {
    console.log('Hello world!');
}

console.log(fn().constructor); // Promise()
// 这里证明其返回值为一个 Promise 对象；
```

* 返回值是 Promise 对象，那么函数本身定义的返回值跑到哪里去了呢？其实，熟悉 Promise 的就知道其异步结果是通过 .then() 或者 .catch() 方法来获取并进行进一步处理的，这样一个道理，定义的异步函数中的返回值会当成 resolve 状态来处理，一般用 .then() 方法处理，而如果定义的异步函数抛出错误，例如变量未定义，则会被当做 reject 状态来处理，一般使用 .catch() 方法来处理
```js
// 使用 .then() 的情况
async function fn1() {
    return 'Hello world!';
}
console.log(fn1())   // Promise {<fulfilled>: 'Hello world!'} 一个promise对象
fn1().then(function(res) {
    console.log(res);
});
// Hello world!
```
```js
// 使用 .catch() 的情况
async function fn2() {
    console.log(aaa); // 这里的变量 aaa 未定义，为了制造错误
}

fn2().catch(function(error) {
    console.log(error);
});
// ReferenceError: aaa is not defined
```
* async 也可以用于声明匿名函数用于不同场景，或者嵌套使用 async 函数，如 await async 的形式，只是要在 await 后面使用 async 形式的函数的话，需要这个函数是立即执行函数且有返回值。另外，await 后面的 Promise 返回的 reject， 也可以被该 async 函数返回的 Promise 对象以 reject 状态获取
```js
let fn = async function() {
    let a = await (async function() {
        console.log(1);
        return 2;
    })();
    console.log(a);

    async function fn2() {
        return 3;
    }
    console.log(await fn2());
}
fn();
// 1
// 2
// 3
```
```js
async function fn() {
    console.log(0);

    setTimeout(() => {
        console.log(1);
    }, 0);

    (async function() {
        console.log(2);
    
        setTimeout(() => {
            console.log(3);
        }, 0);

        await new Promise(res => setTimeout(res, 1000))

        setTimeout(() => {
            console.log(4);
        }, 1000);

        console.log(5);
    })()

    console.log(6)
}

fn();
// 0
// 2
// 6
// 1
// 3
// 5（1 秒后）
// 4（再等 1 秒后）
```
```js
// reject情况
async function fn() {
    console.log(1);
    var result = await new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject(2);
        }, 2000);
    });
    console.log(3);
}
fn().catch(function(error) {
    console.log(error);
});
// 1
// 2 (2 秒后输出)
```

#### await
用法顾名思义，有 等待 的意思，语法为
```js
var value = await myPromise();
```
所谓 等待 其实就是指暂停当前 async function 内部语句的执行，等待后面的 myPromise() 处理完返回结果后，继续执行 async function 函数内部的剩余语句；myPromise() 是一个 Promise对象，而自定义的变量 value 则用于获取 Promise 对象返回的 resolve 状态值；

* await 必须在 async function 内使用，否则会提示语法错误；如果 await 后面跟的是其他值，则直接返回该值
```js
async function fn() {
    console.log(1);
    var result = await new Promise(function(resolve, reject) {
        setTimeout(function(){
            resolve(2);
        }, 2000);
    });
	console.log(result);
    console.log(3);
    console.log(await 4); // 4 会被直接返回
}
fn();
// 1
// 2 (2 秒后输出)
// 3
// 4
```
* 如果不用获取返回值，也可以直接执行语句：
```js
async function fn() {
    console.log(1);
    await new Promise(function(resolve, reject) {
        setTimeout(function() {
            console.log(2);
            resolve(0);
        }, 2000);
    });
    console.log(3);
}
fn();
// 1
// 2 (2 秒后)
// 3
```
* await 会等到后面的 Promise 返回结果 后才会执行 async 函数后面剩下的语句，也就是说如果 Promise 不返回结果（如 resolve 或 reject），后面的代码就不会执行.如果 await 后面的 Promise 返回一个 reject 状态的结果的话，则会被当成错误在后台抛出
```js
async function fn() {
    console.log(1);
    await new Promise(function(resolve, reject) {
        setTimeout(function() {
            console.log(2);
        }, 2000);
    });
    console.log(3);
}
fn();
// 1
// 2 (2 秒后输出，并且后面不会继续输出 3)

async function fn() {
    console.log(1);
    var result = await new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject(2);
        }, 2000);
    });
    console.log(3);
}
fn();
// 1
// Uncaught (in promise) 2 (2 秒后输出)
// 2 秒后会抛出出错误，并且 3 这个数并没有被输出，说明后面的执行也被忽略了；
```
* 函数会等待 await 返回结果在继续执行，但是 await 内部的代码也依然按正常的同步和异步执行;假如 await 代码内返回结果的函数（resolve() 或 reject()）是在 同步任务 中执行的话,情况就有些不一样了
```js
// resolve()在异步代码中
async function fn() {
    console.log(0);
    setTimeout(() => {
        console.log(1);
    }, 0);

    await new Promise(resolve => {
        setTimeout(() => {
            console.log(2);
        }, 0);

        console.log(3);

        setTimeout(() => {
            console.log(4);
            resolve();
        }, 1000);

        setTimeout(() => {
            console.log(5);
        }, 0);
    });

    setTimeout(() => {
        console.log(6);
    }, 0);
    console.log(7);
}
fn();
// 0
// 3
// 1
// 2
// 5
// 4（1 秒后）
// 7
// 6
```
```js
// resolve()在同步代码中
async function fn() {
    console.log(0);

    setTimeout(() => {
        console.log(1);
    }, 0);

    await new Promise(resolve => {
        setTimeout(() => {
            console.log(2);
        }, 0);

        console.log(3);
        resolve();
        console.log(4);

        setTimeout(() => {
            console.log(5);
        }, 0);
    });

    setTimeout(() => {
        console.log(6);
    }, 0);
    console.log(7);
}

fn();
// 0 
// 3
// 4
// 7
// 1
// 2
// 5
// 6
// 由于同步任务 先于 异步任务执行的机理，在同步任务执行过程中依次输出了 0、3 后，就立即执行了 resolve() 使得 await 得到了返回结果，再往后就继续同步的输出了 4，但是输出 5 的代码是异步任务，与输出 1、2 的代码一并放入任务队列，此时由于 await 返回了结果，所以可以执行 await 以外的代码了，输出 6 是异步任务，于是先输出了同步任务的 7，同步任务都执行完了，最后执行任务队列中的异步任务，按之前进入队列的顺序，就是依次输出 1、2、5、6，所有代码运行结束；
```








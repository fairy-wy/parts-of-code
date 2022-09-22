### 1.关于javascript
  javascript是一门单线程语言（浏览器同时只能有一个js引擎线程在运行js程序），在最新的HTML5中提出了Web-Worker，但javascript是单线程这一核心仍未改变。所以一切javascript版的"多线程"都是用单线程模拟出来的

### 2.js为什么是单线程?
  因为js作为浏览器脚本语言，主要用途是与用户互动，以及操作DOM，这决定了他只能是单线程。否则会引起复杂的同步问题。比如：js有两个线程，一个线程是在某个DOM节点添加内容；一个线城是删除这个节点。这时候浏览器应该以哪个为准？
  
### 3.事件循环机制
  单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。如果排队是因为计算量大，CPU忙不过来，倒也算了，但是很多时候CPU是闲着的，因为IO设备（输入输出设备）很慢（比如Ajax操作从网络读取数据），不得不等着结果出来，再往下执行。
　JavaScript语言的设计者意识到，这时主线程完全可以不管IO设备，挂起处于等待中的任务，先运行排在后面的任务。等到IO设备返回了结果，再回过头，把挂起的任务继续执行下去。于是，所有任务可以分成两种，一种是同步任务（synchronous），另一种是异步任务（asynchronous）。同步任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；异步任务指的是，不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行
 
  * 同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入Event Table并注册函数。
  * 当Event Table中指定的事情完成时，会将这个函数移入Event Queue。
  * 主线程内的任务执行完毕为空，会去Event Queue读取对应的函数，进入主线程执行。
  * 上述过程会不断重复，也就是常说的Event Loop(事件循环)。
  * 我们不禁要问了，那怎么知道主线程执行栈为空啊？js引擎存在monitoring process进程，会持续不断的检查主线程执行栈是否为空，一旦为空，就会去Event Queue那里检查是否有等待被调用的函数。
  
### 4.宏任务与微任务
  任务在广义上分为同步任务和异步任务；更精细的划分分为宏任务与微任务。
  宏任务： script主代码块， setTimeout, setInterval, setImmediate,  requestAnimationFrame, I/O操作等
  微任务： promise.then(), process.nextTick(), Object.observe, MutationObserver等
  
### 5.js执行顺序
  * 首先整体的script（作为第一个宏任务）开始执行，把所有的代码分为同步任务和异步任务两部分，同步任务代码块进入主线程依次执行，异步任务再被分为宏任务和微任务
  * 宏任务进入到Event Table中，并在里面注册回调函数，每当指定的事件完成时，Event Table会将这个函数移到Event Queue中
  * 微任务也会进入到另一个Event Table中，并在里面注册回调函数，每当指定的事件完成时，Event Table会将这个函数移到Event Queue中
  * 主线程内的任务执行完毕，主线程为空时，会检查微任务的Event Queue，如果有任务，就全部执行，如果没有就执行下一个宏任务
  * 上述过程会不断重复，这就是Event Loop，比较完整的事件循环
  
  图解![image](https://user-images.githubusercontent.com/48582204/191678492-559e8a87-e2f3-47d4-9126-56a9cf105e13.png)
  
  **js执行机制实例**
  ```js
  console.log('1');
  setTimeout(function() {
      console.log('2');
      process.nextTick(function() {
          console.log('3');
      })
      new Promise(function(resolve) {
          console.log('4');
          resolve();
      }).then(function() {
          console.log('5')
      })
  })
  process.nextTick(function() {
      console.log('6');
  })
  new Promise(function(resolve) {
      console.log('7');
      resolve();
  }).then(function() {
      console.log('8')
  })

  setTimeout(function() {
      console.log('9');
      process.nextTick(function() {
          console.log('10');
      })
      new Promise(function(resolve) {
          console.log('11');
          resolve();
      }).then(function() {
          console.log('12')
      })
  })
  //分析如下：
    //第一轮事件循环流程分析如下：
    //整体script作为第一个宏任务进入主线程，遇到console.log，输出1。
    //遇到setTimeout，其回调函数被分发到宏任务Event Queue中。我们暂且记为setTimeout1。
    //遇到process.nextTick()，其回调函数被分发到微任务Event Queue中。我们记为process1。
    //遇到Promise，new Promise直接执行，输出7。then被分发到微任务Event Queue中。我们记为then1。
    //又遇到了setTimeout，其回调函数被分发到宏任务Event Queue中，我们记为setTimeout2。
    //执行第一轮宏任务后的所有微任务队列的微任务，输出6,8,第一轮事件循环正式结束，这一轮的结果是输出1，7，6，8。
     
    //那么第二轮时间循环从setTimeout1宏任务开始：
    //首先输出2。接下来遇到了process.nextTick()，同样将其分发到微任务Event Queue中，
    //记为process2。new Promise立即执行输出4，then也分发到微任务Event Queue中，记为then2。
    //第二轮事件循环宏任务结束，我们发现有process2和then2两个微任务可以执行。第二轮输出2，4，3，5。

    //第三轮事件循环开始，此时只剩setTimeout2了，执行。
    //直接输出9。
    //将process.nextTick()分发到微任务Event Queue中。记为process3。
    //直接执行new Promise，输出11。
    //将then分发到微任务Event Queue中，记为then3。
    //第三轮事件循环宏任务执行结束，执行两个微任务process3和then3。第三轮输出9，11，10，12。
 
    //整段代码，共进行了三次事件循环，完整的输出为1，7，6，8，2，4，3，5，9，11，10，12。
  ```
  


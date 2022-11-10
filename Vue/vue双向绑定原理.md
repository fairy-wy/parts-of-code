
### 双向数据绑定原理

双向数据绑定就是无论用户更新View还是Model，另一个都能跟着自动更新

双向绑定由三个重要部分（MVVM）构成：

* 数据层（Model）：应用的数据及业务逻辑；
* 视图层（View）：应用的展示效果，各类UI组件；
* 业务逻辑层（ViewModel）：框架封装的核心，它负责将数据与视图关联起来。

ViewModel的主要职责是：数据变化后更新视图；视图变化后更新数据。

ViewModel有两个主要组成部分：

* 监听器（Observer）：对所有数据的属性进行监听；
* 解析器（Compiler）：对每个元素节点的指令进行扫描跟解析，根据指令模板替换数据，以及绑定响应的更新函数。

![](https://segmentfault.com/img/bVbAcnZ)

**v-model**

v-model，被称为双向数据绑定指令，就是Vue实例对数据进行修改，页面会立即感知，相反页面对数据进行修改，Vue内部也会立即感知。

实现原理：

* 数据 -> 视图 Object.defineProperty劫持对象属性的值改变, set方法里影响视图
* 视图 -> 数据 监测input/change事件, 把值赋给变量
```js
<input type="text" v-model="message">
// 相当于
<input type="text" v-bind:value="message" v-on:input="message=$event.target.value">
```
实现双向绑定
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
        <input type="text" id="input">
    </div>
</body>
</html>
<script>
    // 获取元素
    var inputEle = document.getElementById('input')
    let data = {
      msg: "我是初始值"
    }
    

    // 控制台打印
    console.log(data.msg)  // 我是初始值

    // 视图驱动数据  ===>  oninput事件
    inputEle.oninput = function (event) {
        data.msg = inputEle.value
    }
    // 如果在输入框输入test,此时打印的msg的值为test
    console.log(data.msg)  // test


    // 数据驱动视图  ===>   Object.defineProperty / proxy
    // 使用Object.defineProperty  劫持对象属性
//    Object.defineProperty(data, 'msg', {
//      set (val) {
//         inputEle.value = val
//      },
//      get () {

//      }
//    })

   // 使用proxy 劫持整个对象
  let temp = new Proxy(data, {
    set: function(target, prop, val) {
      data.msg = val;
      inputEle.value = val
      return Reflect.set(target, prop, val)
    },
    get: function(target, prop) {
        return Reflect.get(target, prop)
    }
  })
  temp.msg = '我是通过proxy实现的数据影响视图'
  // input框中会出现 '我是通过proxy实现的数据影响视图'
</script>

```

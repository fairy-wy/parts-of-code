
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

动态绑定了input的value指向了变量，并且在触发input事件的时候动态的把变量设置为目标值：
```js
<input type="text" v-model="message">
// 相当于
<input type="text" v-bind:value="message" v-on:input="message=$event.target.value">
```

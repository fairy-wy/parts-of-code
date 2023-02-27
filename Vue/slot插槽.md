### slot是什么
在HTML中 slot 元素 ，作为 Web Components 技术套件的一部分，是Web组件内的一个占位符,该占位符可以在后期使用自己的标记语言填充
```html
<template id="element-details-template">
  <slot name="element-name">Slot template</slot>
</template>
<element-details>
  <span slot="element-name">1</span>
</element-details>
<element-details>
  <span slot="element-name">2</span>
</element-details>
```
template不会展示到页面中，需要用先获取它的引用，然后添加到DOM中，
```js
customElements.define('element-details',
  class extends HTMLElement {
    constructor() {
      super();
      const template = document
        .getElementById('element-details-template')
        .content;
      const shadowRoot = this.attachShadow({mode: 'open'})
        .appendChild(template.cloneNode(true));
  }
})
```

### Vue的插槽slot

Slot：插槽，花名“占坑”，我们可以理解为solt在组件模板中占好了位置，当使用该组件标签时候，组件标签里面的内容就会自动填坑（替换组件模板中slot位置），作为承载分发内容的出口。可以将其类比为插卡式的FC游戏机，游戏机暴露卡槽（插槽）让用户插入不同的游戏磁条（自定义内容）

### 使用场景

* 通过插槽可以让用户可以拓展组件，去更好地复用组件和对其做定制化处理

* 如果父组件在使用到一个复用组件的时候，获取这个组件在不同的地方有少量的更改，如果去重写组件是一件不明智的事情,通过slot插槽向组件内部指定位置传递内容，完成这个复用组件在不同场景的应用。比如布局组件、表格列、下拉选、弹框显示内容等

### 分类

slot可以分来以下三种：

* 默认插槽：子组件用<slot>标签来确定渲染的位置，标签里面可以放DOM结构，当父组件使用的时候没有往插槽传入内容，标签内DOM结构就会显示在页面
，父组件在使用的时候，直接在子组件的标签内写入内容即可
```html
<!-- 子组件Child.vue -->
<template>
    <p>默认插槽组件<p>
    <slot>
      <p>插槽后备的内容</p>
    </slot>
</template>
```
```html
<!-- 父组件 -->
<Child>
  <div>我是默认插槽</div>  
</Child>
```
此时的页面上显示的是 ===>  默认插槽组件，我是默认插槽


* 具名插槽：子组件用name属性来表示插槽的名字，不传为默认插槽，父组件中在使用时在默认插槽的基础上加上slot属性，值为子组件插槽name属性值
```html
<!-- 子组件Child.vue -->
<template>
   <slot>插槽后备的内容</slot>
   <slot name="title">插槽的标题</slot>
   <slot name="content">插槽后备的内容</slot>
</template>
```
```html
<!-- 父组件 -->
<child>
    <template v-slot:default>具名插槽</template>
    <!-- 具名插槽⽤插槽名做参数 -->
    <template v-slot:title>我的标题</template>
    <!-- 具名插槽⽤插槽名做参数 -->
    <template v-slot:content>内容为我是仙女</template>
</child>
```

* 作用域插槽：子组件在作用域上绑定属性来将子组件的信息传给父组件使用，这些属性会被挂在父组件v-slot接受的对象上，父组件中在使用时通过v-slot:（简写：#）获取子组件的信息，在内容中使用
```html
<!-- 子组件Child.vue -->
<template> 
  <slot name="footer" testProps="子组件的值">
        <h3>没传footer插槽</h3>
    </slot>
</template>
```
```html
<!-- 父组件 -->
<child> 
    <!-- 把v-slot的值指定为作⽤域上下⽂对象 -->
    <template v-slot:default="slotProps">
      来⾃⼦组件数据：{{slotProps.testProps}}
    </template>
</child>
```

小结：

* v-slot属性只能在<template>上使用，但在只有默认插槽时可以在组件标签上使用
* 默认插槽名为default，可以省略default直接写v-slot
* 缩写为#时不能不写参数，写成#default
* 可以通过解构获取v-slot={user}，还可以重命名v-slot="{user: newName}"和定义默认值v-slot="{user = '默认值'}"


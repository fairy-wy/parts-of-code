
### 虚拟Dom
虚拟DOM其实就是用一个原生的JS对象去描述一个DOM节点，实际上它只是对真实 DOM 的一层抽象。在vue中，每个组件都有一个render函数，每个render函数都会返回一个虚拟dom树，这意味着每个组件都对应着一颗虚拟dom树。最终可以通过一系列操作使这棵树映射到真实环境上。

**为什么需要虚拟dom**

 虚拟DOM就是为了解决浏览器性能问题而被设计出来的。因为真实Dom的创建，更新，插入会带来大量的性能消耗，从而就会极大地降低渲染效率。所以，用JS对象模拟DOM节点的好处是，页面的更新可以先全部反映在JS对象(虚拟DOM)上，操作内存中的JS对象的速度显然要更快，等更新完成后，再将最终的JS对象映射成真实的DOM，交由浏览器去绘制。

 ```html
<div class="box">test</div>
```
```js
let vnode = {
    tag: 'div',
    data: {
        attrs: {class: 'box'}
    },
    children: undefined,
    text: 'test',
    elm: div
}
```
vnode中有以下几个主要的属性：

* tag：组件的标签名，
* data: 组件的属性，
* children: 组件的子标签
* elm: 组件对应真实Dom
* parent: 父级元素

**render函数**

作用：创建虚拟dom，通过h函数创建虚拟节点

h函数接收三个参数

* 标签名/组件的选项对象/函数 （必选）
* 标签的属性对象的数据 （可选）
* 子级虚拟节点（字符串形式或者数组形式），子级节点也需要h函数构建。
```vue
<script>
import h from 'vue'
export default {
    data () {
        return {}
    },
    render () {
        return h('div', {class: 'box'}, 'test')
    }
}
</script>
```
虚拟Dom渊然流程：模板 ==> AST(抽象语法树) ==> 渲染（render）函数 ==> 虚拟DOM树 ==> 真实DOM

* vuejs通过编译(complie)将模板（template）转化成AST（抽象语法树），然后将AST转化成渲染函数（render），执行渲染函数可以得到一个虚拟节点树

* 最后通过vue响应式更新视图

```js
// 手写h函数
function vnode(tag, data, text, children, elm,) {
    return {tag, data, text, children, elm}
}

const h = (tag) => {
    if(typeof arguments[0]  !== 'string') return ('h函数参数序错误')
    switch(arguments.length) {
        case 1:
            // 只有一个参数 为tag  h('div')
            return vnode(arguments[0], {}, undefined, undefined, undefined)
            break;
        case 2:
            let secondParam = arguments[1]
            // 第二个参数是是字符串或者数字  即为元素的文本节点  h('div', 'text')
            if(typeof secondParam  == 'string' || typeof secondParam == 'number') {
                return vnode(arguments[0], {}, secondParam, undefined, undefined)
            }else if(Array.isArray(secondParam)) {
                // 第二个参数是数组  说明有子节点  h('div', [h('span', '1'). h('span', '2')])
                if(secondParam.length==0) return
                let children = []
                for (var i=0;i<secondParam.length;i++) {
                    if(typeof secondParam[i] === 'object' && secondParam[i].hasOwnProperty('tag')) {
                        children.push(secondParam[i])
                    }
                }
                return vnode(arguments[0], {}, undefined, children, undefined)
            } else if(!Array.isArray(secondParam) && typeof secondParam === 'object') {
                // 第二个参数是对象  标签元素的属性  h('div', {class: 'box'})
                return vnode(arguments[0], secondParam, undefined, undefined, undefined)
            }
            break;
        case 3: 
             // 第3个参数是是字符串或者数字   h('div', {}, 'text')
             let thirdParam = arguments[2]
             if(typeof thirdParam  == 'string' || typeof thirdParam == 'number') {
                return vnode(arguments[0], {}, thirdParam, undefined, undefined)
            }else if(Array.isArray(thirdParam)) {
                // 第3个参数是数组  h('div', {}, [h('span', '1'). h('span', '2')])
                if(thirdParam.length==0) return
                let children = []
                for (var i=0;i<thirdParam.length;i++) {
                    if(typeof thirdParam[i] === 'object' && thirdParam[i].hasOwnProperty('sel')) {
                        children.push(thirdParam[i])
                    }
                }
                return vnode(arguments[0], {}, undefined, children, undefined)
            } else if(thirdParam.hasOwnProperty('sel')) {
                // 第3个参数是对象 h('div', {}, h('span', 1))
                return vnode(arguments[0], {}, undefined, [thirdParam], undefined)
            }
            break;
    }
}
```

**虚拟DOM好处**

* 具备跨平台的优势–由于 Virtual DOM 是以 JavaScript 对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力，比如说浏览器平台、Weex、Node 等。
* 操作 DOM 慢，js运行效率高。最大限度地减少DOM操作，操作虚拟Dom从而显著提高性能。Virtual DOM 本质上就是在 JS 和 DOM 之间做了一个缓存。
* 提升渲染性能 Virtual DOM的优势不在于单次的操作，而是在大量、频繁的数据更新下，能够对视图进行合理、高效的更新

**虚拟dom如何转换成真实dom**

在虚拟Dom中，都有属性elm属性，这个属性对应的就是真实Dom，将虚拟Dom对象通过creatElement函数创建真实Dom
```js
// 通过虚拟Dom创建真实元素
function creatRealElement (vnode) {
    // 把虚拟节点变成真实节点
    let ele = document.createElement(vnode.tag)
    // 判断是有子节点还是内容
    if(vnode.text!=''&& (vnode.children==undefined || vnode.children.length==0)) {
        // 没有子节点，是文字内容
        ele.innerText = vnode.text
    }else if(Array.isArray(vnode.children)) {
        for(var i=0;i<vnode.children.length;i++) {
            // 递归创建子元素
            creatElement(vnode.children[i])
            let childDom = vnode.children[i].elm
            // 将子元素append到父元素上
            ele.appendChild(childDom)
        }

    }
    // 给虚拟节点的elm属性赋值
    vnode.elm = ele
    return vnode.elm
}
```

### ![diff算法](https://blog.csdn.net/weixin_43690348/article/details/113503376?ivk_sa=1024320u)

diff算法就是进行虚拟节点对比，并返回一个patch对象，用来存储两个节点不同的地方，最后用patch记录的消息去局部更新Dom。

**diff 发生的时机**

在数据更新的时候发生的 diff ，因为数据更新会运行 render 函数得到虚拟的 dom 树，最后页面重新渲染。当组件创建的时候，组件所依赖的属性或者数据发生了改变的时候，会运行一个函数（下面代码中的updateComponent）,该函数会做两件事：

* 运行_render 生成一个新的虚拟 dom 树；
* 运行 _updata, 传入的_render 生成虚拟的 dom 树，将他和旧的虚拟 dom 树来进行对比，最后完成真实 dom 的更新。

判断是否为同一节点方法： **选择器相同且key相同**。

**diff算法特点：**

* 虚拟DOM的key值为唯一标识，非常重要，如果没有key值，则进行暴力拆解，插入新的，删除旧的
* 同一个虚拟节点节点才进行精细化比较，否则暴力拆解，插入新的，删除旧的（判断方法：虚拟节点的key值和sel（选择器）相同）
* 只进行同层比较，如果跨层了就会进行暴力拆解，插入新的，删除旧的

**diff算法核心patch函数**

patch函数接收两个参数（新旧虚拟DOM），patch函数就是比较新旧虚拟Dom,patch函数被调用时：

1. 首先判断旧的vnode是否为虚拟节点

如果为真实节点，则利用 h函数和vnode函数 将其包装为虚拟节点 ，然后进行第2步

2. 判断新旧虚拟节点是否为同一节点（根据tag值和key值）

如果不为同一节点，则暴力拆解，插入新的（利用createElement插入），拆除旧的，如果为同一节点，则进行精细化比较，进行第3步

3. 判断是否新旧虚拟节点是否为同一对象

如果为同一个对象，则不需要做什么。如果不是同一个对象，则进行第4步

4. 判断新的虚拟节点是否有text属性

如果新的虚拟节点有text属性，查看是否和旧的虚拟节点的text属性相同，相同则不做什么，如果不相同，则直接使用新的虚拟节点的text替换               旧的虚拟节点的elm（即对应的真实节点）的innerText属性值。如果新的虚拟节点没有text属性，意味着新的虚拟节点有children子节点，则进               行第5步

5. 判断旧的虚拟节点是否有children属性

如果旧的虚拟节点没有children属性（即有text属性），则清空旧的虚拟节点的text，并且把新的虚拟节点的children插入到Dom中。如果旧的              虚拟节点有children属性，则需要进行更精细化的比较更新

**更精细化的比较updateChildren**

循环条件（新前 <= 新后 && 旧前 <= 旧后）     

对比按如下顺序，一旦命中（判断是否是同一个节点）一个，则不往下继续命中

1. 新前旧前：不需要移动节点，新前旧前指针下移

2. 新后旧后：不要要移动节点，新后旧后指针上移

3. 新后旧前：需要移动节点，更新旧前指向的虚拟节点对应的真实Dom,将新后指向的节点(即旧前指向的节点)对应的真实Dom移动到旧后对应的真            实Dom的后面，将旧前当前位置置为undefined.新后指针逐级上移，旧前指针逐级下移

4. 新前旧后：需要移动节点，更新旧后指向的虚拟节点对应的真实Dom,将新前指向的节点(即旧后指向的节点)对应的真实Dom移动到旧前对应的真             实Dom的前面，将旧后当前位置置为undefined。旧后指针逐级上移，新前指针逐级下移

如果以上四种情况都未命中

则使用循环查找，创建一个map表，用于储存旧的虚拟节点中子节点的key和下标的键值对，查看新前指向的节点在旧的虚拟节点中是否存在，如果不存在，说明新前指向的是一个全新的节点，则根据新前指向的虚拟dom创建一个对应的真实dom插入到旧前节点所对应的真实dom前面。如果在旧的虚拟节点中找到了新前对应的虚拟节点，说明不是新增的，需要找到的那个虚拟节点对应的真实dom，并且位置也需要处理。在旧的虚拟节点中把那个找到的虚拟节点对应的位置标记为undefined，防止重复处理，然后更新节点，把找到的虚拟节点移动到旧前之前，新前指针下移。

通过新旧子节点谁先循环完毕判断是新增还是删除，旧的先循环完为新增（位于新前和新后的为新增），新的先循环完为删除（介于旧前和旧后的就是要删除的）

![diff算法完整图解](https://img-blog.csdnimg.cn/20210204101210268.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MzY5MDM0OA==,size_16,color_FFFFFF,t_70)







### 路由传参

**params传参**

1. 显示参数

  params 传参（显示参数）又可分为 声明式 和 编程式 两种方式：

  * 声明式 router-link：通过 router-link 组件的 to 属性实现，该方法的参数可以是一个字符串路径，或者一个描述地址的对象。使用该方式传值的时候，需要子路由提前配置好参数

```vue
// 父路由组件
<router-link :to="/child/123">进入Child路由</router-link>
```
```js
//子路由配置
{
  path: '/child/:id',
  component: Child
}
```

  * 编程式 this.$router.push：该方式传值的时候，同样需要子路由提前配置好参数

```js
  //子路由配置
{
  path: '/child/:id',
  component: Child
}
//父路由编程式传参(一般通过事件触发)
this.$router.push({
    path:'/child/${id}',
})
```
在子路由中可以通过this.$route.params.id来获取传递的参数值

2. 不显示参数 (页面刷新传递的参数数据会消失)

  params 传参（不显示参数）也可分为 声明式 和 编程式 两种方式，与方式一不同的是，这里是通过路由的别名 name 进行传值的，不能用path，否则params将无效

  * 声明式 router-link: 通过 router-link 组件的 to 属性实现

```vue
<router-link :to="{name:'Child',params:{id:123}}">进入Child路由</router-link>
```

  * 编程式 this.$router.push:需要子路由提前配置好参数，不过不能再使用 :/id 来传递参数了，因为父路由中，已经使用 params 来携带参数了

```js
//子路由配置
{
  path: '/child,
  name: 'Child',
  component: Child
}
//父路由编程式传参(一般通过事件触发)
this.$router.push({
    name:'Child',
    params:{
    	id:123
    }
})
```
在子路由中可以通过this.$route.params.id来获取传递的参数值

**query 传参**

query 传参会显示参数，页面刷新传递的参数数据不会消失，可分为 声明式 和 编程式 两种方式

* 声明式 router-link：通过 router-link 组件的 to 属性实现，不过使用该方式传值的时候，需要子路由提前配置好路由别名（name 属性）

```vue
//父路由组件
<router-link :to="{name:'Child',query:{id:123}}">进入Child路由</router-link>
```
```js
//子路由配置
{
  path: '/child,
  name: 'Child',
  component: Child
}
```

* 编程式 this.$router.push：同样需要子路由提前配置好路由别名（name 属性

```js
//子路由配置
{
  path: '/child,
  name: 'Child',
  component: Child
}
//父路由编程式传参(一般通过事件触发)
this.$router.push({
    name:'Child',
    query:{
    	id:123
    }
})
```
在子路由中可以通过this.$route.query.id来获取传递的参数值

注意： 

* query 传参时name 和 path 都能用。用 path 的时候，提供的 path 值必须是相对于根路径的相对路径，而不是相对于父路由的相对路径，否则无法成功访问。

* query 传参地址栏显示参数格式为?id=0&code=1


### Vue的路由实现原理解析

vue路由分为hash路由和history路由

**hash路由**

hash 模式是一种把前端路由的路径用井号 # 拼接在真实 url 后面的模式。当井号 # 后面的路径发生变化时，浏览器并不会重新发起请求，而是会触发 onhashchange 事件。

hash特点:

* hash变化会触发网页跳转，即浏览器的前进和后退。

* hash 可以改变 url ，但是不会触发页面重新加载（hash的改变是记录在 window.history 中），即不会刷新页面。也就是说，所有页面的跳转都是在客户端进行操作。因此，这并不算是一次 http 请求，所以这种模式不利于 SEO 优化。hash 只能修改 # 后面的部分，所以只能跳转到与当前 url 同文档的 url 。

* hash 通过 window.onhashchange 的方式，来监听 hash 的改变，借此实现无刷新跳转的功能

* hash 永远不会提交到 server 端（可以理解为只在前端自生自灭）

onhashchange是window 对象中的一个事件，以下几种情况都会触发这个事件：

* 直接更改浏览器地址，在最后面增加或改变#hash；
* 通过改变location.href或location.hash的值；
* 通过触发点击带锚点的链接；
* 浏览器前进后退可能导致hash的变化，前提是两个网页地址中的hash值不同。
* hash实现SPA前端路由代码

```js
// 监听路由
 window.addEventListener('hashchange', e => {
    console.log({location: location.href,hash: location.hash})
 }, false)
```

**History模式**

history API 是 H5 提供的新特性，允许开发者直接更改前端路由，即更新浏览器 URL 地址而不重新发起请求。history对象提出了 pushState() 方法和 replaceState() 方法，这两个方法可以用来向历史栈中添加数据，就好像 url 变化了一样（过去只有 url 变化历史栈才会变化），这样就可以很好的模拟浏览历史和前进后退了，现在的history前端路由也是基于这个原理实现的

* history.pushState：pushState(stateObj, title, url) 方法向历史栈中写入数据,主要用于往历史记录堆栈顶部添加一条记录

    * stateObj ：一个与指定网址相关的状态对象,要写入的数据对象（不大于640kB)，popstate事件触发时，该对象会传入回调函数。如果不需要这个对象，此* 处可以填null。

    * title：新页面的标题，但是所有浏览器目前都忽略这个值，因此这里可以填null。

    * url：新的网址，必须与当前页面处在同一个域。浏览器的地址栏将显示这个网址。

    关于pushState，有几个值得注意的地方：

    1. pushState方法不会触发页面刷新，只是导致history对象发生变化，地址栏会有反应,只有当触发前进后退等事件（back()和forward(),go()等）时浏览器才会刷新

    2. 这里的 url 是受到同源策略限制的，防止恶意脚本模仿其他网站 url 用来欺骗用户，所以当违背同源策略时将会报错

* history.replaceState：replaceState(stateObj, title, url) 和pushState的区别就在于它不是写入而是替换修改浏览历史中当前纪录，其余和 pushState一模一样。

* popstate事件：每当同一个文档的浏览历史（即history对象）出现变化时，就会触发popstate事件.

    注意：

    * 仅仅调用pushState方法或replaceState方法 ，并不会触发popstate事件，只有用户点击浏览器倒退按钮和前进按钮，或者使用JavaScript调用back、forward、go方法时才会触发。另外，该事件只针对同一个文档，如果浏览历史的切换，导致加载不同的文档，该事件也不会触发。

    用法：

    * 使用的时候，可以为popstate事件指定回调函数。这个回调函数的参数是一个event事件对象，它的state属性指向pushState和replaceState方法为当前URL所提供的状态对象（即这两个方法的第一个参数）。

* history.state	用于存储以上方法的data数据，不同浏览器的读写权限不一样

```js
// 支持History API
 window.history.pushState({name: 'history'}, link, link);

 // 监听路由
 window.addEventListener('popstate', e => {
    console.log({location: location.href,state: e.state})
 }, false)
```

history的特点

* 新的 url 可以是与当前 url 同源的任意 url ，也可以是与当前 url 一样的地址，但是这样会导致的一个问题是，会把重复的这一次操作记录到栈当中。

* 通过 history.state ，添加任意类型的数据到记录中。

* 可以额外设置 title 属性，以便后续使用。

* 通过 pushState 、 replaceState 来实现无刷新跳转的功能。

存在问题

* 使用 history 模式时，在对当前的页面进行刷新时，此时浏览器会重新发起请求。如果 nginx 没有匹配得到当前的 url ，就会出现 404 的页面。

* 而对于 hash 模式来说， 它虽然看着是改变了 url ，但不会被包括在 http 请求中。所以，它算是被用来指导浏览器的动作，并不影响服务器端。因此，改变 hash 并没有真正地改变 url ，所以页面路径还是之前的路径， nginx 也就不会拦截。

* 在使用 history 模式时，需要通过服务端来允许地址可访问，如果没有设置，就很容易导致出现 404 的局面。

**总结**

无论是hash模式还是history模式，都是为了改变url不刷新页面，所以他们各自的方法只是改变了地址url，还得通过监听地址url的改变去渲染对应的组件页面，比如在route里配置的component.




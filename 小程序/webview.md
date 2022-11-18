### webview

Webview 是一个基于webkit的引擎，可以解析DOM 元素，展示html页面的控件，它和浏览器展示页面的原理是相同的，所以可以把它当做浏览器看待。

**使用场景**

电脑上展示html页面，通过浏览器打开页面即可浏览，而手机系统层面，如果没有webview支持，是无法展示html页面，所以webview的作用即用于手机系统来展示html界面的。所以它主要在需要在手机系统上加载html文件时被需要。

**使用webview好处**

webview是通过加载html文件来进行页面的展示，当需要更新页面布局的或者业务逻辑变更时，如果是原生的APP就需要修改前端内容，升级打包，重新发布才可以使用最新的。通过webview方式的页面则只需要修改html代码或者js文件（如果是从服务器端获取，只要新的文件部署完成），用户重新刷新就可以使用更新后的，无需通过下载安装的方式完成升级。

**由小程序跳转到别人的H5页面**

* 不需要通过点击小程序里面的按钮或者某个view，可以直接在小程序里面直接调用下面的代码即可
```html
<web-view src="https://hi.xxx.com/Tickets/html/getScanCode.html"></web-view>
```

* 需要点击小程序里面的按钮或者某个view才能调转到不同的h5页面那么你需要在pages里面新增一个页面里面写
```html
<!-- pageB/webview/webview.wxml -->
<!-- 在数据初始化化的时候先给一个默认值https://hi.xxx.com/Tickets/html/getScanCode.html -->
<!-- 在点击的时候把需要跳转的某个页面的路径写成参数传过来，在onload里面拿出来赋值就可以解决跳转到不同页面的问题啦。 -->
<web-view src="{{path}}"></web-view>
```
```js
// pageB/webview/webview.js
Page({
    data: {
        path: ''
    },
    onLoad(options) {
        this.setData({
            path: options.webview
        })
    }
})
```
```html
<!-- pageA.js -->
<view class="container">
    <button bindtap='handleClick' data-webview="https://mp.weixin.qq.com/">dianji</button>
</view>
```
```js
Page({
    data: {},
    handleClick (e) {
        let webView = e.target.dataset.webview
        wx.navigateTo({
            url: '/pageB/webview/webview?webview='+webview,
        })
    }
})
```

**从H5页面跳转到小程序**

```html
<button class="btn">跳转到小程序页面</button>

<script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
<script>
    ​$('.btn).click(
        function(){
            //这里填要调到哪个小程序页面路径})
            wx.miniProgram.navigateTo({url: '/path/share/share'})
        }
    )
</script>
​​​​​
```

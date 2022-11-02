
### Websocket

Websocket是HTML5开始提供的一种浏览器与服务器进行全双工通讯的网络技术，属于应用层协议。它基于TCP传输协议，并复用HTTP的握手通道。ws为其协议简称，wss为安全的WebSocket（即https格式的）

**优点**

* 支持双向通信，实时性更强。
* 更好的二进制支持。
* 较少的控制开销。连接创建后，ws客户端、服务端进行数据交换时，协议控制的数据包头部较小。在不包含头部的情况下，服务端到客户端的包头只有2~10字节（取决于数据包长度），客户端到服务端的的话，需要加上额外的4字节的掩码。而HTTP协议每次通信都需要携带完整的头部。
* 支持扩展。ws协议定义了扩展，用户可以扩展协议，或者实现自定义的子协议


**如何建立连接**

1. 客户端：WebSocket 采用HTTP的GET请求来进行握手，申请协议升级(首先，客户端发起协议升级请求。可以看到，采用的是标准的HTTP报文格式，且只支持GET方法。)

```js
// 报文格式
GET / HTTP/1.1
Host: localhost:8080
Origin: http://127.0.0.1:3000
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: w4v7O6xFTi36lq3RNcgctw==
```
重点请求首部意义如下：

* Connection: Upgrade：表示要升级协议
* Upgrade: websocket：表示要升级到websocket协议。
* Sec-WebSocket-Version: 13：表示websocket的版本。如果服务端不支持该版本，需要返回一个Sec-WebSocket-Versionheader，里面包含服务端支持的版本号。
* Sec-WebSocket-Key：与后面服务端响应首部的Sec-WebSocket-Accept是配套的，提供基本的防护，比如恶意的连接，或者无意的连接。

2. 服务端：响应协议升级（服务端返回内容如下，状态代码101表示协议切换。到此完成协议升级，后续的数据交互都按照新的协议来。）

```js
HTTP/1.1 101 Switching Protocols
Connection:Upgrade
Upgrade: websocket
Sec-WebSocket-Accept: Oy4NRAQ13jhfONC7bP8dTKb4PTU=
```

3. Sec-WebSocket-Accept的计算

Sec-WebSocket-Accept根据客户端请求首部的Sec-WebSocket-Key计算出来。计算公式如下：

* 将Sec-WebSocket-Key跟258EAFA5-E914-47DA-95CA-C5AB0DC85B11拼接。
* 通过SHA1计算出摘要，并转成base64字符串。

**websocket  属性:**

* webSocket.onopen：用于指定连接成功后的回调函数。
* webSocket.onmessage：用于从服务器接收到信息时的回调函数。
* webSocket.onerror：用于指定连接失败后的回调函数。
* webSocket.onclose：用于指定连接关闭后的回调函数。

**websocket  方法:**

* webSocket.close([code[, reason]]) ：关闭当前链接,

    * code: 可选,一个数字状态码，它解释了连接关闭的原因。如果没有传这个参数，默认使用 1005，抛出异常：INVALID_ACCESS_ERR，无效的 code.
    * reason 可选,一个人类可读的字符串，它解释了连接关闭的原因。这个 UTF-8 编码的字符串不能超过 123 个字节,抛出异常：SYNTAX_ERR，超出 123个字节。

* webSocket.send(data) ：发送数据到服务器。

**连接保持+心跳**

在使用websocket的过程中，有时候会遇到网络断开的情况，但是在网络断开的时候服务器端并没有触发onclose的事件。这样会有：服务器会继续向客户端发送多余的链接，并且这些数据还会丢失。所以就需要一种机制来检测客户端和服务端是否处于正常的链接状态。因此就有了websocket的心跳了。还有心跳，说明还活着，没有心跳说明已经挂掉了。

心跳机制：心跳机制是每隔一段时间会向服务器发送一个数据包，告诉服务器自己还活着，同时客户端会确认服务器端是否还活着，如果还活着的话，就会回传一个数据包给客户端来确定服务器端也还活着，否则的话，有可能是网络断开连接了。需要重连~

步骤如下：

1. 第一步页面初始化，先调用createWebSocket函数，目的是创建一个websocket的方法：new WebSocket(wsUrl);因此封装成函数内如下代码：
```js
var wsUrl = "wss://echo.websocket.org";
var ws;
var tt;
function createWebSocket() {
  try {
    ws = new WebSocket(wsUrl);
    init();
  } catch(e) {
    console.log('catch');
    reconnect(wsUrl);
  }
}
```

2.  第二步调用init方法，该方法内把一些WebSocket监听事件封装如下：
```js
function init() {
  ws.onclose = function () {
    console.log('链接关闭');
    reconnect(wsUrl);
  };
  ws.onerror = function() {
    console.log('发生异常了');
    reconnect(wsUrl);
  };
  ws.onopen = function () {
    //心跳检测重置
    heartCheck.reset().start();
  };
  ws.onmessage = function (event) {
    //拿到任何消息都说明当前连接是正常的
    console.log('接收到消息');
    heartCheck.reset().start();
  }
}
```

3. 如上第二步，当网络断开的时候，会先调用onerror，onclose事件可以监听到，会调用reconnect方法进行重连操作。正常的情况下，是先调用
onopen方法的，当接收到数据时，会被onmessage事件监听到。

4. 如果网络断开的话，会执行reconnect方法，使用了一个定时器，4秒后会重新创建一个新的websocket链接，重新调用createWebSocket函数，
重新会执行及发送数据给服务器端。
```js
var lockReconnect = false;//避免重复连接
function reconnect(url) {
  if(lockReconnect) {
    return;
  };
  lockReconnect = true;
  //没连接上会一直重连，设置延迟避免请求过多
  tt && clearTimeout(tt);
  tt = setTimeout(function () {
    createWebSocket(url);
    lockReconnect = false;
  }, 4000);
}
```

5. 最后一步就是实现心跳检测的代码
```js
//心跳检测
var heartCheck = {
  timeout: 3000,
  timeoutObj: null,
  serverTimeoutObj: null,
  reset() {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start() {
    var self = this;
    this.timeoutObj = setTimeout(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      ws.send("ping");
      self.serverTimeoutObj = setTimeout(function () {
        //如果超过一定时间还没重置，说明后端主动断开了
        ws.close();
        //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
      }, self.timeout)
    }, this.timeout)
  }
}
```
实现心跳检测的思路是：每隔一段固定的时间，向服务器端发送一个ping数据，如果在正常的情况下，服务器会返回一个pong给客户端，如果客户端通过
onmessage事件能监听到的话，说明请求正常。

这里我们使用了一个定时器，每隔3秒的情况下，如果是网络断开的情况下，在指定的时间内服务器端并没有返回心跳响应消息，因此服务器端断开了，因此这个时候我们使用ws.close关闭连接，在一段时间后(在不同的浏览器下，时间是不一样的，firefox响应更快)，
可以通过 onclose事件监听到。因此在onclose事件内，我们可以调用 reconnect事件进行重连操作。







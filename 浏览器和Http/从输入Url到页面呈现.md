### 输入url到页面呈现

* 输入url处理

当用户在地址栏中输入一个查询关键字时，地址栏会判断输入的关键字是搜索内容，还是请求的URL。如果是搜索内容，地址栏会使用浏览器默认的搜索引擎，来合成新的带搜索关键字的URL。如果判断输入内容符合URL规则，比如输入的是 time.geekbang.org，那么地址栏会根据规则，把这段内容加上协议，合成为完整的URL，如 https://time.geekbang.org。

* 访问开始

当我们按下回车开始访问时，UI 线程将借助网络线程访问站点资源. 浏览器页签的标题上会出现加载中的图标，同时网络线程会根据适当的网络协议，例如 DNS lookup 和 TLS 为这次请求建立连接。网络进程会查找本地缓存是否缓存了该资源。如果有缓存资源，那么直接返回资源给浏览器进程；如果在缓存中没有查找到资源，那么直接进入网络请求流程。

* DNS解析

DNS（Domain Name System，域名系统），因特网上作为域名和IP地址相互映射的一个分布式数据库，能够使用户更方便的访问互联网，而不用去记住能够被机器直接读取的IP数串。通过主机名，最终得到该主机名对应的IP地址的过程叫做域名解析（或主机名解析）。

请求一旦发起，浏览器首先要做的事情就是解析这个域名。

1. 浏览器会首先查看本地硬盘的 hosts 文件，看看其中有没有和这个域名对应的规则，如果有的话就直接使用 hosts 文件里面的 ip 地址。
2. 如果在本地的 hosts 文件没有能够找到对应的 ip 地址，浏览器会发出一个 DNS请求到本地DNS服务器 。本地DNS服务器一般都是你的网络接入服务器商提供，比如中国电信，中国移动。本地DNS服务器会首先查询它的缓存记录，如果缓存中有此条记录，就可以直接返回结果，此过程是递归的方式进行查询。
3. 如果没有，本地DNS服务器还要向DNS根服务器进行查询。根DNS服务器没有记录具体的域名和IP地址的对应关系，而是告诉本地DNS服务器，你可以到域服务器上去继续查询，并给出域服务器的地址。这种过程是迭代的过程。
4. 本地DNS服务器继续向域服务器发出请求，在这个例子中，请求的对象是.com域服务器。.com域服务器收到请求之后，也不会直接返回域名和IP地址的对应关系，而是告诉本地DNS服务器，你的域名的解析服务器的地址。
5. 最后，本地DNS服务器向域名的解析服务器发出请求，这时就能收到一个域名和IP地址对应关系，本地DNS服务器不仅要把IP地址返回给用户电脑，还要把这个对应关系保存在缓存中，以备下次别的用户查询时，可以直接返回结果，加快网络访问。

递归查询：当局部DNS服务器自己不能回答客户机的DNS查询时，它就需要向其他DNS服务器进行查询。局部DNS服务器自己负责向其他DNS服务器进行查询，一般是先向该域名的根域服务器查询，再由根域名服务器一级级向下查询。最后得到的查询结果返回给局部DNS服务器，再由局部DNS服务器返回给客户端。

迭代查询：当局部DNS服务器自己不能回答客户机的DNS查询时，也可以通过迭代查询的方式进行解析，局部DNS服务器不是自己向其他DNS服务器进行查询，而是把能解析该域名的其他DNS服务器的IP地址返回给客户端DNS程序，客户端DNS程序再继续向这些DNS服务器进行查询，直到得到查询结果为止。也就是说，迭代解析只是帮你找到相关的服务器而已，而不会帮你去查。比如说：baidu.com的服务器ip地址在192.168.4.5这里，你自己去查吧，本人比较忙，只能帮你到这里了。

* 建立TCP连接

拿到域名对应的IP地址之后，浏览器会以一个随机端口（1024<端口<65535）向服务器的WEB程序（常用的有httpd,nginx等）80端口发起TCP的连接请求。通过三次握手进行TCP/IP连接。

* 发送http请求

建立好TCP连接后，浏览器端会构建请求行、请求头等信息，并把和该域名相关的Cookie等数据附加到请求头中，然后向服务器发送构建的请求信息。服务器接收到请求信息后，会根据请求信息生成响应数据（包括响应行、响应头和响应体等信息），并发给网络进程。等网络进程接收了响应行和响应头之后，就开始解析响应头的内容了。

* 解析响应数据

重定向

在接收到服务器返回的响应头后，网络进程开始解析响应头，如果发现返回的状态码是301或者302，那么说明服务器需要浏览器重定向到其他URL。这时网络进程会从响应头的Location字段里面读取重定向的地址，然后再发起新的HTTP或者HTTPS请求，一切又重头开始了。

不用重定向

根据响应字段Content-Type区分服务器返回的响应体数据是什么类型。不同Content-Type的后续处理流程也截然不同。如果Content-Type字段的值被浏览器判断为下载类型，那么该请求会被提交给浏览器的下载管理器，同时该URL请求的导航流程就此结束。但如果是HTML，那么浏览器则会继续进行导航流程。由于Chrome的页面渲染是运行在渲染进程中的，所以接下来就需要准备渲染进程了。

* 渲染进程渲染页面

默认情况下，Chrome会为每个页面分配一个渲染进程，也就是说，每打开一个新页面就会配套创建一个新的渲染进程。每个标签对应一个渲染进程。但如果从一个页面打开了另一个新页面，而新页面和当前页面属于同一站点（根域名（例如，geekbang.org）加上协议（例如，https:// 或者http://），还包含了该根域名下的所有子域名和不同的端口相同）的话，那么新页面会复用父页面的渲染进程。官方把这个默认策略叫process-per-site-instance。渲染进程准备好之后，还不能立即进入文档解析状态，因为此时的文档数据还在网络进程中，并没有提交给渲染进程，所以下一步就进入了提交响应数据

* 提交响应数据到渲染进程

“提交响应数据”的消息是由浏览器进程发出的，渲染进程接收到“提交响应数据”的消息后，会和网络进程建立传输数据的“管道”，响应数据就会通过这个管道输入到渲染进程，一边传输一边解析。等响应体数据传输完成之后，渲染进程会返回“确认提交”的消息给浏览器进程。浏览器进程在收到“确认提交”的消息后，会更新浏览器界面状态，包括了安全状态、地址栏的URL、前进后退的历史状态，并更新Web页面。

[详情](https://blog.poetries.top/browser-working-principle/guide/part1/lesson04.html#%E4%BB%8E%E8%BE%93%E5%85%A5url%E5%88%B0%E9%A1%B5%E9%9D%A2%E5%B1%95%E7%A4%BA)
。








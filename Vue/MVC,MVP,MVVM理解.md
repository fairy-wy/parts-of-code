### MVC

MVC全名是Model View Controller，是模型(model)－视图(view)－控制器(controller)的缩写，一种软件设计典范，用一种业务逻辑、数据、界面显示分离的方法组织代码，将业务逻辑聚集到一个部件里面，在改进和个性化定制界面及用户交互的同时，不需要重新编写业务逻辑。MVC 是一种使用 MVC（Model View Controller 模型-视图-控制器）设计创建 Web 应用程序的模式：

* Model（模型）：即数据层, 数据模型及其业务逻辑，是针对业务模型建立的数据结构，Model与View无关，而与业务有关。

* View（视图） ：即界面(UI)层, 显示来源于Model的数据，用于与用户实现交互的页面，通常实现数据的输入和输出功能。

* Controller（控制器）：逻辑层，是应用程序中处理用户交互的部分。用于连接Model层和View层，完成Model层和View层的交互。还可以处理页面业务逻辑，它接收并处理来自用户的请求，并将Model返回给用户。

![框架图](https://img-blog.csdnimg.cn/e10429b206fc41589482ff5e7f802d6b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA6Z2e5pep6LW36YCJ5omL,size_15,color_FFFFFF,t_70,g_se,x_16)

通信方式:

通过 View 接受指令

![](https://s2.51cto.com/images/blog/202108/08/818b447660910e384d04ebbc5a0f5203.png?x-oss-process=image/watermark,size_16,text_QDUxQ1RP5Y2a5a6i,color_FFFFFF,t_30,g_se,x_10,y_10,shadow_20,type_ZmFuZ3poZW5naGVpdGk=/format,webp/resize,m_fixed,w_750)

通过controller接受指令

![](https://s2.51cto.com/images/blog/202108/08/b6342be5cf4823254693de685b679db5.png?x-oss-process=image/watermark,size_16,text_QDUxQ1RP5Y2a5a6i,color_FFFFFF,t_30,g_se,x_10,y_10,shadow_20,type_ZmFuZ3poZW5naGVpdGk=/format,webp/resize,m_fixed,w_750)

**MVC流程**

1. View接收用户的交互请求
2. View将请求转交给Controller进行处理
3. Controller根据交互事件的不同，或者调用Model的接口进行数据操作，或者进行View跳转
4. Model数据更新后不通过Controller，而是直接通过View
5. View通常采用观察者Observe模式直接监听到Model数据的变化

**MVC所有的通信都是单向的**


### MVP
MVP是把MVC中的Controller换成了Presenter（呈现），目的就是为了完全切断View跟Model之间的联系，由Presenter充当桥梁，做到View-Model之间通信的完全隔离方向。

Presenter（逻辑层）：，从Activity中抽离出功能逻辑，简化Activity的代码。

![框架图](https://img.php.cn/upload/image/945/265/658/1555381195439478.png)

**MVP流程**

1. View接收用户的交互请求
2. View将请求转交给Presenter进行处理
3. Presenter通知书Model进行数据操作
4. Model数据更新首先通知Presenter
5. Presenter接收到Model数据变更后去更新View，一个Presenter只对应一个View

**View 与 Model 不发生联系，都通过 Presenter 传递。所有逻辑都部署在Presenter那里**


### MVVM
MVVM 模式将 Presenter 改名为 ViewModel，基本上与 MVP 模式完全一致。如果说MVP是对MVC的进一步改进，那么MVVM则是思想的完全变革。它是将“数据模型数据双向绑定”的思想作为核心，因此在View和Model之间没有联系，通过ViewModel进行交互，而且Model和ViewModel之间的交互是双向的，因此视图的数据的变化会同时修改数据源，而数据源数据的变化也会立即反应到View上。

ViewModel： 注意这里的“Model”指的是View的Model，跟上面那个Model不是一回事。所谓View的Model就是包含View的一些数据属性和操作，这种模式的关键技术就是双向数据绑定（data binding），View的变化会直接影响ViewModel，ViewModel的变化或者内容也会直接体现在View上

![框架图](https://img.php.cn/upload/image/249/527/136/1555381257950820.png)

**MVVM流程**

MVVM采用双向数据绑定，当View中数据变化时将自动反映到ViewModel上，反之，Model中数据变化会通知ViewModel，同事也将会自动放映到页面上View。把Model和View关联起来的就是ViewModel。ViewModel负责把Model的数据同步到View显示出来，还负责把View的修改同步回Model。

**View 与 Model 不发生联系**











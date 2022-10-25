
### Webpack构建流程

#### webpack
本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

#### 构建流程

**1. 初始化**

* 初始化参数：通过optimist将用户配置的webpack.cofig.js配置文件里的参数和shell脚本的参数以键值对的形式把参数对象保存在 optimist.argv 

* 插件加载：把配置文件ebpack.cofig.js的配置项拷贝到options对象中，然后加载配置在plugins里的插件


**2. 编译和构建流程**

* 利用初始化的参数创建webpack实例complier，执行complier.run()方法开始编译和构建

* 触发complier.compile()开始编译 ，创建compilation对象负责组织整个打包过程（包含了每个构建环节及输出环节所对应的方法）以及存放着所有当前编译环境的所有资源，包括编译后的资源（module ，chunk，生成的 asset 以及用来生成最后打包文件的 template 的信息）

* 执行complier.make()方法，通过options对象的entry的字段找到入口文件，然后利用配置中的loader解析入口文件，使用acorn将loader 处理后的文件转化为AST树。通过解析后的入口文件找出其依赖的其他模块以及依赖模块的依赖文件，进行递归异步的处理所有的依赖项。
        

**3. 输出流程**

* 得到所有模块的依赖关系和模块翻译之后的文件后，调用complier.seal()方法，对这些模块和模块之间的依赖关系创建一个个包含多个模块chunk，并对创建出的chunk进行整理（所有资源进行合并、拆分等操作），生成编译后的源码。

* 调用complier.emit()方法，将每个chunk转换成一个单独的文件加入到输出列表中，然后根据配置信息中的output配置进行最后模块文件的输出，指定输出文件名和文件路径。


![图解构建流程](https://img-blog.csdnimg.cn/6b5512f0c772476081a29bbcf0ed6bc2.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5pm65oWnMjAyMQ==,size_20,color_FFFFFF,t_70,g_se,x_16)





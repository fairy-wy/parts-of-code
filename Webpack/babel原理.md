### ![Babel](https://blog.csdn.net/qiwoo_weekly/article/details/114909047)

Babel 是一个 JavaScript 编译器。他把最新版的javascript编译成当下可以执行的版本，简言之，利用babel就可以让我们在当前的项目中随意的使用这些新最新的es6，甚至es7的语法。

**babel原理**

* 解析成AST

  1. 词法分析：词法分析阶段可以看成是对代码进行“分词”，它接收一段源代码，然后执行一段 tokenize 函数（把一句完整的代码拆成一个个独立个体，并把这一个个独立个体以对象形式存入Token数组），把代码分割成被称为Tokens 的东西。Tokens 是一个数组，由一些代码的碎片组成，比如数字、标点符号、运算符号等等等等

```js
[
    { "type": "Keyword", "value": "const" },
    { "type": "Identifier", "value": "add" },
    { "type": "Punctuator", "value": "=" },
    { "type": "Punctuator", "value": "(" },
    { "type": "Identifier", "value": "a" },
    { "type": "Punctuator", "value": "," },
    { "type": "Identifier", "value": "b" },
    { "type": "Punctuator", "value": ")" },
    { "type": "Punctuator", "value": "=>" },
    { "type": "Identifier", "value": "a" },
    { "type": "Punctuator", "value": "+" },
    { "type": "Identifier", "value": "b" }
]
```
  2. 语法分析：语法分析阶段会把一个token转换成 AST 的形式。这个阶段会使用token的信息把它们转换成一个 AST 的表述结构，这样更易于后续的操作。

* Transform(转换)：接收上一步生成的 AST 并对其进行深度优先遍历，在遍历过程中，Babel 会维护一个称作 Visitor 的对象，这个对象定义了用于 AST 中获取具体节点的方法。匹配获取到节点后，在此过程中对节点进行添加、更新及移除等操作。这是 Babel 或是其他编译器中最复杂的过程。Babel提供了@babel/traverse(遍历)方法维护这AST树的整体状态，并且可完成对其的替换，删除或者增加节点，这个方法的参数为原始AST和自定义的转换规则，返回结果为转换后的AST。

* Generate(代码生成)：

  1. 代码生成步骤把最终（经过一系列转换之后）的 AST 转换成字符串形式的代码，同时还会创建源码映射（source maps）。

  2. 代码生成其实很简单：深度优先遍历整个 AST，然后构建可以表示转换后代码的字符串。

  3. Babel使用 @babel/generator 将修改后的 AST 转换成代码，生成过程可以对是否压缩以及是否删除注释等进行配置，并且支持 sourceMap。


**相关插件**

* babel-core：babel-core是Babel的核心包,里面存放着诸多核心API,其中有个transform（用于字符串转码得到AST ）。
```js
import babel from 'babel-core';
/*
 * @param {string} code 要转译的代码字符串
 * @param {object} options 可选，配置项
 * @return {object}
*/
babel.transform(code:String,options?: Object)
//返回一个对象(主要包括三个部分)：
{
    generated code, //生成码
    sources map, //源映射
    AST  //即abstract syntax tree，抽象语法树
}
```

* babel-types：Babel Types模块是一个用于 AST 节点的 Lodash 式工具库（Lodash 是一个 JavaScript 函数工具库，提供了基于函数式编程风格的众多工具函数）， 它包含了构造、验证以及变换 AST 节点的方法。对编写处理AST逻辑非常有用。
```js
// 安装
// npm install babel-types -D;  
import traverse from "babel-traverse";
import * as t from "babel-types";
traverse(ast, {
  enter(path) {
    if (t.isIdentifier(path.node, { name: "n" })) {
      path.node.name = "x";
    }
  }
});
```

* Visitors (访问者)：访问者是一个用于 AST 遍历的跨语言的模式。简单的说它们就是一个对象，定义了用于在一个树状结构中获取具体节点的方法。
```js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};
// 你也可以先创建一个访问者对象，并在稍后给它添加方法。
let visitor = {};
visitor.MemberExpression = function() {};
visitor.FunctionDeclaration = function() {}
```

* Babel插件规则：Babel的插件模块需要我们暴露一个function,function内返回visitor对象。
```js
//函数参数接受整个Babel对象,这里将它进行解构获取babel-types模块,用来操作AST。
module.exports = function({types:t}){
    return {
        visitor:{
        }
    }
```

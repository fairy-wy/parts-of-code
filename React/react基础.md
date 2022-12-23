
### react

用于构建用户界面（视图）的js库。react是一个将数据渲染为html视图的js库

特点：

1. 采用组件化模式，声明式编码，提高开发效率及组件复用率
2. 在react native中使用react语法进行移动端开发
3. 使用虚拟dom以及diff算法，减少与真实dom的交互

### JSX

JSX（JavaScript xml），是一个 JavaScript 的语法扩展.

本质：本质是React.createElement(component, props, ...children)方法(ract中创建虚拟的方法)的语法糖

作用：用于在react中简化创建虚拟DOM

jsx语法规则：

* 定义虚拟dom时，不要写引号
* 标签中混入js表达式时要用{}包裹
* 样式的类名不要用class,要用className
* 内联样式，要用style={{key:value;}}的形式，其实就是{}中包裹的样式对象
* 只能有一个根标签
* 标签必须闭合
* 标签首字符
    * 若小写字母开头，则在渲染时将该标签转为html同名元素，若html无同名元素，则报错
    * 若大写字母开头，react就会当成组件去渲染对应组件，若组件没有定义，则报错

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
<!-- 引入react核心库 -->
<script type="text/javascript" src="../js/react.development.js"></script>
<!-- 引入react-dom，用于支持react操作dom -->
<script type="text/javascript" src="../js/react-dom.development.js"></script>
<!-- 引入babel,用于将jsx转化为js -->
<script type="text/javascript" src="../js/babel.min.js"></script>

<script type="text/babel">
    const name = 'Josh Perez';
    const element = (
        <div>
            <h1 className="title" style="{{color: red}}">Hello, {name}</h1>;
        </div>
    )

    // 通过ReactDOM的render方法通过babel编译将jsx语法转化成React.createElement()这种形式，生成虚拟dom，
    // 虚拟dom通过render方法将虚拟dom转化生成对应生成真实dom，最后渲染到页面。
    ReactDOM.render(
    element,
    document.getElementById('root') // reac没有提供选择器语法，所以需要通过原生 document放低获取容器
    );
</script>
```

**组件**

组件定义：函数式定义组件和类式定义组件

* 函数式组件
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
<!-- 引入react核心库 -->
<script type="text/javascript" src="../js/react.development.js"></script>
<!-- 引入react-dom，用于支持react操作dom -->
<script type="text/javascript" src="../js/react-dom.development.js"></script>
<!-- 引入babel,用于将jsx转化为js -->
<script type="text/javascript" src="../js/babel.min.js"></script>

<script type="text/babel">
    // 创建函数式组件
    function MyComponent () {
        console.log(this)  //  undefined  因为babel编译后开启了严格模式。严格模式中不允许函数里的this指向window
        return <h1>我是函数式组件</h1>;
    }
    // 渲染组件到页面
    ReactDOM.render(<MyComponent />, document.getElementById('root'));
    // 执行ReactDOM.render( <MyComponent />,document.getElementById('root')）....之后发生了什么
    //     1. React解析组件标签，找到了MyComponent组件
    //     2. 发现组件是函数式定义的，随后调用该函数，将返回的虚拟dom转为真实dom,最后呈现到页面中
</script>
```
* 类式组件
```html
<script type="text/babel">
    // 创建类式组件。  必须继承React.Component组件
    class MyComponent extends React.Component {
        // render放在类的原型对象上，供实例使用
        render () {
            // this指向类的实例对象，或者说类组件的实例对象
            console.log(this)
            return <h1>我是类式组件</h1>;
        }
    }
    ReactDOM.render(<MyComponent />, document.getElementById('root'));
    // 执行ReactDOM.render( <MyComponent />,document.getElementById('root')）....之后发生了什么
    //     1. React解析组件标签，找到了MyComponent组件
    //     2. 发现组件是类定义的，随后React帮你new出来该类的实例，并通过该实例调用到原型上的render方法
    //     3. 将render返回的虚拟dom转化为真实dom，随后呈现到页面中
</script>
```

组件分类： 简单组件和有状态组件（复杂组件）

* 简单组件：React 组件使用一个名为 render() 的方法，接收输入的数据并返回需要展示的内容.。被传入的数据可在组件中通过 this.props 在 render() 访问。
```js
class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="Taylor" />,
  document.getElementById('hello-example')
);
```

* 复杂组件：除了使用外部数据（通过 this.props 访问）以外，组件还可以维护其内部的状态数据（通过 this.state 访问）。当组件的状态数据改变时，组件会再次调用 render() 方法重新渲染对应的标记。
```js
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }
  render() {
    return (
      <div>
        Seconds: {this.state.seconds}
      </div>
    );
  }
}

ReactDOM.render(
  <Timer />,
  document.getElementById('timer-example')
);
```

**事件绑定**

事件处理

* 通过onXXX属性
    * react使用事件委托方式处理事件 ===> 为了高效
    * react使用自定义合成的js事件，不是原生的dom事件
* 通过event.target获取当前元素

react内部做了设计，将js事件做了调整，在react事件绑定以小驼峰命名
```html
<script type="text/babel">
    // 创建类式组件。  必须继承React.Component组件
    class Weather extends React.Component {
        // 借助构造器初始化组件状态及解决事件中this指向问题 ==>  构造器初始化时调用一次
        constructor(props) {
            super(props);  // 继承react的内部的父类的属性
            // 组件的状态管理， 初始化状态
            this.state = {isHot: true};
            // 解决类中绑定的方法this指向  ===> 将类中方法changeWeather在原型对象上拿到，
            // 通过bind改变方法的this指向，bind返回一个新的方法，然后挂载在类的实例对象自身
            this.changeWeather = this.changeWeather.bind(this)
        }
        // render放在类的原型对象上，供实例使用 ===> render函数调用1 + n次，1是初始化那次，n是状态更新的次数
        render () {
            // this指向类的实例对象，或者说类组件的实例对象
            console.log(this)
            return <h1 onClick={this.changeWeather}>今天的天气很{this.state.isHot ? '炎热' : '凉爽'}</h1>;
        }
        changeWeather () {
            // changeWeather放在类的原型对象上，通过实例调用
            // 由于changeWeather是作为onClick的回调函数，所以不是他通过实例调用的，是直接调用
            // 类中的方法默认开启严格模式，所以changeWeather中的this不能指向window,为undefined
            console.log(this)
        }
    }
    // 渲染组件到页面
    ReactDOM.render(<MyComponent />, document.getElementById('root'));
</script>
```

**state**

state是组件对象中核心的属性，值是对象（包含多个key-value组合）。state中的值可以修改，唯一的修改方法是调用this.setState,每次修改后，会自动调用this.render方法，再次渲染组件。
```html
<script type="text/babel">
    // 创建类式组件。  必须继承React.Component组件
    class Weather extends React.Component {
        // 借助构造器初始化组件状态
        constructor(props) {
            super(props);  // 继承react的内部的父类的属性
            // 组件的状态管理， 初始化状态
            this.state = {isHot: true};
            this.changeWeather = this.changeWeather.bind(this)
        }
        // render放在类的原型对象上，供实例使用
        render () {
            // this指向类的实例对象，或者说类组件的实例对象
            console.log(this)
            return <h1 onClick={this.changeWeather}>今天的天气很{this.state.isHot ? '炎热' : '凉爽'}</h1>;
        }
        changeWeather () {
            const isHot = this.state.isHot
            // react修改状态state不可直接更改，需要用react内置API setState去更新，且更新是合并
            this.setState = ({
                isHot: !isHot
            })
        }
    }
    // 渲染组件到页面
    ReactDOM.render(<MyComponent />, document.getElementById('root'));
</script>
```
简化版本
```html
<script type="text/babel">
    // 创建类式组件。  必须继承React.Component组件
    class Weather extends React.Component {
        // 初始化状态
        // 往类的实例对象增加属性的一种方式，此种方式定义的属性或者方法是直接挂载在类的实例对象自身上
        // 且new出来的每个实例对象都会有该属性或者方法
        state = {isHot: true};
        // render放在类的原型对象上，供实例使用
        render () {
            // this指向类的实例对象，或者说类组件的实例对象
            console.log(this)
            return <h1 onClick={this.changeWeather}>今天的天气很{this.state.isHot ? '炎热' : '凉爽'}</h1>;
        }
        // 自定义方法 => 写为赋值语句（将该方法直接挂载在实例对象上） + 箭头函数
        // 箭头函数（箭头函数本身不存在this对象，箭头函数的this指向上一层的this）
        changeWeather = ()=> {
            const isHot = this.state.isHot
            // react修改状态state不可直接更改，需要用react内置API setState去更新，且更新是合并
            this.setState = ({
                isHot: !isHot
            })
        }
    }
    // 渲染组件到页面
    ReactDOM.render(<MyComponent />, document.getElementById('root'));
</script>
```

**props**

组件外部通过peops向组件内部传值.props是只读的
```html
<script type="text/javascript" src="../js/prop-types.js"></script>

<script type="text/babel">
class HelloMessage extends React.Component {
//   构造器是否接收props,是否传递给super，取决于是否希望在构造器中通过this访问props
  construction (props) {
      super(props)
      console.log('construction', this.props)
  }
  // 对类本身组件标签属性进行类型，必要性限制
  static propTypes = {
    name:PropTypes.string.isReauired,  //  必填且为string类型
    age: PropTypes.number // number类型
  }
    // 对类本身组件标签属性进行默认值
  static defaultProps = {
    age: 18
  }
  render() {
    console.log(this.props) //  {name: 'Taylor', age: 18}
    return (
      <div>Hello {this.props.name}</div>
    );
  }
}
ReactDOM.render(
  <HelloMessage name="Taylor" age="18"/>,
  document.getElementById('hello-example')
);
// const p= {name: 'tom', age: 20}
// ReactDOM.render(
//   <HelloMessage {...p}/>,  //通过{...p}批量传递props属性，
//   document.getElementById('hello-example')
// );
</script>
```
函数式组件使用props
```html
<script type="text/babel">
    // 创建函数式组件
    function MyComponent (props) {
        console.log(props) // {name: 'tom', age: 18}
        const {name, age} = props
        return <h1>我是{name}, 今年{age}岁</h1>;
    }
    // 渲染组件到页面
    ReactDOM.render(<MyComponent name="tom" age={18} />, document.getElementById('root'));
</script>
```

**refs**

* 字符串形式的refs (已过时，存在效率问题)
* 回调函数形式的refs（如果ref以内联函数定义，更新过程中会被执行两次，第一次传入null（为了清空初始化最初的旧的函数）,第二次才是当前的元素节点）
```html
<script type="text/babel">
class MyComponent extends React.Component {
    render () {
        // 内联形式
        // return (
        //     <fiv>
        //         <input ref={(event) =>{this.input1 = event}}/>
        //         <button inClick={this.handleClick}>按钮</button>
        //     </div>
        // )
        // 非内联形式  解决内联形式更新会执行两次的问题
        return (
            <fiv>
                <input ref={this.inputRef}/>
                <button inClick={this.handleClick}>按钮</button>
            </div>
        )
    }
    inputRef = (event) =>{
        this.input1 = event
    }
    handleClick = () => {
        console.log(this.input1.value)  // 输入框中输入啥就输出啥
    }
}
// 渲染组件到页面
ReactDOM.render(<MyComponent name="tom" age={18} />, document.getElementById('root'));
</script>
```
* 通过createRef
```html
<script type="text/babel">
class MyComponent extends React.Component {
    // React.createRef调用后可以返回一个容器，该容器可以存储呗ref所标识的节点,使用一个创建一个
    myRef = React.createRef()
    render () {
        return (
            <fiv>
                <input ref={this.myRef}/>
                <button inClick={this.handleClick}>按钮</button>
            </div>
        )
    }
    handleClick = () => {
        console.log(this.myRef.current.value)  // 输入框中输入啥就输出啥
    }
}
// 渲染组件到页面
ReactDOM.render(<MyComponent name="tom" age={18} />, document.getElementById('root'));
</script>
```










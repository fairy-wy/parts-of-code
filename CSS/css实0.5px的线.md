### 用css画出0.5px的线

**box-shadow阴影实现**

border不能设置小数的边框，我们可以用box-shadow属性用阴影达到0.5px的边框效果，box-shadow阴影属性是允许小数值的，我们可以用它达到单条边框和四条边框。
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
    <div class="line">test</div>
</body>
</html>
<style>
    .line {
        box-sizing: border-box;
        width: 200px;
        height: 200px;
        margin: 100px auto;
        box-shadow: 0px 0px 0px 0.5px green;
    }
</style>
```

**transform 缩放实现的理解**

直接设置伪类元素，设置指定的高度，通过定位来控制位置
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
    <div class="line">test</div>
</body>
</html>
<style>
   .line {
        position: relative;
        box-sizing: border-box;
        width: 200px;
        height: 200px;
        margin-top: 10px;
    }

    .line::after {
        position: absolute;
        content: "";
        width: 200%;
        height: 200%;
        border: 1px solid red;
        transform-origin: 0 0;
        transform: scale(0.5);
    }
</style>
```

**border-image: linear-gradient 边框线性渐变的思路**

同样设置任意大小的边框，通过渐变属性改变一部分边框的颜色效果，比如将一部分边框融入背景，这样就能得到想要的效果。

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
    <div class="line">test</div>
</body>
</html>
<style>
   .line {
        position: relative;
        box-sizing: border-box;
        background-color: blueviolet;
        width: 200px;
        height: 200px;
        margin-top: 10px;
    }

    .line::after {
        display: block;
        position: absolute;
        content: "";
        width: 100%;
        height: 1px;
        bottom: 0px;
        background-color: red;
        background: linear-gradient(to bottom, transparent 50%, red 50%)
    }
```


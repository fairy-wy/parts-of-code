### for本身
for 循环是出现最早，也是应用最普遍的一个遍历，能够满足绝大多数的遍历。可以遍历 数组、对象、字符串

```js
// 遍历数组
let arr = [1,2,3,4,5]
for(var i=0;i<arr.length;i++) {
    console.log(arr[i])
}
// 1 2 3 4 5
```
```js
// 遍历对象
var obj = {
    name: 'tom',
    age: 18
}
let keys = Object.keys(obj)
for(var i=0;i<keys.length;i++) {
    console.log(keys[i] + ':' + obj[keys[i]])
}
// name:tom
// age:18
```

### forEach



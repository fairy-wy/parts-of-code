// 浅拷贝
// 1.Object.assign(一维对象深拷贝，其他浅拷贝)
let target = {a: 1};
let object2 = {b: 2};
let object3 = {c: 3};
Object.assign(target,object2,object3);  
console.log(target);  // {a: 1, b: 2, c: 3}

// 2.扩展运算符
let obj1 = {a:1,b:{c:1}}
let obj2 = {...obj1};
obj1.a = 2;
console.log(obj1); //{a:2,b:{c:1}}
console.log(obj2); //{a:1,b:{c:1}}
obj1.b.c = 2;
console.log(obj1); //{a:2,b:{c:2}}
console.log(obj2); //{a:1,b:{c:2}}

// 手写浅拷贝
function shallowCopy(object) {
    // 只拷贝对象
    if (!object || typeof object !== "object") return;
  
    // 根据 object 的类型判断是新建一个数组还是对象
    let newObject = Array.isArray(object) ? [] : {};
  
    // 遍历 object，并且判断是 object 的属性才拷贝
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        newObject[key] = object[key];
      }
    }
  
    return newObject;
}



// 深拷贝
// 简易版本
function deepClone (obj) {
    if (!obj || typeof obj !== "object") return;
    let newObj = Array.isArray(obj) ? [] : {}

    for(let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key]  === 'object') {
                newObj[key] = deepClone(obj[key])
            } else {
                newObj[key] = obj[key]
            }
        }
    }
    return newObj

}

// 改良版本深拷贝
const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null)
const deepClone = function (obj, hash = new WeakMap()) {
  if (obj.constructor === Date) {
    return new Date(obj)       // 日期对象直接返回一个新的日期对象
  }
  
  if (obj.constructor === RegExp){
    return new RegExp(obj)     //正则对象直接返回一个新的正则对象
  }
  
  //如果循环引用了就用 weakMap 来解决
  if (hash.has(obj)) {
    return hash.get(obj)
  }
  let allDesc = Object.getOwnPropertyDescriptors(obj)

  //遍历传入参数所有键的特性
  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)

  //继承原型链
  hash.set(obj, cloneObj)

  for (let key of Reflect.ownKeys(obj)) { 
    cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key]
  }
  return cloneObj
}

// 完整版本优化：http://events.jianshu.io/p/b8518f40564a
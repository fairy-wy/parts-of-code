// instanceof 运算符用于判断构造函数的 prototype 属性是否出现在对象的原型链中的任何位置。
function instance_of(left, right) {
    if(typeof left !== 'object' || left === null) {
        return false
    } else {
        while(true) {
            if(left.__proto__ == null) {
                return false
            }
            if(left.__proto__ === right.prototype) {
                return true
            }
            left = left.__proto__
        }
        return false
    }

}



// typeof
function getType(value) {
    if (value === null) {
        return 'object'
    }
    let str = Object.prototype.toString.call(value)
    let type = str.slice(1, str.length -1).split(' ')[1]
    console.log(type)
    switch (type) {
        case 'Number':
        case 'String':
        case 'Undefined':
        case 'Boolean':
        case 'Symbol':
        case 'Function':
            return type.toLowerCase()
            break
        default:
            return 'object'
            break
    }
} 


// indexOf手写
function IndexOf (str, target) {
    let len = target.length
    let length = str.length
    let index = -1
    if(len>length) {
        return index
    }
    for (var i=0;i<(length - len);i++) {
        let temp = str.slice(i, i + len)
        if(temp === target) {
           index = i
        //    找到就结束循环
           break
        } 
    }
    return index
}


// 手写类型判断函数
function getType(value) {
    if (value === null) {
        return value + ''
    }
    if (typeof value === 'object') {
        let str = Object.prototype.toString.call(value)
        let type = str.slice(1, str.length -1).split(' ')[1]
        return type
    } else {
        return typeof value
    }
}  



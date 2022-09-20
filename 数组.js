// 数组方法
// map
function map (arr,fn) {
    if(!Array.isArray(arr) || arr.length==0 || typeof fn !=='function') {
        return []
    }else {
        let result = []
        for(var i=0;i<arr.length;i++) {
            // 对每个元素执行传入的方法然后将结果返回
            result.push(fn(arr[i]))
        }
        return result
    }
}

// filter
function filter(arr, callback) {
    if(!Array.isArray(arr) || arr.length==0 || typeof fn !=='function') {
        return []
    }else {
        let result = []
        for(var i=0;i<arr.length;i++) {\
            // 对数组元素进行检查。符合回调函数的则放入结果集中返回
            if(callback(arr[i])) {
                result.push(arr[i])
            }
        }
        return result
    }
}

// reduce
function reduce (fn, initValue) {
    // 结果
    let result = ''
    let startIndex
    // 获取调用reduce方法的数组
    let arr = Array.prototype.slice.call(this)
    // 看是否有初始值
    result = initValue ? initValue : arr[0]
    // 是否有初始值  有则从数组第一项开始，没有则冲数组第二项开始
    startIndex = initValue ? 0 : 1

    for (var i=startIndex;i<arr.length;i++) {
        result = fn.call(null, result, arr[i], i, this)
    }
    return result
}

// push方法
function push () {
    for (let i=0;i<arguments.length;i++) {
        this[this.length] = arguments[i] ;
    }
    return this.length;
}


// 数组扁平化
// 1.使用 reduce
function flatter (arr) {
   return arr.reduce(function (prev, curr) {
      return prev.concat(Array.isArray(curr)?flatter(curr):curr)
    }, [])
}

// 2.利用toString()
function flatter(qrr) {
   return  arr.toString().split(',').map(item => {
        return Number(item)
    })
}

// 3.递归遍历
function flatter (arr) {
    let result = []
    arr.forEach(item => {
        if(Array.isArray(item)) {
            result = result.concat(flatter(item))
        } else {
            result.push(item)
        }
    });
}
var arr = [1,2, [3,4,[5,6]],7]
flatter(arr)


// 数组去重
// 1.利用Set
function noRepeat (arr) {
    let set = new Set(arr)
    return [...set]
}

// 2.循环去重
function noRepeat (arr) {
    let obj = {}
    let newArr = []
    for(var i=0;i<arr.length;i++) {
        if(!obj[arr[i]]) {
            obj[arr[i]] = 1
            newArr.push(arr[i])
        }
    }
    return newArr
}


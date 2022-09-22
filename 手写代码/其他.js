// 函数柯里化封装
function createCurry(func, args) {
    // 获取函数有几个参数
    var arity = func.length;   
    var args = args || [];

    return function() {
        var _args = [].slice.call(arguments);
        [].push.apply(_args, args);

        // 如果参数个数小于最初的func.length，则递归调用，继续收集参数
        if (_args.length < arity) {
            return createCurry.call(this, func, _args);
        }

        // 参数收集完毕，则执行func
        return func.apply(this, _args);
    }
}

// 将url地址中的参数变为键值对
var url = '?p1=a&p2=b'
function urlParse (urk) {
    let str = url.slice(url.indexOf('?')+ 1)
    let arr = str.split('&')
    let obj = {}
    arr.map(item => {
        obj[item.split('=')[0]] = item.split('=')[1]
    })
    return obj
}

// 驼峰转换
const cssStyle2DomStyle = function (str) {
    let arr = str.split('-')
    let result = arr.reduce((pre,curr) => {
        if(curr!='') {
            pre += curr[0].toUpperCase() + curr.slice(1)
        }
    })
    return result[0].toLowerCase() + result.slice(1)
}

// 计算字符串里相同的字母重复次数
const count = function (str) {
    if(str=='') return
    let obj = {}
    for (let key of Object.values(str)) {
        if(obj[key]) {
            obj[key] = obj[key] + 1
        } else {
            obj[key] = 1
        }
    }
    return pbj
}
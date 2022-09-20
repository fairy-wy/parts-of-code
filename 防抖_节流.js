// 防抖函数
// 函数防抖是指在事件被触发 n 秒后再执行回调，如果在这 n 秒内事件又被触发，则重新计时。这可以使用在一些点击请求的事件上，避免因为用户的多次点击向后端发送多次请求
function debounce (fn, wait, immediate){
    let timeout = null
    return function () {
        // 当前调用函数的
        let context = this
        // 清除定时器，重新计时
        clearTimeout(timeout)
        // 是否立即执行
        if (immediate) {
            let callNow = !timeout
             // 马上执行函数后，wait秒内不触发事件才能再次执行
             timeout = setTimeout(() => {
                timeout = null
            }, wait);
            if (callNow) {
                fn.apply(context, arguments)
            }
        } else {
            // 非立即执行函数，触发后wait秒后才执行函数
            timeout = setTimeout(() => {
                fn.apply(context, arguments)
            }, wait)
        }
    }
}


// 节流函数
// 函数节流是指规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，如果在同一个单位时间内某事件被触发多次，只有一次能生效。
// 时间戳版
function throttle1 (fu, wait) {
    let prev = 0
    return function () {
        const ccontext = this
        const now = Date.now()
        if(now - prev > wait) {
            fn.apply(context, arguments)
            prev = now
        }
    }
}
// 定时器版本
function throttle2(fn, wait) {
    let timeout = null
    return function () {
        const args = arguments
        const context = this
        if(!timeout){
            timeout = setTimeout(()=>{
                timeout = null
                fn.call(context,args)
            },wait)
        }
    }
}
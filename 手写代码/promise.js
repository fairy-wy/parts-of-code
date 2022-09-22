class myPromise {
    static PENDING = 'pending'
    static FULFILLED = 'fulfilled'
    static REJECTED = 'rejected'
    constructor(executor) {
         // 参数不是函数校验
        if(typeof executor != 'function') {
            throw new TypeError(`Promise resolver ${executor} is not a function`)
        }
        // 初始化值
        this.value= null  //终止
        this.reason = null  //失败原因
        this.state = 'pending'  //状态
        this.fulfilledCallback = []  //成功回调数组
        this.rejectedCallback = []  //失败回调数组
        // promise参数executor的参数的resolve和reject函数
        const resolve = (value) => {
            // 成功后的操作(状态的改变，成功回调的执行)
            if(this.state == 'pending') {
                this.state = FULFILLED
                this.value = value
                // 处理resolve方法在异步是调用，即状态在一段时间为pending状态，会导致then里面成功的方法吊用不了
                this.fulfilledCallback.forEach((fn => {
                    fn(this.value)
                }))
            }
        }
        const reject = (reason) => {
            // 失败后操作（状态的改变，失败回调的执行）
            if(this.state == 'pending') {
                this.state = REJECTED
                this.reason = reason
                // 处理reject方法在异步是调用，即状态在一段时间为pending状态，会导致then里面失败的方法吊用不了
                this.rejectedCallback.forEach((fn => {
                    fn(this.reason)
                }))
            }
            
        }
        try {
            executor(resolve,reject)
        }catch(err){
            reject(err)
        }
        
    }
    then(onFuulfiled, onRejected) {
        let self = this
        // 参数校验
        if(typeof onFuulfiled != 'function') {
            onFuulfiled = (value) => {
                return value
            }
        }
        // 参数校验
        if(typeof onRejected != 'function') {
            onFuulfiled = (reason) => {
                return reason
            }
        }
        // 实现链式调用，必须通过新的实例
        let promise2 = new myPromise((reslove,reject) => {
            if(self.state == FULFILLED) {
                // 处理then异步
                setTimeout(() => {
                    const x = onFuulfiled(self.value)
                    resovePromise(promise2, x, resolve, reject)
                }, 0);    
            }
            if(self.state == REJECTED) {
                // 处理then异步
                setTimeout(() => {
                    const x = onRejected(self.reason)
                    resovePromise(promise2, x, resolve, reject)
                }, 0);
            }
            // 状态一直pending的处理
            if(self.state === PENDING ) {
                self.fulfilledCallback.push((value) => {
                    setTimeout(() => {
                        const x = onFuulfiled(value) 
                        resovePromise(promise2, x, resolve, reject)
                    }, 0);
                })
                self.rejectedCallback.push((reason) => {
                    setTimeout(() => {
                        const x = onFuulfiled(reason) 
                        resovePromise(promise2, x, resolve, reject)
                    }, 0);
                })
            }
        })
        function resovePromise(promise ,x ,resolve ,reject) {
            // promise与x相等
            if(promise===x) {
                reject(new TypeError('chaining cycle detected promise'))
            }
            if(x instanceof Promise) {
                 // x 为 Promise
                // 如果 x 处于等待态， promise2 需保持为等待态直至 x 被执行或拒绝
                // 如果 x 处于执行态，用相同的值执行 promise2
                // 如果 x 处于拒绝态，用相同的据因拒绝 promise2
                // 用then代替x.then
                then.call(x, 
                    value => {
                        // resolve(value)
                        // 处理resolve参数有事promise函数
                        resovePromise(promise, value, resolve, rejsct)
                    },
                    reason => {
                        reject(reason)
                    }
                )
            }else if((typeof x === 'object' || typeof x === 'function') && x!== null) {
                try {
                    if(typeof x === 'function') {
                        then.call(x,
                            value => {
                                // resolve(value)
                                // 处理resolve参数有事promise函数
                                resovePromise(promise, value, resolve, rejsct)
                            },
                            reason => {
                                reject(reason)
                            }
                        )
                    } else {
                        resolve(x)
                    }
                }catch(err){
                    reject(err)
                }
            }else {
                reslove(x)
            }
        }
        return promise2
    }
    resolve(val) {
        return new myPromise((resolve, reject) => {
            resolve(val)
        })
    }
    reject(reason) {
        return new myPromise((resolve, reject) => {
            reject(reason)
        })
    }
    all(promises) {
       return new myPromise((resolve, reject) => {
           if(!Array.isArray(promises)) {
               throw new TypeError('promises must be a array')
           }
           let result = []
           let count = 0
           promises.forEach((promise, index) => {
               promise.then((res) => {
                    result[index] = res
                    count ++
                    if(count==result.length) {
                        resolve(result)
                    }
               }, (err) => {
                    reject(err)
               })
           })
       })
    }
    race(promises) {
        return new myPromise((resolve, reject) => {
           promises.forEach(p => {
               p.then(resolve, reject)
           })
        })
    }
    finally(cb) {
        return this.then(
            val => {
                myPromise.resolve(callBack()).then(()=>val)
            },
            err => {
                myPromise.resolve(callBack()).then((err)=>err)
            }
        )
    }
  
}


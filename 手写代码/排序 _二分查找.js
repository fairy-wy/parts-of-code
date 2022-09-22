// 排序算法

// 冒泡排序
const bubbleSort = function (arr) {
    if(arr.length<=1) return arr
    for(var i=0;i<arr.length;i++) {
        for(var j=0;j<arr.length-i-1;j++) {
            if(arr[j] > arr[j+1]) {
                let temp = arr[j]
                arr[j] = arr[j+1]
                arr[j+1] = temp
            }
        }
    }
    return arr
}



// 快速排序

let arr = [1,8,5,6,0,2,3,5,9]
const quickSort = function (arr) {
    if(arr.length<2) return arr
    // 取中间数为基准数
    let mid = parseInt(arr.length/2)
    let baseValue = arr[mid]
    let left = [];
    let right = []
    for(var i = 0;i<arr.length;i++) {
        if(i === mid) continue
        if(arr[i]>=arr[mid]) {
            right.push(arr[i])
        } else {
            left.push(arr[i])
        }
    }
    return  [...quickSort(left),arr[mid],...quickSort(right)]
}
console.log(quickSort(arr))


// 掺入排序
function insertSort(array) {
    if(arr.length<2) return arr
    let current = null
    let prev = null
    for(var i=0;i<arr.length;i++) {
        current = arr[i]
        prev = i - 1
        while(prev >= 0 && arr[prev] > current) {
            arr[prev + 1] = arr[prev]
            prev --
        }
        arr[prev + 1] = current
    }
    return arr
    
}


// 二分查找
// 非递归方式
const lookByBinary = function (arr,target) {
    quickSort(arr)
    let left = 0
    let right = arr.length - 1
    while (left <= right) {
        let mid = Math.floor((left + right)/2)
        if(arr[mid]===target) return mid
        if(arr[mid]>target) {
            right = mid - 1
        }else if(arr[mid]<target) {
            left = mid + 1 
        }
    }
    return -1   
}

// 递归方式
const binary = function (arr,start,end,target) {
    quickSort(arr)
    let mid = Math.floor((start + end)/2)
    if(arr[mid]===target) return mid
    if(arr[mid]>target) {
        binary(arr,start, mid-1,target)
    } else {
        binary(arr,mid+1, right, target)
    }
    return mid
}


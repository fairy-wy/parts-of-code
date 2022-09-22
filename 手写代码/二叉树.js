// 初始化数据
const tree = {
    val: 'a',
    children: [
        {
            val: 'b',
            children: [
                {
                   val: 'd',
                   children: [
                       {
                           val: 'f',
                           children: []
                       }
                   ]
                },
                {
                    val: 'e',
                    children: []
                }
            ]
        },
        {
            val: 'c',
            children: [
                {
                    val: 'g',
                    children:[]
                },
                {
                    val: 'h',
                    children: [
                        {
                            val: 'i',
                            children: []
                        },
                         {
                             val: 'j',
                             children: []
                         }
                    ]
                }
            ]
        }  
    ]
}
// 深度优先遍历
// 非递归方式
function def(root) {
    // 结果集
    let result = []
    if(tree) {
        let stack = []
        // 栈顶元素入栈  根节点
        stack.push(root)
        // 循环条件: 栈不为空
        while(stack.length>0) {
            // 出栈  后出
            let item = stack.pop()
            // 按照遍历顺序存入结果集
            result.push(item)
            // 判断子元素
            let childrens = item.children?item.children: []
            for(var i=0;i<childrens.length;i++) {
                // 入栈   先入
                stack.push(childrens[i])
            }
        }
    }
   return result
}
// 递归方式
function def(root) {
    let result = [] 
    const defLook = function (root) {
        result.push(root)
        let childrens = root.children
        if(childrens.length>0 && childrens) {
            childrens.forEach(child => {
                defLook(child)
            });
        }
    }
    defLook(root)
    return result
}
console.log(def(tree))

// 广度优先遍历
// 非递归
function bfc (root) {
    let result = []
    if(root) {
        let queue = []
        queue.push(root)
        while(queue.length>0) {
            let item = queue.unshift()
            result.push(item)
            if(item.children.length>0 && item.children) {
                let childrens = item.children
                for(var i=0;i<childrens.length;i++) {
                    queue.push(childrens[i])
                }
            }
        }
    }
    return result
}

// 递归
function bfs(root) {
    let result = []
    result.push(root)
    const fn = function (root) {
        
    }
    fn(root)
    return result
}

console.log(bdf(tree))
function prev(root) {

}

// 数据初始化
// 二叉树生成
function nodeTree(value) {
    this.value = value
    this.left = null
    this.right = null
}
let a = new nodeTree('a')
let b = new nodeTree('b')
let c = new nodeTree('c')
let d = new nodeTree('d')
let e = new nodeTree('e')
let f = new nodeTree('f')
let g = new nodeTree('g')
a.left = b
a.right = c
b.left = d
b.right = e
c.left = f
c.right = g
// 前序遍历（根左右）
var preorderTraversal = function(root, res) {
    if (!root) return res;
    res.push(root.value);
    preorderTraversal(root.left, res)
    preorderTraversal(root.right, res)
    return res;
};
console.log(preorderTraversal(a, []))

// 中序遍历（左根右）递归
const midorderTraversal1 = function (root, res) {
    if (!root) return res;
    preorderTraversal(root.left, res)
    res.push(root.value);
    preorderTraversal(root.right, res)
    return res;
}
// 非递归
const midorderTraversal2 = function(root) {
    let curNode = root //当前节点
    let stack = []
    let result = []
    while(curNode || stack.length>0) {
        if(curNode) {
            // 入栈
            stack.push(curNode)
            // 指针节点移动
            curNode = curNode.left
        } else {
            // 出栈
            let item = stack.pop()
            // 推入结果集
            result.push(item)
            // 向右走
            curNode = item.right
        }
    }
}

// 后序遍历（左右根）
const lastorderTraversal = function (root, res) {
    if (!root) return res;
    lastorderTraversal(root.left, res)
    lastorderTraversal(root.right, res)
    res.push(root.value);
    return res;
}


// 反转二叉树
// 利用前序反转
const reverseTree1 = function (root) {
    if(root==null) {
        return null
    }
    let temp = new nodeTree('h')
    temp = root.left
    root.left = root.right
    root.right = temp
    reverseTree(root.left)
    reverseTree(root.right)
    return root
}
console.log(reverseTree(a))

// 利用中序遍历反转
const reverseTree2 = function (root) {
    if(root==null) {
        return null
    }
    reverseTree(root.left)
    let temp = new nodeTree('h')
    temp = root.left
    root.left = root.right
    root.right = temp
    reverseTree(root.right)
    return root
}
console.log(reverseTree(a))
// 利用后序遍历反转
const reverseTree3 = function (root) {
    if(root==null) {
        return null
    }
    reverseTree(root.left)
    reverseTree(root.right)
    let temp = new nodeTree('h')
    temp = root.left
    root.left = root.right
    root.right = temp
    return root
}

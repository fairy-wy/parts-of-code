// 链表
// 创建链表
function ListNode(value) {
    this.value = value;
    this.next = null
}

// 初始化链表
var n1=new ListNode(1)
var n2=new ListNode(2)
var n3=new ListNode(3)
var n4=new ListNode(4)
var n5=new ListNode(5)
var n6=new ListNode(6)
n1.next = n2
n2.next = n3
n3.next = n4
n4.next = n5
n5.next = n6
// 1->2->3->4->5

// 1.翻转链表  迭代
function reverseListNode(head) {
    if(head==null || head.next==null) {
        return head
    }
    let prev = null
    let curr = head
    while(curr!=null) {
        var next = curr.next
        // 将curr头结点插到新链表
        curr.next = prev
        // 将当前节点的上一个节点指向当前节点
        prev = curr
        // 当前节点指向下一个节点,指针后移
        curr = next

    }
    return prev
}

console.log(reverseListNode(n1))

// 2.合并链表
function concatList(n1, n2) {
    var newNode = new ListNode(0)
    var curNode = newNode
    // 循环条件
    while(n1 && n2) {
        if(n1.value>n2.value) {
            curNode.next = n2
            n2 = n2.next
        } else {
            curNode.next = n1
            n1 = n1.next
        }
        curNode = curNode.next
    }
    // n1链表比较长
    if (n1) {
        curNode.next = n1
    }
    // n2链表比较长
    if(n2) {
        curNode.next = n2
    }

    return newNode.next
}


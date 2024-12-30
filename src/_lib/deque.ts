
class Node<T> {
    prev: Node<T> | null
    next: Node<T> | null
    data: T

    constructor(data: T, prev: Node<T> | null, next: Node<T> | null) {
        this.prev = prev;
        this.next = next;
        this.data = data;
    }
}

export default class Deque<T> {
    private head: Node<T> | null;
    private tail: Node<T> | null;
    private size: number;
    private len: number;

    constructor(size: number) {
        this.head = null;
        this.tail = null;
        this.size = size;
        this.len = 0;
    }

    // adds data to the start of the queue, if queue size
    // is reached, pop item from the end of the queue, returned
    // boolean value inidicate if item was poped
    unshift(data: T): boolean {
        let node = new Node(data, null, null);
        let poped = false;
        this.len++;

        if(this.head === null) {
            this.head = node;
            this.tail = node;
            return poped;
        }

        // pop items from the end of the queue
        // because we reached the max queue size
        if(this.len >= this.size) {
            this.pop();
            poped = true;
        }

        let head = this.head;
        head.prev = node;
        node.next = head;
        this.head = node;
        return poped;
    }

    // remove item from the end of the queue and
    // return the poped item value, if queue was empty
    // and no item were poped, return `null`
    pop(): T | null {
        if(this.tail === null) {
            return null;
        }

        let tail = this.tail;
        this.tail = tail.prev;
        this.len--;

        return tail.data;
    }

    // iterator over the values
    // inside the queue
    *[Symbol.iterator]() {
        let node = this.head;
        while(node != null) {
            yield node.data;
            node = node.next;
        }
    }
}

import { nullable } from "./type_utils";

export interface heap_node<T>{
    data: T;
    weight: number;
}

export class HeapNode<T> implements heap_node<T>{

    data: T;
    weight: number;
    constructor(data: T, weight:number = 0){
        this.data = data;
        this.weight = weight;
    }
}

class Heap<T>{

    storage: nullable<HeapNode<T>>[];
    constructor(){
        this.storage = [null]; // null acts as the root node
    }

    static getLeftChild(index: number): number{
        return index * 2;
    }

    static getRightChild(index: number): number{
        return (index * 2) + 1
    }

    static getParent(index: number): number{
        return Math.floor(index / 2);
    }

    static getRootIndex(){
        return 1;
    }

    isInRange(index: number): boolean{
        return (index >= 1 && index < this.storage.length)
    }

    size(): number{
        return this.storage.length - 1;
    }

    peek(): nullable<heap_node<T>>{
        if(this.size() > 0){
            return this.storage[Heap.getRootIndex()];
        }else{
            return null;
        }
    }

    /** Overload this message to apply the actual heaping */
    compareHeapNodes(node1: heap_node<T>, node2: heap_node<T>): boolean{
        return false; // This is the method to override to create min or max heaps
    }

    /** Compares nodes to check if a swap should be done.
     * 
     * Returns True if the swap should be done, false if it should not be done.
     */
    compare(node1: nullable<heap_node<T>>, node2: nullable<heap_node<T>>): boolean{
        if(node1 == null || node2 == null){
            // Assume root is reached and everything is in the right place.
            return false;
        }else{
            // Both nodes are actually HeapNodes
            return this.compareHeapNodes(node1, node2);
        }
    }

    /**
    Swaps the nodes at the given indecies, i and j. The swap only occurs
    if the node at index i should be given a higher priority than the node
    at index j.

    Returns True if the swap occurs, False if either of the indicies are
    out of range or the swap does not occur.
    */
    swap(i: number, j: number): boolean{
        if(this.isInRange(i) && this.isInRange(j)){
            if(this.compare(this.storage[i], this.storage[j])){
                let tmp: nullable<heap_node<T>> = this.storage[i];
                this.storage[i] = this.storage[j];
                this.storage[j] = tmp;
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    /**
    Performs the Heapify functionality for retaining the heap property
    during an insertion, or add, function.
    */
    heapifyUp(index: number): void{
        let parentIndex: number = Heap.getParent(index);
        if(this.swap(index, parentIndex)){
            return this.heapifyUp(parentIndex);
        }else{
            return;
        }
    }

    /**
    Performs the Heapify functionality for retaining the heap property
    during an deletion, or remove, function.
    */
    heapifyDown(index: number): void{
        let leftChildIndex = Heap.getLeftChild(index);
        let rightChildIndex = Heap.getRightChild(index);
        if(this.isInRange(leftChildIndex) && this.isInRange(rightChildIndex)){
            if(this.compare(this.storage[leftChildIndex], this.storage[rightChildIndex])){
                // Left child is the one to swap with
                if(this.swap(leftChildIndex, index)){
                    return this.heapifyDown(leftChildIndex);
                }else{
                    // Left child is in the correct place so do nothing
                    return;
                }
            }else{
                // right child is the one that would swap with the current
                if(this.swap(rightChildIndex, index)){
                    this.heapifyDown(rightChildIndex);
                }else{
                    // no swap needs to be done.
                    return;
                }
            }
        }else{
            // there isnt a right and a left child so do nothing?
            return;
        }
    }

    add(data: T, weight: number = 0){
        this.storage.push(new HeapNode<T>(data, weight));
        this.heapifyUp(this.storage.length-1);
    }

    /**
    Extracts the next element of the Heap, ensuring the heap property is
    maintained.

    Note: Elements are returned in the following format
        (weight, data)

    Returns the next element in the Heap.
    */
    next(): nullable<T>{
        if(this.size() <= 0){
            return null;
        }else if(this.size() == 1){
            return this.storage.pop()?.data || null;
        }else{
            let item: nullable<heap_node<T>> = this.storage[Heap.getRootIndex()];
            this.storage[Heap.getRootIndex()] = this.storage.pop() || null;
            this.heapifyDown(Heap.getRootIndex());
            if(item != null){
                return item.data;
            }else{
                return item;
            }
        }
    }
}

export class MaxHeap<T> extends Heap<T>{

    compareHeapNodes(node1: heap_node<T>, node2: heap_node<T>): boolean {
        return (node1.weight > node2.weight);
    }
}
import { nullable } from "../utils/type_utils";

// Depreciated I think

export type choiceSelector<T> = string | ((data: T) => boolean);

export interface node<D, N>{
    data: D;
    children: nullable<N>[]; // May not need to be nullable
}

export interface choice<T, N>{
    selector: choiceSelector<T>;
    result: N;
}

export class Node<D, N > implements node<D,N>{

    data: D;
    children: nullable<N>[];
    constructor(data: D, children: nullable<N>[] = []){
        this.data = data;
        this.children = children;
    }
}
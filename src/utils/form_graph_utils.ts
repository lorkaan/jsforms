import { MaxHeap } from "./heap";
import { nullable } from "./type_utils";

export interface vertex<I, T>{
    id? : I;
    label: string;
    question: string;
    answer: nullable<T>;
    answerPool: T[];
}

export class Vertex<I,T> implements vertex<I,T>{

    id?: I;
    label: string;
    question: string;
    answer: nullable<T>;
    answerPool: T[];
    constructor(label: string, question: string, answer: nullable<T> = null, answerPool: T[] = [], id?: I){
        this.label = label;
        this.question = question;
        this.answer = answer;
        this.answerPool = answerPool;
        if(id){
            this.id = id;
        }
    }
}

export type ConditionalFunc<T> = (data: T) => boolean;

export interface edge<I extends (string | number), T>{
    dst: I;
    condition: nullable<ConditionalFunc<T>>;
    src? : I;
}

export class Edge<I extends (string | number), T> implements edge<I, T>{

    src?: I;
    dst: I;
    condition: nullable<ConditionalFunc<T>>;
    constructor(dst: I, condition: nullable<ConditionalFunc<T>> = null, src?: I){
        this.dst = dst;
        this.condition = condition;
        if(src){
            this.src = src;
        }
    }
}

export type VertexRecord<I extends (string | number), T> = Record<I, Vertex<I,T>>;
export type EdgeRecord<I extends (string | number), T> = Record<I, Edge<I, T>[]>;
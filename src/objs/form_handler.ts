import { vertex, edge, VertexRecord, EdgeRecord } from "../utils/form_graph_utils";
import { nullable } from "../utils/type_utils";
import { DirectedFormGraph } from "./directed_form_graph";

export class FormHandlerModel<I extends (string|number), T>{

    graph: DirectedFormGraph<I, T>;
    stack: [I,vertex<I, T>][];
    cur: I;
    processedSet: Set<I>;
    constructor(vertexMap: VertexRecord<I, T>, edgeMap: EdgeRecord<I, T>, start: I){
        this.graph = DirectedFormGraph.buildDirectedGraph<I, T>(vertexMap, edgeMap);
        if(this.graph.getVertex(start) == null){
            throw new Error("Start Point is not a Vertex in the Graph")
        }
        this.stack = [];
        this.cur = start;
        this.processedSet = new Set<I>()
    }

    next(): nullable<vertex<I, T>>{
        this.processedSet.add(this.cur);
        let edges: edge<I,T>[] = this.graph.getEdges(this.cur);
        let new_vertex: nullable<vertex<I,T>> = null;
        for(let i = edges.length-1; i >= 0; i--){
            if(this.processedSet.has(edges[i].dst)){
                continue;
            }else{
                new_vertex = this.graph.getVertex(edges[i].dst);
                if(new_vertex == null){
                    continue;
                }else{
                    this.stack.push([edges[i].dst, new_vertex]);
                }
            }
        }
        let next_vertex: [I, vertex<I, T>] | undefined = this.stack.pop();
        if(next_vertex == undefined){
            return null;
        }else{
            let [newCurID, newCurVertex] = next_vertex;
            this.cur = newCurID;
            return newCurVertex;
        }
    }

    getCurrentVertex(): nullable<vertex<I, T>>{
        return this.graph.getVertex(this.cur);
    }
}
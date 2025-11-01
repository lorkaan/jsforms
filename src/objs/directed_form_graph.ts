import { edge, vertex, VertexRecord } from "../utils/form_graph_utils";
import { EdgeRecord } from "../utils/form_graph_utils";
import { MaxHeap } from "../utils/heap";
import { nullable } from "../utils/type_utils";

export class DirectedFormGraph<I extends (string|number), T>{

    static max_heap_weight: number = 1000; // Only used for self-referenical nodes

    vertexSet: VertexRecord<I, T>;
    edgeSet: EdgeRecord<I,T>;
    constructor(){
        this.vertexSet = {} as VertexRecord<I, T>;
        this.edgeSet = {} as EdgeRecord<I, T>;
    }

    _vertex_collision(item: vertex<I, T>, vertex_id?: I): nullable<I>{
        return null;
    }

    _add_vertex(item: vertex<I, T>, cur_id: nullable<I>, max_loop: number = 1000): boolean{
        if(cur_id != null){
            let cur: nullable<vertex<I, T>> = this.vertexSet[cur_id] || null;
            while(cur != null && cur_id != null && max_loop >= 0){
                max_loop -= 1;
                cur_id = this._vertex_collision(item, cur_id);
                if(cur_id == null){
                    return false;
                }else{
                    cur = this.vertexSet[cur_id] || null;
                }
            }
            if(cur_id != null && cur == null){
                this.vertexSet[cur_id] = item;
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    addVertex(item: vertex<I, T>, vertex_id?: I): boolean{
        let cur_id: nullable<I> = null;
        if(vertex_id){
            cur_id = vertex_id;
        }else if(item.id){
            cur_id = item.id;
        }else{
            return false;
        }
        return this._add_vertex(item, cur_id);
    }

    addEdge(item: edge<I, T>, src?: I): boolean{
        let cur_src: nullable<I> = null;
        if(src){
            cur_src = src;
        }else if(item.src){
            cur_src = item.src;
        }else{
            return false;
        }
        let src_v: nullable<vertex<I, T>> = this.vertexSet[cur_src] || null;
        let dst_v: nullable<vertex<I, T>> = this.vertexSet[item.dst] || null; // Edges can only exist between already created vertex;
        if (src_v != null && dst_v != null){
            let cur_edge_list: edge<I, T>[] = this.edgeSet[cur_src] || []; 
            cur_edge_list.push(item)
            this.edgeSet[cur_src] = cur_edge_list;
            return true;
        }else{
            return false;
        }
    }

    getVertex(vertex_id: I): nullable<vertex<I, T>>{
        return this.vertexSet[vertex_id] || null;
    }

    getEdges(vertex_id: I): edge<I, T>[]{
        let cur_edges: edge<I, T>[] = [];
        let cur_vertex: nullable<vertex<I, T>> = this.vertexSet[vertex_id] || null;
        if(cur_vertex == null){
            return cur_edges;
        }else if(cur_vertex.answer == null){
            // What to do if the answer to the vertex is null.
            return cur_edges; // Just a default behaviour
        }else{
            let cur_answer: T = cur_vertex.answer;
            let cur_edge_list: edge<I, T>[] = this.edgeSet[vertex_id] || [];
            let edgeHeap: MaxHeap<edge<I, T>> = new MaxHeap();
            for(let i = 0; i < cur_edge_list.length; i++){
                if(cur_edge_list[i].condition == null){
                    edgeHeap.add(cur_edge_list[i], cur_edge_list[i].dst == vertex_id? DirectedFormGraph.max_heap_weight: 0); // Default is weight being 0
                }else if(cur_edge_list[i].condition!(cur_answer)){ // Suppress type check
                    edgeHeap.add(cur_edge_list[i], cur_edge_list[i].dst == vertex_id? DirectedFormGraph.max_heap_weight: cur_edge_list.length-i);
                }else{
                    continue;
                }
            }
            while(edgeHeap.peek() != null){
                let heapItem: nullable<edge<I,T>> = edgeHeap.next();
                if(heapItem == null){
                    break;
                }else{
                    cur_edges.push(heapItem);
                }
            }
            return cur_edges;
        }
    }

    static buildDirectedGraph<I extends (string | number), T>(vertexMap: VertexRecord<I, T>, edgeMap: EdgeRecord<I, T>){
        let graph: DirectedFormGraph<I, T> = new DirectedFormGraph<I, T>();
        graph.vertexSet = vertexMap;
        graph.edgeSet = edgeMap;
        return graph;
    }
}
<script setup lang="ts">
import { ref } from "vue";
import { FormHandlerModel } from "./objs/form_handler";
import { EdgeRecord, vertex, VertexRecord } from "./utils/form_graph_utils";
import { nullable } from "./utils/type_utils";

let vertexMap: VertexRecord<string, string> = {
    "start": {
        label: "Start Form",
        question: "How old are you?",
        answer: null,
        answerPool: []
    },
    "name": {
        label: "Name Information",
        question: "What is your name?",
        answer: null,
        answerPool: []
    }
};
let edgeMap: EdgeRecord<string, string> = {
    "start": [{
        dst: "name",
        condition: null
    }]
};

const formhandler = new FormHandlerModel<string, string>(vertexMap, edgeMap, "start");

let cur_vertex_ref = ref(formhandler.getCurrentVertex());

console.log(cur_vertex_ref);
console.log(cur_vertex_ref.value);

const finishFlag = ref(false)

function clickHandler(){
    let cur_vertex: nullable<vertex<string, string>> = formhandler.getCurrentVertex();
    if(cur_vertex != null){
        let htmlElement: HTMLInputElement = document.getElementById("answer") as HTMLInputElement;
        cur_vertex.answer = htmlElement.value;
        let vertex = formhandler.next();
        if( vertex == null){
            finishFlag.value = true;
        }else{
            htmlElement.value = "";
            cur_vertex_ref.value = vertex;
        }
    }
}

function submitForm(){
    console.log("Form Submitted")
}

</script>

<template>
    <div>
        <div v-if="finishFlag">
            <button @click="submitForm" >Submit Form</button>
        </div>
        <div v-else>
            <div>
                <h3>{{ cur_vertex_ref?.label }}</h3>
                <label>{{ cur_vertex_ref?.question }}</label><br/>
                <input id="answer" type="text" :placeholder="cur_vertex_ref?.question" />
            </div>
            <div>
                <button @click="clickHandler">Next</button>
            </div>
        </div>
        
    </div>
    
</template>
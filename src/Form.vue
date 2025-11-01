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
    }
};
let edgeMap: EdgeRecord<string, string> = {};

const formhandler = new FormHandlerModel<string, string>(vertexMap, edgeMap, "start");

const finishFlag = ref(false)

function clickHandler(){
    let cur_vertex: nullable<vertex<string, string>> = formhandler.getCurrentVertex();
    if(cur_vertex != null){
        let htmlElement: HTMLInputElement = document.getElementById("answer") as HTMLInputElement;
        cur_vertex.answer = htmlElement.value;
        if(formhandler.next() == null){
            finishFlag.value = true;
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
                <h3>{{ formhandler.getCurrentVertex()?.label }}</h3>
                <label>{{ formhandler.getCurrentVertex()?.question }}</label><br/>
                <input id="answer" type="text" :placeholder="formhandler.getCurrentVertex()?.question" />
            </div>
            <div>
                <button @click="clickHandler">Next</button>
            </div>
        </div>
        
    </div>
    
</template>
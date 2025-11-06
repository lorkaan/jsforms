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
    "parentConsent":{
        label: "Parent Consent",
        question: "Do you have Parental Consent?",
        answer: null,
        answerPool:[
            "Yes",
            "No"
        ]
    },
    "name": {
        label: "Name Information",
        question: "What is your name?",
        answer: null,
        answerPool: []
    }
};
let edgeMap: EdgeRecord<string, string> = {
    "start": [
        {
            dst: "parentConsent",
            condition: (x) =>{
                let numx = Number.parseInt(x);
                return numx < 18;
            }
        },
        {
            dst: "name",
            condition: null
        }
    ]
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
                <div v-if="cur_vertex_ref?.answerPool.length == 0">
                    <input id="answer" type="text" :placeholder="cur_vertex_ref?.question" />
                </div>
                <div v-else>
                    <select id="answer" name="answer">
                        <option v-for="item in cur_vertex_ref?.answerPool" :value="item">{{ item }}</option>
                    </select>
                </div>
            </div>
            <div>
                <button @click="clickHandler">Next</button>
            </div>
        </div>
        
    </div>
    
</template>
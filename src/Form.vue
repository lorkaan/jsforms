<script setup lang="ts">
import { FormHandlerModel } from "./objs/form_handler";
import { EdgeRecord, VertexRecord } from "./utils/form_graph_utils";

let vertexMap: VertexRecord<string, string> = {};
let edgeMap: EdgeRecord<string, string> = {};

let formhandler: FormHandlerModel<string, string> = new FormHandlerModel<string, string>(vertexMap, edgeMap, "start");

</script>

<template>
    <div>
        <h3>{{ formhandler.getCurrentVertex()?.label }}</h3>
        <label>{{ formhandler.getCurrentVertex()?.question }}</label>
    </div>
</template>
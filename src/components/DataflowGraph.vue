<template>
    <div id="graph-container" style="min-height: 50vh"></div>
</template>

<script setup>

// Use a worker to parse the AST of the source in Editor
import { h, getCurrentInstance, render, onMounted } from 'vue';
import Drawflow from 'drawflow';
import styleDrawflow from 'drawflow/dist/drawflow.min.css'
const Vue = { version: 3, h, render };

onMounted(() => {
    const id = document.getElementById("graph-container");

    const editor = new Drawflow(id, Vue);
    // Pass render Vue 3 Instance
    const internalInstance = getCurrentInstance();
    editor.value = new Drawflow(id, Vue, internalInstance.appContext.app._context);

    var html = `
    <div><input type="text" df-name></div>
    `;
    var data = { "name": '' };

    
    editor.start();

    editor.addNode('github', 0, 1, 150, 300, 'github', data, html);


});

// Construct a DAG to represent dataflow graph, display it on a canvas

// Update the DAG when graph nodes values have been changed, compute intermediate values and representations 


</script>
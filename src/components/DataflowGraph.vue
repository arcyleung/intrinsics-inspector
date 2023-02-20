<template>
  <div id="graph-container" :style="`height: ${splitterHeight}px`"></div>
</template>

<style scoped>
#graph-container {
  overflow: hidden;
  background: #686868;
  background-size: 20px 20px;
  background-image: radial-gradient(#949494 1px, transparent 1px);
}
</style>

<script setup>


// Use a worker to parse the AST of the source in Editor
import { h, getCurrentInstance, render, onMounted, defineProps, computed } from 'vue';
import Drawflow from 'drawflow';
import styleDrawflow from 'drawflow/dist/drawflow.min.css'
const Vue = { version: 3, h, render };

const props = defineProps({
  height: 0,
  width: 0,
  graphWorker: undefined,
})

const splitterHeight = computed(() => Math.round(window.innerHeight - props.height))
const splitterWidth = computed(() => props.width)

onMounted(() => {
  const id = document.getElementById("graph-container");

  const drawFlow = new Drawflow(id, Vue);
  // Pass render Vue 3 Instance
  const internalInstance = getCurrentInstance();
  drawFlow.value = new Drawflow(id, Vue, internalInstance.appContext.app._context);

  var html = `
    <div><input type="text" df-name></div>
    `;
  var data = { "name": 'github' };

  drawFlow.start();

  props.graphWorker.onmessage = (e) => {
    console.log('Message received from worker');
    drawFlow.import({ "drawflow": { "Home": { "data": { "1": { "id": 1, "name": "job1", "data": {}, "class": "", "html": "<div>job1</div>", "typenode": false, "inputs": {}, "outputs": { "output_1": { "connections": [ { "node": "2", "output": "input_1" } ] } }, "pos_x": 65.42498779296875, "pos_y": 175.28749084472656 }, "2": { "id": 2, "name": "job2", "data": {}, "class": "", "html": "<div>job2</div>", "typenode": false, "inputs": { "input_1": { "connections": [ { "node": "1", "input": "output_1" } ] } }, "outputs": {}, "pos_x": 464.42498779296875, "pos_y": 135.28749084472656 } } } } })
    
  }

//   drawFlow.addNode('github', 0, 1, 150, 300, 'github', data, html);


});

// Construct a DAG to represent dataflow graph, display it on a canvas

// Update the DAG when graph nodes values have been changed, compute intermediate values and representations 


</script>
<template>
  <q-layout>

    <!-- <q-header elevated class="bg-primary text-white" height-hint="5vh">
      <q-toolbar>
        <q-toolbar-title>
          <div class="flex items-center flex-shrink-0 text-white mr-6">
            <span class="font-semibold text-xl tracking-tight">SIMDeez</span>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header> -->

    <q-page-container>
      <q-page>
        <q-splitter v-model="vSplit" :limits="[20, 90]">
          <template v-slot:before>
            <SearchTable :data="intrinsics.value" />
          </template>

          <template v-slot:after>
            <q-splitter v-model="hSplit" horizontal style="height: 100vh;" :limits="[20, 90]">
              <template v-slot:before>
                <q-resize-observer @resize="onResize" :debounce="0"/>
                <!-- <div class="q-pl-md">
                  <div class="text-h4 q-mb-md">Before</div>
                  <div v-for="n in 20" :key="n" class="q-my-md">{{ n }}. Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus
                    obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</div>
                </div> -->
                <Editor></Editor>
              </template>

              <template v-slot:after>
                <DataflowGraph :height="hSplitterHeight" :width="hSplitterWidth"></DataflowGraph>
              </template>

            </q-splitter>
          </template>

        </q-splitter>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<style>
.q-scrollarea--only-vertical .q-scrollarea__content {
  width: 100%
}
</style>

<script setup>
import SearchTable from './components/SearchTable.vue'
import Editor from './components/Editor.vue'
import DataflowGraph from './components/DataflowGraph.vue'
import { Canvas, Rect } from 'fabric';
import * as Parser from 'web-tree-sitter';

import axios from 'axios';

import { onMounted, ref } from 'vue'

const state1 = ref('')
const state2 = ref('');

const vSplit = ref(40);
const hSplit = ref(50);

let hSplitterHeight = ref(0);
let hSplitterWidth = ref(0);

const intrinsics = ref([]);

try {
	//@ts-ignore
	delete WebAssembly.instantiateStreaming
} catch {}

onMounted(async () => {

})

const onResize = ({ width, height }) => {
  // this.splitterheight = height
  hSplitterHeight = height;
  hSplitterWidth = width;
}

</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>

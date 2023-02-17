<template>
    <div id="container" style="min-height: 50vh"></div>
</template>

<script setup>

import { onMounted } from '@vue/runtime-core';
import * as monaco from 'monaco-editor';
import { defineProps } from 'vue';

const props = defineProps({
  graphWorker: undefined,
})

self.MonacoEnvironment = {
    getWorker: function (workerId, label) {
        const getWorkerModule = (moduleUrl, label) => {
            return new Worker(self.MonacoEnvironment.getWorkerUrl(moduleUrl), {
                name: label,
                type: 'module'
            });
        };

        switch (label) {
            case 'json':
                return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label);
            case 'css':
            case 'scss':
            case 'less':
                return getWorkerModule('/monaco-editor/esm/vs/language/css/css.worker?worker', label);
            case 'html':
            case 'handlebars':
            case 'razor':
                return getWorkerModule('/monaco-editor/esm/vs/language/html/html.worker?worker', label);
            case 'typescript':
            case 'javascript':
                return getWorkerModule('/monaco-editor/esm/vs/language/typescript/ts.worker?worker', label);
            default:
                return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label);
        }
    }
};

const placeHolder = `
#include <immintrin.h>

void doWork(int* a, int* b) {
    _mm512_i64gather_ps(a, b);
    _mm256_permute2f128_ps(a_lo, b_lo);
    _mm256_permute2f128_ps(a_hi, b_hi);
}
`
onMounted(() => {
    let editorContainer = document.getElementById('container');
    let editor = monaco.editor.create(editorContainer, {
        value: placeHolder,
        language: 'cpp'
    });

    editor.getModel().onDidChangeContent((e) => {
        console.log(props.graphWorker)
        props.graphWorker.postMessage(editor.getModel().getValue());
    });


    // we need the parent of the editor
    const parent = editorContainer.parentElement

    window.addEventListener('resize', () => {
        // make editor as small as possible
        editor.layout({ width: 0, height: 0 })

        // wait for next frame to ensure last layout finished
        window.requestAnimationFrame(() => {
            // get the parent dimensions and re-layout the editor
            const rect = parent.getBoundingClientRect()
            editor.layout({ width: rect.width, height: rect.height })
        })
    })
})

</script>
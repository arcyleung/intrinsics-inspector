<template>
    <div id="container" style="min-height: 100%"></div>
</template>

<script setup>

import { onMounted } from '@vue/runtime-core';
import * as monaco from 'monaco-editor';

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
    let editor = monaco.editor.create(document.getElementById('container'), {
        value: placeHolder,
        language: 'cpp'
    });
})

</script>
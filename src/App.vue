<template>
  <div class="flex flex-col min-h-screen">
    <nav class="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <span class="font-semibold text-xl tracking-tight">SIMDeez</span>
      </div>
      <div class="block lg:hidden">
        <button
          class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
          <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div class="text-sm lg:flex-grow">
          <a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
            Examples
          </a>
          <a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
            Github
          </a>
        </div>
        <div>
          <a href="#"
            class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Download</a>
        </div>
      </div>
    </nav>
    <el-container class="flex flex-col flex-grow">
      <el-aside width="200px">
        <div>Instruction Sets</div>
        <el-autocomplete v-model="state1" value-key="_attributes.name" :fetch-suggestions="querySearch" clearable
          class="inline-input w-50" placeholder="Please Input" @select="handleSelect"><template #default="{ item }">
            <div class="value">{{ item._attributes.name }}</div>
            <span class="link">{{ item._attributes.tech }}</span>
          </template></el-autocomplete>
          <div>Category</div>
        <el-autocomplete v-model="state2" :fetch-suggestions="querySearch" :trigger-on-focus="false" clearable
          class="inline-input w-50" placeholder="Please Input" @select="handleSelect" />
          <div>Datatypes</div>
        <el-autocomplete v-model="state2" :fetch-suggestions="querySearch" :trigger-on-focus="false" clearable
          class="inline-input w-50" placeholder="Please Input" @select="handleSelect" />
      </el-aside>
      <div>
        <!-- <el-row class="demo-autocomplete">
          <el-col :span="12">

          </el-col>
          <el-col :span="12">

          </el-col>
        </el-row> -->
      </div>

    </el-container>
  </div>
</template>

<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import { Canvas, Rect } from 'fabric';
import axios from 'axios';

import { onMounted, ref } from 'vue'

const state1 = ref('')
const state2 = ref('');

const intrinsics = ref([]);

const querySearch = (queryString, cb) => {
  const results = queryString
    ? intrinsics.value.filter(createFilter(queryString))
    : intrinsics.value
  // call callback function to return suggestions
  console.log(results[0])
  cb(results)
}
const createFilter = (queryString) => {
  return (intrinsic) => {
    // console.log(intrinsic._attributes.name)
    // console.log(intrinsic._attributes.name.toLowerCase().indexOf(queryString.toLowerCase()))
    return (
      intrinsic._attributes.name.toLowerCase().indexOf(queryString.toLowerCase()) > 0
    )
  }
}

const handleSelect = (item) => {
  console.log(item)
}


onMounted(async () => {
  const res = await axios.get("/intel_intrinsics.json");
  intrinsics.value = res.data;
})
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

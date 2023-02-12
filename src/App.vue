<template>
  <q-layout view="hHh lpR fFf columns" class="flex max-h-screen">

    <q-header elevated class="bg-primary text-white" height-hint="5vh">
      <q-toolbar>
        <q-toolbar-title>
          <div class="flex items-center flex-shrink-0 text-white mr-6">
            <span class="font-semibold text-xl tracking-tight">SIMDeez</span>
          </div>
        </q-toolbar-title>
      </q-toolbar>

      <!-- <q-tabs align="right">
        <q-route-tab to="/page1" label="Page One" />
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" />
      </q-tabs> -->
    </q-header>

    <q-page-container>
      <q-page>
        <q-splitter v-model="vSplit" :limits="[20, 90]">
          <template v-slot:before>
            <SearchTable :data="intrinsics.value" />
          </template>

          <template v-slot:after>
            <q-splitter v-model="hSplit" horizontal style="height: 94vh;" :limits="[10, 90]">

              <template v-slot:before>
                <div class="q-pa-md">
                  <div class="text-h4 q-mb-md">Before</div>
                  <div v-for="n in 20" :key="n" class="q-my-md">{{ n }}. Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus
                    obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</div>
                </div>
              </template>

              <template v-slot:after>
                <div class="q-pa-md">
                  <div class="text-h4 q-mb-md">After</div>
                  <div v-for="n in 20" :key="n" class="q-my-md">{{ n }}. Lorem ipsum dolor sit, amet consectetur
                    adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus
                    obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</div>
                </div>
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
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import SearchTable from './components/SearchTable.vue'
import { Canvas, Rect } from 'fabric';


import axios from 'axios';

import { onMounted, ref } from 'vue'

const state1 = ref('')
const state2 = ref('');

const vSplit = ref(50);
const hSplit = ref(50);

const intrinsics = ref([]);

const columns = [
  {
    name: "name",
    required: true,
    label: "Dessert (100g serving)",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "calories",
    align: "center",
    label: "Calories",
    field: "calories",
    sortable: true,
  },
  { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
  { name: "carbs", label: "Carbs (g)", field: "carbs" },
  { name: "protein", label: "Protein (g)", field: "protein" },
  { name: "sodium", label: "Sodium (mg)", field: "sodium" },
  {
    name: "calcium",
    label: "Calcium (%)",
    field: "calcium",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "iron",
    label: "Iron (%)",
    field: "iron",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
];
const rows = [
  {
    name: "Frozen Yogurt",
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: "14%",
    iron: "1%",
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: "8%",
    iron: "1%",
  },
  {
    name: "Eclair",
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: "6%",
    iron: "7%",
  },
  {
    name: "Cupcake",
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: "3%",
    iron: "8%",
  },
  {
    name: "Gingerbread",
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: "7%",
    iron: "16%",
  },
  {
    name: "Jelly bean",
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: "0%",
    iron: "0%",
  },
  {
    name: "Lollipop",
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: "0%",
    iron: "2%",
  },
  {
    name: "Honeycomb",
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: "0%",
    iron: "45%",
  },
  {
    name: "Donut",
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: "2%",
    iron: "22%",
  },
  {
    name: "KitKat",
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: "12%",
    iron: "6%",
  },
]

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
  // document.getElementsByClassName("el-table-v2__overlay")[0].remove()
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

<template>
  <div class="q-pr-sm">
    <q-table class="intrinsics-table" dense title="Intrinsics Explorer" :rows="rows" :columns="columns"
      row-key="intrinsic"
        :filter="filter"
        :filter-method="customFilter"
        :visible-columns="visibleColumns" virtual-scroll :virtual-scroll-sticky-size-start="48" :rows-per-page-options="[0]">



      <template v-slot:top>
        <!--           <div class="text-h6">Filter by Columns</div> -->
        <q-toggle v-for="col in columns" v-model="visibleColumns" :val="col.name" :label="col.label" :key="col.name" ></q-toggle>
        <q-space></q-space>
        Filter method<q-toggle v-model="byVisibility" :label="byVisibility ? 'Visibility' : 'Options'"
          class="q-pr-md"></q-toggle>
        <q-select v-model="filterCols" multiple dense outlined options-dense use-chips emit-value map-options
          :options="columns" option-value="name" style="min-width: 150px;" label="Filter Columns"
          v-if="!byVisibility"></q-select>
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props"  @click="props.expand = !props.expand">
          <q-td auto-width>
            <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr class="q-virtual-scroll--with-prev" v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<style lang="sass">
.intrinsics-table
  /* height or max-height is important */
  max-height: 100vh

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0

  .q-table td
    padding: 0px 8px !important

</style>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useMeta } from 'quasar'
import axios from 'axios';

const intrinsics = ref([]);
let rows = ref([])
useMeta(() => {
  return {
    // whenever "title" from above changes, your meta will automatically update
    rows: rows.value
  }
})

let visibleColumns = ref([]);
let byVisibility = ref(true);
let filter = ref('');
let filterCols = ref([]);

const reqs = computed(() => columns.reduce((a, o) => {
      o.required && a.push(o.name)
      return a
    }, []));

const customFilter = (rows, terms) => {
  const lowerTerms = terms ? terms.toLowerCase() : ''
  const toFilter = byVisibility ? [...visibleColumns.value, ...reqs.value] : filterCols.value

  const filteredRows = rows.filter(
    row => toFilter.some(col => (row[col] + '').toLowerCase().includes(lowerTerms))
  )
  return filteredRows
}

const columns = [
  {
    name: 'intrinsic',
    required: true,
    label: 'Intrinsic',
    align: 'left',
    field: row => row.intrinsic,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'ISA', align: 'center', label: 'ISA', field: 'tech', sortable: true },
  { name: 'header', label: 'Header', field: 'header', sortable: true },
  { name: 'CPUID', label: 'CPUID', field: 'CPUID' },
  { name: 'category', label: 'Category', field: 'category', sortable: true },
  // { name: 'protein', label: 'Protein (g)', field: 'protein' },
  // { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  // { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
  // { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
]




onMounted(async () => {
  const res = await axios.get("/intel_intrinsics.json");
  const intrinsics_json = res.data;
  // document.getElementsByClassName("el-table-v2__overlay")[0].remove()
  // for (let i = 0; i < 1000; i++) {
  //   rows = rows.concat(seed.slice(0).map(r => ({ ...r })))
  // }

  rows.value = intrinsics_json.map((intrin) => {
    return {
      intrinsic: intrin.name,
      tech: intrin.tech,
      header: intrin.header,
      CPUID: intrin.CPUID,
      category: intrin.category
    }
  }
  )
})

// we generate lots of rows here


</script>
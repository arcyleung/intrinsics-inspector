<template>
  <div class="q-pr-sm">
    <q-table class="intrinsics-table" dense title="Intrinsics Explorer" :rows="rows" :columns="columns"
      row-key="intrinsic" :filter="filter" :filter-method="customFilter" :visible-columns="visibleColumns" virtual-scroll
      :virtual-scroll-sticky-size-start="48" :rows-per-page-options="[0]">

      <template v-slot:top>
        <!--           <div class="text-h6">Filter by Columns</div> -->
        <q-toggle v-for="col in columns" v-model="visibleColumns" :val="col.name" :label="col.label"
          :key="col.name"></q-toggle>
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
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" @click="props.expand = !props.expand">
          <q-td auto-width>
            <q-icon @click="props.expand = !props.expand"
              :name="props.expand ? 'sym_o_expand_less' : 'sym_o_expand_more'" />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr class="q-virtual-scroll--with-prev" v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">Arguments:
              <div v-for="param in props.row.parameter"> {{ param.type }} {{ param.varname }}
              </div>
            </div>
            <div class="text-left">Returns: {{ props.row.return.type }} {{ props.row.return.varname }}</div>
            <div class="text-left">Find usages on <a
                :href="`https://github.com/search?q=${props.row.intrinsic}&type=code`">GitHub</a></div>
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
]


onMounted(async () => {
  const intel_intrinsics = await axios.get("/intel_intrinsics.json");
  const arm_intrinsics = await axios.get("/arm_intrinsics.json");
  const intel_json = intel_intrinsics.data;
  const arm_json = arm_intrinsics.data;

  rows.value = []

  // {                                                                                                                                                                                                                                                                                                                                                                                                                                                       
  //   "name": "_addcarryx_u32",                                                                                                                                                                                                                                                                                                                                                                                                                             
  //   "tech": "Other",                                                                                                                                                                                                                                                                                                                                                                                                                                      
  //   "return": {                                                                                                                                                                                                                                                                                                                                                                                                                                           
  //     "etype": "UI8",                                                                                                                                                                                                                                                                                                                                                                                                                                     
  //     "type": "unsigned char",                                                                                                                                                                                                                                                                                                                                                                                                                            
  //     "varname": "dst"                                                                                                                                                                                                                                                                                                                                                                                                                                    
  //   },                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  //   "parameter": [                                                                                                                                                                                                                                                                                                                                                                                                                                        
  //     {                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  //       "etype": "UI8",                                                                                                                                                                                                                                                                                                                                                                                                                                   
  //       "type": "unsigned char",                                                                                                                                                                                                                                                                                                                                                                                                                          
  //       "varname": "c_in"                                                                                                                                                                                                                                                                                                                                                                                                                                 
  //     },                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  //     {                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  //       "etype": "UI32",                                                                                                                                                                                                                                                                                                                                                                                                                                  
  //       "type": "unsigned int",                                                                                                                                                                                                                                                                                                                                                                                                                           
  //       "varname": "a"                                                                                                                                                                                                                                                                                                                                                                                                                                    
  //     },                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  //     {                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  //       "etype": "UI32",                                                                                                                                                                                                                                                                                                                                                                                                                                  
  //       "type": "unsigned int",                                                                                                                                                                                                                                                                                                                                                                                                                           
  //       "varname": "b"                                                                                                                                                                                                                                                                                                                                                                                                                                    
  //     },                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  //     {                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  //       "etype": "UI32",                                                                                                                                                                                                                                                                                                                                                                                                                                  
  //       "memwidth": "32",                                                                                                                                                                                                                                                                                                                                                                                                                                 
  //       "type": "unsigned int *",                                                                                                                                                                                                                                                                                                                                                                                                                         
  //       "varname": "out"                                                                                                                                                                                                                                                                                                                                                                                                                                  
  //     }                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  //   ],                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  //   "description": "Add unsigned 32-bit integers \"a\" and \"b\" with unsigned 8-bit carry-in \"c_in\" (carry or overflow flag), and store the unsigned 32-bit result in \"out\", and the carry-out in \"dst\" (carry or overflow flag).",                                                                                                                                                                                                                
  //   "operation": "\r\ntmp[32:0] := a[31:0] + b[31:0] + (c_in > 0 ? 1 : 0)\r\nMEM[out+31:out] := tmp[31:0]\r\ndst[0] := tmp[32]\r\ndst[7:1] := 0\r\n\t",                                                                                                                                                                                                                                                                                                   
  //   "instruction": [                                                                                                                                                                                                                                                                                                                                                                                                                                      
  //     {                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  //       "form": "r32, r32",                                                                                                                                                                                                                                                                                                                                                                                                                               
  //       "name": "ADCX",                                                                                                                                                                                                                                                                                                                                                                                                                                   
  //       "xed": "ADCX_GPR32d_GPR32d"                                                                                                                                                                                                                                                                                                                                                                                                                       
  //     },                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  //     {                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  //       "form": "r32, r32",                                                                                                                                                                                                                                                                                                                                                                                                                               
  //       "name": "ADOX",                                                                                                                                                                                                                                                                                                                                                                                                                                   
  //       "xed": "ADOX_GPR32d_GPR32d"                                                                                                                                                                                                                                                                                                                                                                                                                       
  //     }                                                                                                                                                                                                                                                                                                                                                                                                                                                   
  //   ],                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  //   "CPUID": "ADX",                                                                                                                                                                                                                                                                                                                                                                                                                                       
  //   "header": "immintrin.h",
  //   "category": "Arithmetic"
  // },
  rows.value = intel_json.map((intrin) => {
    return {
      intrinsic: intrin.name,
      ...intrin
    }
  }).concat(
    
  arm_json.map((intrin) => ({
      intrinsic: intrin.name,
      parameter: intrin.arguments.map(a => { 
        let type, varname;
        [type, varname] = a.split(" ")
        return { type, varname }
      }),
      return: { 
        type: intrin.return_type.return_base_type,
        varname: intrin.return_type.value,
      }
    }))
  
  );


  // {                                                                                                                                                                                                                                                                                                                                                                                                                                                       
//           "SIMD_ISA": "Helium",                                                                                                                                                                                                                                                                                                                                                                                                                           
//           "return_type": {                                                                                                                                                                                                                                                                                                                                                                                                                                
//                 "return_base_type": "float",                                                                                                                                                                                
//                 "element_bit_size": "16",                                                                                                                                                                                   
//                 "value": "float16x8_t"                                                                                                                                                                                      
//           },                                                                                                                                                                                                                
//           "name": "[__arm_]vcreateq_f16",                                                                                                                                                                                   
//           "arguments": [                                                                                                                                                                                                    
//                 "uint64_t a",                                                                                                                                                                                               
//                 "uint64_t b"                                                                                                                                                                                                
//           ],                                                                                                                                                                                                                
//           "description": "Return a vector with where its register representation is the same as the concatenation of the two 64-bit values.",                                                                               
//           "instruction_group": "Vector manipulation|Create vector",                                                                                                                                                         
//           "results": [                                                                                                                                                                                                      
//              {                                                           
//                 "Qd": "result"                                           
//              }                                                           
//           ],                                                             
//           "instructions": [                                              
//              {                                                                                                                                    
//                "preamble": "This intrinsic compiles to the following instructions:",                                                              
//                "list": [                                                 
//                  {                                                       
//                     "base_instruction": "VMOV",                          
//                     "url": "",                                           
//                     "operands": "Qd[2],Qd[0],Rt3,Rt"                     
//                  },                                                      
//                  {                                                       
//                     "base_instruction": "VMOV",
//                     "url": "",                                           
//                     "operands": "Qd[3],Qd[1],Rt4,Rt2"
//                  }                                                       
//                ]                                                         
//              }                                                           
//           ],                                                             
//           "Arguments_Preparation": {
//              "a": {                                                      
//                 "register": "[Rt, Rt2]"
//                 },                                                       
//              "b": {                                                      
//                 "register": "[Rt3, Rt4]"
//                 }                                                        
//           },                                                             
//           "Architectures": [                                                                                  
//                "MVE"           ]                                                                              
// },  

  // rows.value.concat();
})

</script>
<template>
    <el-auto-resizer>
        <template #default="{ height, width }">
            <el-table-v2 fixed :columns="columns" :data="tableData" :width="width" :height="height"
                :expand-column-key="columns[0].key">

                <template #overlay>
                    <div class="el-loading-mask" style="display: flex; align-items: center; justify-content: center">
                        <el-icon class="is-loading" color="var(--el-color-primary)" :size="46">
                            <loading-icon />
                        </el-icon>
                    </div>
                </template>

                <template #row="props">
                    <Row v-bind="props" />
                </template>

            </el-table-v2>
        </template>
    </el-auto-resizer>
</template>

<script lang="jsx" setup>
import { ref } from 'vue'
import { Loading as LoadingIcon, Filter as FilterIcon } from '@element-plus/icons-vue'

const props = defineProps({
  data: []
})

const generateColumns = (length = 10, prefix = 'column-', props) => {
    return Array.from({ length }).map((_, columnIndex) => ({
        ...props,
        key: `${prefix}${columnIndex}`,
        dataKey: `${prefix}${columnIndex}`,
        title: `Column ${columnIndex}`,
        width: 150,
    }))
}

const generateData = (
    columns,
    length = 200,
    prefix = 'row-'
) =>
    Array.from({ length }).map((_, rowIndex) => {
        return columns.reduce(
            (rowData, column, columnIndex) => {
                rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
                return rowData
            },
            {
                id: `${prefix}${rowIndex}`,
                parentId: null,
            }
        )
    })

const columns = generateColumns(props.data)
const tableData = ref(generateData(columns, props.data).map((data) => {
    data.children = [
        {
            id: `${data.id}-detail-content`,
            detail: "Hello world",
        },
    ]
    return data
})
)

const shouldFilter = ref(false)
const popoverRef = ref()

const onFilter = () => {
  popoverRef.value.hide()
  if (shouldFilter.value) {
    data.value = generateData(columns, 100, 'filtered-')
  } else {
    data.value = generateData(columns, 200)
  }
}

const onReset = () => {
  shouldFilter.value = false
  onFilter()
}


const Row = ({ cells, rowData }) => {
    if (rowData.detail) return <div class="p-6">{rowData.detail}</div>
    return cells
}

Row.inheritAttrs = false

columns[0].headerCellRenderer = (props) => {
  return (
    <div class="flex items-center justify-center">
      <span class="mr-2 text-xs">{props.column.title}</span>
      <ElPopover ref={popoverRef} trigger="click" {...{ width: 200 }}>
        {{
          default: () => (
            <div class="filter-wrapper">
              <div class="filter-group">
                <ElCheckbox v-model={shouldFilter.value}>
                  Filter Text
                </ElCheckbox>
              </div>
              <div class="el-table-v2__demo-filter">
                <ElButton text onClick={onFilter}>
                  Confirm
                </ElButton>
                <ElButton text onClick={onReset}>
                  Reset
                </ElButton>
              </div>
            </div>
          ),
          reference: () => (
            <ElIcon class="cursor-pointer">
              <Filter />
            </ElIcon>
          ),
        }}
      </ElPopover>
    </div>
  )
}

</script>
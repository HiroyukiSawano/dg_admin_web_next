<template>

    <el-row :gutter="16">
      <el-col :lg="12">
        <el-card header="表格选择器多选">
          <ec-table-select
            v-model="value"
            :data="datas"
            :height="274"
            :props="props"
            :loading="loading"
            multiple
            clearable
            @visible="handleSelectVisible"
            @change="handleSelectChange">
            <template #header>
              <el-input v-model="forms.name" placeholder="" style="margin-bottom: 12px;">
                <template #suffix>
                  <i class="ri-search-2-line"></i>
                </template>
              </el-input>
            </template>
            <template #table>
              <el-table-column prop="name" label="姓名" width="120"></el-table-column>
              <el-table-column prop="time" label="注册时间" width=""></el-table-column>
            </template>
            <template #footer>
              <el-pagination
                style="margin-top: 12px;"
                class="justify-content-center"
                v-model:current-page="pages.currentPage"
                background
                layout="prev, pager, next"
                size="small"
                :page-size="pages.pageSize"
                :total="pages.total"
                @current-change="handlePaginationCurrentChange"
              />
            </template>
          </ec-table-select>
        </el-card>
      </el-col>
      <el-col :lg="12">
        <el-card header="表格选择器单选">
          <ec-table-select v-model="value2" :data="datas" :height="288" :props="props" clearable>
            <template #table>
              <el-table-column prop="id" label="ID" width="240" />
              <el-table-column prop="name" label="姓名" />
            </template>
          </ec-table-select>
        </el-card>
      </el-col>
    </el-row>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import EcTableSelect from '@/components/EcTableSelect'
defineOptions({ name: 'vabTableSelect' })
const pages = ref({
  currentPage: 1,
  pageSize: 10,
  total: 17
})
const forms = ref({
  name: '',
  sex: ''
})
const examples = ref([
  { id: '610000197405112197', name: '万霞', time: '2002-11-17 01:38:23' },
  { id: '110000199609175414', name: '孟勇', time: '1973-08-20 01:06:29' },
  { id: '610000202102055088', name: '赵涛', time: '1987-04-27 08:26:04' },
  { id: '23000020171216127X', name: '刘霞', time: '1988-03-05 17:12:17' },
  { id: '500000201201104797', name: '韩磊', time: '1994-09-18 02:27:29' },
  { id: '410000197410094571', name: '范军', time: '1993-08-25 02:23:47' },
  { id: '350000198202192407', name: '董静', time: '1997-08-28 19:48:50' },
  { id: '640000200312132578', name: '锺秀英', time: '1993-01-15 01:20:45' },
  { id: '620000202201097306', name: '阎艳', time: '1978-10-21 16:37:55' },
  { id: '130000202403213671', name: '赖军', time: '2007-08-14 11:02:51' },
  { id: '14000020180321649X', name: '吕磊', time: '2011-11-20 00:27:32' },
  { id: '340000201505105043', name: '尹静', time: '2022-05-05 06:07:21' },
  { id: '650000198310287025', name: '史娟', time: '2010-09-12 05:54:57' },
  { id: '43000019880220845X', name: '赵杰', time: '2001-12-04 04:46:25' },
  { id: '710000202402256483', name: '尹芳', time: '1978-11-23 14:06:42' },
  { id: '620000197902063260', name: '曹芳', time: '1983-12-18 20:57:37' },
  { id: '520000197007171472', name: '姜平', time: '1988-01-15 23:44:21' },
])
const loading = ref(false)
const datas = computed(() => {
  const start = (pages.value.currentPage - 1) * pages.value.pageSize
  const end = start + pages.value.pageSize
  return examples.value.slice(start, end)
})
const value = ref([
  { id: '610000197405112197', name: '万霞' },
  { id: '110000199609175414', name: '孟勇' },
])
const value2 = ref({ id: "610000197405112197", name: "万霞" })
const props = ref({
  label: 'name',
  value: 'id',
})

const handlePaginationCurrentChange = async (val) => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
}
const handleSelectChange = (val) => {
  console.log(val)
}


const handleSelectVisible = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
}
onMounted(()=> {
})
</script>

<style lang="scss" scoped>

</style>

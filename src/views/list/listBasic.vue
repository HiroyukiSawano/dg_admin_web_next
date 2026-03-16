<template>
    <el-card>
      <el-form :model="forms" ref="formsRef" inline>
        <el-form-item label="项目名称" prop="keyword">
          <el-input v-model="forms.keyword" placeholder="输入关键字搜索" />
        </el-form-item>
        <el-form-item label="项目状态" prop="status">
          <el-select v-model="forms.status" placeholder="请选择事项状态">
            <el-option label="不限" value="" />
            <el-option label="进行中" value="0" />
            <el-option label="已完成" value="1" />
            <el-option label="已删除" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
      <el-button class="width-100">新建</el-button>
      <ec-list-basic :data="lists" />
      <el-pagination background :layout="device === 'mobile' ? 'total, sizes, prev, next' : 'total, prev, pager, next, sizes'" :total="100" />
    </el-card>

</template>
<script setup>
import EcListBasic from '@/components/EcListBasic'
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/modules/systemStore'
defineOptions({ name: 'ListBasic' })
const { proxy } = getCurrentInstance()
const { device } = storeToRefs(useSystemStore())
const route = useRoute()
const forms = ref({
  keyword: '',
  status: ''
})
const formsRef = ref(null)
const lists = ref([
  {
    code: '1',
    name: '广州市一体化在线政务服务平台',
    info: '涵盖统一申办、统一预约、统一审批、统一好差评、工程建设、一件事等业务的一体化政务服务平台项目',
    sponsor: '李伟',
    start: '2020-07-28 14:00:00',
    progress: 50,
    status: '0',
    cover: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  },
  {
    code: '2',
    name: '重庆市政务服务网',
    info: '重庆渝快办网上办事平台',
    sponsor: '杨千玺',
    start: '2020-09-01 08:00:00',
    progress: 10,
    status: '1',
    cover: 'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  },
  {
    code: '3',
    name: '呼和浩特新城区新连心平台',
    info: '12345热线智能派单系统',
    sponsor: '高博',
    start: '2021-05-31 12:00:00',
    progress: 80,
    status: '2',

  },
  {
    code: '4',
    name: '漳州证照百科系统',
    info: '证照查询、办理指南、地图导引',
    sponsor: '李国生',
    start: '2021-06-01 08:00:00',
    progress: 5,
    status: '1',

  },
  {
    code: '5',
    name: '日照智能大厅项目',
    info: '日照政务服务大厅建设项目',
    sponsor: '朱涛',
    start: '2016-07-28 14:00:00',
    progress: 50,
    status: '1',
    cover: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
  },
  {
    code: '6',
    name: '广州市一体化在线政务服务平台',
    info: '涵盖统一申办、统一预约、统一审批、统一好差评、工程建设、一件事等业务的一体化政务服务平台项目',
    sponsor: '李伟',
    start: '2020-07-28 14:00:00',
    progress: 50,
    status: '2',
  },
  {
    code: '7',
    name: '重庆市政务服务网',
    info: '重庆渝快办网上办事平台',
    sponsor: '杨千玺',
    start: '2020-09-01 08:00:00',
    progress: 10,
    status: '0',
    cover: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',

  },
  {
    code: '8',
    name: '呼和浩特新城区新连心平台',
    info: '12345热线智能派单系统',
    sponsor: '高博',
    start: '2021-05-31 12:00:00',
    progress: 80,
    status: '0',
  },
  {
    code: '9',
    name: '漳州证照百科系统',
    info: '证照查询、办理指南、地图导引',
    sponsor: '李国生',
    start: '2021-06-01 08:00:00',
    progress: 5,
    status: '2',
    cover: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  },
  {
    code: '10',
    name: '日照智能大厅项目',
    info: '日照政务服务大厅建设项目',
    sponsor: '朱涛',
    start: '2016-07-28 14:00:00',
    progress: 50,
    status: '0',
  }
])
</script>

<style lang="scss" scoped>
.el-form.el-form--inline {
  margin: -8px -8px 8px -8px;
  .el-form-item {
    margin: 0;
    padding: 8px;
  }
  .el-input,
  .el-select {
    width: 240px;
  }
}
.el-pagination {
  justify-content: center;
  margin-top: 16px;
}
@media only screen and (max-width: 991px) {
  :deep(.el-form.el-form--inline) {
    flex-direction: column;
    .el-form-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      .el-form-item__content {
        width: 100%;
      }
    }
    .el-input,
    .el-select {
      width: 100%;
    }
    .el-button {
      flex: 1;
    }
  }
}
</style>

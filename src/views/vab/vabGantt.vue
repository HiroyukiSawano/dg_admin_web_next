<template>
  <div class="el-page">
    <el-card>
      <gantt :data="data" :date-range-list="dateRangeList" date-text="日期" item-text="项目" @schedule-click="scheduleClick" />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'
import Gantt from 'vue3-gantt'
import 'vue3-gantt/dist/style.css'

defineOptions({
  name: 'vabGantt',
})

const dateRangeList = ref(['2023-01-01', '2023-02-28'])
const data = ref([
  {
    type: 'normal',
    color: '',
    name: 'project1',
    schedule: [
      {
        id: uuidv4(),
        name: 'test1',
        desc: 'test1',
        backgroundColor: '#e6a23c',
        textColor: 'var(--el-color-white)',
        days: ['2023-01-01', '2023-01-05'],
      },
    ],
  },
  {
    type: 'normal',
    color: '',
    name: 'project2',
    schedule: [
      {
        id: uuidv4(),
        name: 'test2',
        desc: 'test2',
        backgroundColor: '#13ce66',
        textColor: 'var(--el-color-white)',
        days: ['2023-01-05', '2023-01-10'],
      },
    ],
  },
  {
    type: 'normal',
    color: '',
    name: 'project3',
    schedule: [
      {
        id: uuidv4(),
        name: 'test3',
        desc: 'test3',
        backgroundColor: '#4e88f3',
        textColor: 'var(--el-color-white)',
        days: ['2023-01-02', '2023-01-20'],
      },
    ],
  },
  {
    type: 'normal',
    color: '',
    name: 'project4',
    schedule: [
      {
        id: uuidv4(),
        name: 'test4',
        desc: 'test4',
        backgroundColor: '#6954f0',
        textColor: 'var(--el-color-white)',
        days: ['2023-01-08', '2023-01-31'],
      },
    ],
  },
  {
    type: 'normal',
    color: '',
    name: 'project5',
    schedule: [
      {
        id: uuidv4(),
        name: 'test5',
        desc: 'test5',
        backgroundColor: '#fd4e4e',
        textColor: 'var(--el-color-white)',
        days: ['2023-01-04', '2023-01-15'],
      },
    ],
  },
])

const scheduleClick = (object) => {
  ElMessage({
    message: `您点击了${object.name}`,
    type: 'success',
    plain: true,
  })
}
</script>

<style lang="scss" scoped>
.el-page {
  // height: 400px;
}
.el-card {
  height: 500px;
  .el-card__body {

  }
}
:deep() {
  .gantt {
    --border: 1px solid var(--el-border-color);
    --fontColor: var(--el-color-grey);
    --borderColor: var(--el-border-color);
    max-width: 100%;
    overflow: auto;
    .guide {
      .desc {
        .date {
          top: 30px;
          right: 30px;
        }

        .item {
          bottom: 30px;
          left: 30px;
        }
      }
    }

    .inner {
      flex-shrink: 0;
      width: auto;
      overflow: hidden;

      .work-desc {
        display: flex !important;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>

<template>
  <el-card>
    <el-form inline :model="tableForm" style="padding-bottom: 16px;">
      <el-form-item label="" prop="keyword">
          <el-input v-model="tableForm.keyword" placeholder="请输入图书名称查询" style="width:176px;" />
        </el-form-item>
        <el-form-item label="" prop="keyword">
          <el-select v-model="tableForm.status" placeholder="请选择图书发布状态" style="width:176px;">
            <el-option label="未发布" value="0"></el-option>
            <el-option label="已发布" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="margin-right-auto">
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      <el-form-item>
        <el-button :disabled="tableSelection.length === 0" @click="tableBatchDelete">批量删除</el-button>
        <el-button type="primary" @click="tableAdd">弹窗新增</el-button>
        <el-button type="primary" @click="tableAddPage">页面新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" row-key="id" v-loading="tableLoading" @selection-change="tableSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="图书名称" width="160">
        <template #default="{ row }">
          <el-link type="primary" underline="never">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="图书内容摘要" prop="remark" min-width="400" />
      <el-table-column show-overflow-tooltip label="图书作者" prop="author" width="160" />
      <el-table-column label="图书星级" width="160">
        <template #default="{ row }">
          <el-rate
            v-model="row.rate"
            :icons="['ri-star-s-fill', 'ri-star-s-fill', 'ri-star-s-fill']"
            disabled-void-icon="ri-star-s-fill"
            void-icon="ri-star-s-fill"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="图书状态" prop="status" width="160">
        <template #default="{ row}">
          <el-tag type="info" v-if="row.status === '0'">待发布</el-tag>
          <el-tag type="success" v-if="row.status === '1'">已发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="发行日期" prop="date" width="240" />
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" link @click="tableDetail(row)">详情</el-button>
          <el-button type="primary" link @click="tableEdit(row)">编辑</el-button>
          <el-button type="primary" link @click="tableDelete(row)">删除</el-button>
          <el-dropdown>
            <el-button type="primary" link>页面</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="tableDetailPage(row)">页面详情</el-dropdown-item>
                <el-dropdown-item @click="tableEditPage(row)">页面编辑</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="tablePagination.currentPage"
      background
      :layout="tablePagination.layout"
      :total="tablePagination.total"
      :page-size="tablePagination.pageSize"
      :page-sizes="tablePagination.pageSizes"
      @current-change="paginationCurrentChange"
      @update:page-size="paginationPageSizeChange"
    />
  </el-card>
  <dialog-table-operate-edit ref="tableDialogEditRef" @update="tableUpdate" />
</template>
<script setup>
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import DialogTableOperateEdit from './components/DialogTableOperateEdit'
import { ElMessageBox, ElNotification, ElMessage } from 'element-plus'
const router = useRouter()
const tableLoading = ref(false)
const tableForm = ref({
  keyword: '',
  status: '',
})

const tableData = ref([
  {
    id: '1xb8n15z-a12g-ywcz-631t-518ram9yyjps',
    name: '时间简史',
    author: '史蒂芬·霍金',
    publisher: '湖南科学技术出版社',
    date: '2010-04-08 00:00:00',
    price: '45.00元',
    rate: 5,
    status: '1',
    cover: 'https://img2.doubanio.com/view/subject/s/public/s1914861.jpg',
    remark: '遨游外层空间奇异领域初步了解狭义相对论以及时间、宇宙的起源等宇宙学的奥妙'
  },
    {
    id: 'lwqb4zy4-52hx-3ulg-go0k-lfpcnmwsxbmp',
    name: '格林童话全集',
    author: '格林兄弟',
    publisher: '人民文学出版社',
    date: '1994-11-25 00:00:00',
    price: '21.45元',
    rate: 2,
    status: '0',
    cover: 'https://img2.doubanio.com/view/subject/s/public/s1134341.jpg',
    remark: '丰富的想象、优美的语言讲述神奇而又浪漫的童话故事'
  },
  {
    id: 'p878dp5g-bdnb-k9e5-cure-yw5sshwv4w9u',
    name: '理想国',
    author: '柏拉图',
    publisher: '商务印书馆',
    date: '1986-08-18 00:00:00',
    price: '28.00元',
    rate: 4,
    status: '1',
    cover: 'https://img1.doubanio.com/view/subject/s/public/s34157889.jpg',
    remark: '以对话体形式探讨正义与城邦治理的哲学经典，并通过政体设计阐述真善美统一的理想社会'
  },
  {
    id: '1zxjwghf-w7ag-5flj-gcg0-0ahsq3powopt',
    name: '撒哈拉的故事',
    author: '陈懋平',
    publisher: '哈尔滨出版社',
    date: '2003-06-25 00:00:00',
    price: '15.80元',
    rate: 3,
    status: '0',
    cover: 'https://img9.doubanio.com/view/subject/s/public/s1020454.jpg',
    remark: '三毛和荷西在撒哈拉沙漠生活时的所见所闻，以及与当地相识的朋友的故事'
  },

  {
    id: 'b8vigbei-2on6-9glz-kzb3-qnfqx6bhjsf8',
    name: '四世同堂',
    author: '老舍',
    publisher: '北京十月文艺出版社',
    date: '2008-07-02 00:00:00',
    price: '36.00元',
    rate: 5,
    status: '1',
    cover: 'https://img3.doubanio.com/view/subject/s/public/s3424257.jpg',
    remark: '一部表现抗战北平沦陷区普通民众生活与抗战的长篇小说'
  },
  {
    id: 'zcrtb48r-v2jj-qidt-ybrp-3pmjz5qakey7',
    name: '基地三部曲',
    author: '艾萨克·阿西莫夫',
    publisher: '江苏凤凰文艺出版社',
    date: '2015-10-01 00:00:00',
    price: '328.00元',
    rate: 2,
    status: '1',
    cover: 'https://img9.doubanio.com/view/subject/s/public/s28284246.jpg',
    remark: '荒凉行星建立基地成为未来世代人类的希望灯塔'
  },
  {
    id: '3nnsnaud-4iao-rl95-9m2j-wubr1sifz6b7',
    name: '雷雨',
    author: '曹禺',
    publisher: '人民文学出版社',
    date: '1999-05-05 00:00:00',
    price: '9.20',
    rate: 3,
    status: '0',
    cover: 'https://img3.doubanio.com/view/subject/s/public/s23579217.jpg',
    remark: '二十四小时内，集中展开了周鲁两家三十年的恩怨情仇'
  },
  {
    id: 'ra2yso39-9ol6-9nmq-kv67-p9bkv7gsajda',
    name: '万历十五年',
    author: '黄仁宇',
    publisher: '生活·读书·新知三联书店',
    date: '1997-05-25 00:00:00',
    price: '18.00元',
    rate: 1,
    status: '1',
    cover: 'https://img9.doubanio.com/view/subject/s/public/s1800355.jpg',
    remark: '运用历史小说的叙事模式和传记体式的章节，通过对关键历史人物悲惨命运的描述，探析了晚明帝国走向衰落的深刻原因'
  },
  {
    id: 'wdy4mdqc-tofa-pd5n-7jzm-c0d23awgcams',
    name: '荒原狼',
    author: '黑塞',
    publisher: '上海译文出版社',
    date: '2008-07-08 00:00:00',
    price: '13.00',
    rate: 4,
    status: '0',
    cover: 'https://img1.doubanio.com/view/subject/s/public/s3286369.jpg',
    remark: '通过对个人精神疾病的讲述，展示出现代社会中人性遭到分裂的恶果'
  },
  {
    id: 'dpuw6l9f-coio-uouo-74hl-b40biqdo3a0u',
    name: '银河系漫游指南',
    author: '道格拉斯·亚当斯',
    publisher: '四川科学技术出版社',
    date: '2005-06-14 00:00:00',
    price: '16.00元',
    rate: 2,
    status: '0',
    cover: 'https://img1.doubanio.com/view/subject/s/public/s3696740.jpg',
    remark: '亚当斯为我们打开了一扇通往宇宙的窗户'
  },
    {
    id: 't9r5r900-si88-1vms-30fr-hs784eoxxlay',
    name: '明朝那些事儿',
    author: '当年明月',
    publisher: '中国海关出版社',
    date: '2009-04-12 00:00:00',
    price: '358.20元',
    rate: 5,
    status: '1',
    cover: 'https://img9.doubanio.com/view/subject/s/public/s3745215.jpg',
    remark: '以史料为基础，以年代和具体人物为主线，并加入了小说的笔法，语言幽默风趣'
  },
  {
    id: 'ih7f0rdg-k31x-vfuz-g7h2-gx7p6ega1mp5',
    name: '古文观止',
    author: '吴楚材',
    publisher: '中华书局',
    date: '1987-01-01 00:00:00',
    price: '21.00元',
    rate: 4,
    status: '0',
    cover: 'https://img3.doubanio.com/view/subject/s/public/s1325863.jpg',
    remark: '选文皆为语言精炼、短小精悍、便于传诵的佳作'
  },
])
const tableFetchData = async () => {
  tableLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  tableLoading.value = false
}

const tableAddPage = () => {
  router.push({
    path: '/table/tableOperate/tableOperateDetail',
    query: {
      mode: 'add'
    }
  })
}
const tableDialogEditRef = ref(null)
// 表格数据添加
const tableAdd = () => {
  tableDialogEditRef.value.open('add')
}
// 表格数据编辑
const tableEdit = (row) => {
  tableDialogEditRef.value.open('edit', row)
}
const tableEditPage = (row) => {
  router.push({
    path: '/table/tableOperate/tableOperateDetail',
    query: {
      mode: 'edit',
      id: row.id
    }
  })
}
// 表格数据详情
const tableDetail = (row) => {
  tableDialogEditRef.value.open('detail', row)
}
const tableDetailPage = (row) => {
  router.push({
    path: '/table/tableOperate/tableOperateDetail',
    query: {
      mode: 'detail',
      id: row.id
    }
  })
}
// 表格数据更新
const tableUpdate = (row) => {
  dataUpdateKey(row)
  tableFetchData()
}
// 表格删除
const tableDelete = (row) => {
  dataRemoveKey(row)
  ElMessageBox.confirm(`确定删除当前数据吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '删除',
    confirmButtonClass: 'el-button--danger',
  })
  .then(async () => {
    dataRemoveKey(row.id)
    ElMessage.success('操作成功！')
    tableFetchData()
  })
  .catch(() => {})
}
// 表格批量删除
const tableBatchDelete = async () => {
  ElMessageBox.confirm(`确定删除选中的 ${tableSelection.value.length} 项吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '删除',
    confirmButtonClass: 'el-button--danger',
  })
  .then(async () => {
    const ids = tableSelection.value.map((v) => v.id)
    dataRemoveKeys(ids)
    ElMessage.success('操作成功！')
    tableFetchData()
  })
  .catch(() => {})
}
// 表格多选
const tableSelection = ref([])
const tableSelectionChange = (selection) => {
  tableSelection.value = selection
}
// 分页操作
const tablePagination = ref({
  layout: 'total, prev, pager, next, sizes',
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 30, 40, 50],
  total: 1000,
})

const paginationCurrentChange = (page) => {
  tablePagination.value.currentPage = page
  tableFetchData()
}
const paginationPageSizeChange = (size) => {
  tablePagination.value.pageSize = size
  tableFetchData()
}

// 插入行 unshiftRow
const dataUnshiftRow = (row) => {
  tableData.value.unshift(row)
}
// 插入行 pushRow
const dataPushRow = (row) => {
  tableData.value.push(row)
}
// 根据key覆盖数据
const dataUpdateKey = (row, _key = 'id') => {
  tableData.value.filter((item) => item[_key] === row[_key]).forEach((item) => {
    Object.assign(item, row)
  })
}
// 根据index覆盖数据
const dataUpdateIndex = (row, index) => {
  Object.assign(tableData.value[index], row)
}
// 根据index删除
const dataRemoveIndex = (index) => {
  tableData.value.splice(index, 1)
}
// 根据index批量删除
const dataRemoveIndexs = (indexs = []) => {
  indexs.forEach((index) => {
    tableData.value.splice(index, 1)
  })
}
// 根据key删除
const dataRemoveKey = (key, _key = 'id') => {
  tableData.value.splice(tableData.value.findIndex((item) => item[_key] === key), 1)
}
// 根据keys批量删除
const dataRemoveKeys = (keys = [], _key = 'id') => {
  keys.forEach((key) => {
    tableData.value.splice(tableData.value.findIndex((item) => item[_key] === key), 1)
  })
}

</script>
<style lang="scss" scoped>

.el-pagination {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>

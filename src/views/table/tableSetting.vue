<template>
  <el-card>
    <el-form :model="tableForm" inline>
      <el-form-item>
        <el-popover title="同源筛选" width="320" trigger="click" placement="bottom-start" :show-arrow="false" :teleported="false">
          <template #reference>
            <el-button>同源筛选项目<el-icon class="el-icon--right"><ElIconArrowDown /></el-icon></el-button>
          </template>
          <div class="el-popover__content">
            <el-select v-model="tableForm.singleness" placeholder="请选择筛选项目" multiple clearable :show-arrow="false" :teleported="false">
              <el-option label="已超期项" value="1" />
              <el-option label="延期待审批" value="2" />
              <el-option label="相对最早持有成本" value="3" />
              <el-option label="最早时间" value="4" />
              <el-option label="具有态势全面感知" value="5" />
            </el-select>
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item>
        <el-popover title="复合筛选" width="480" trigger="click" placement="bottom-start" :show-arrow="false">
          <template #reference>
            <el-button icon="">复合筛选项目<el-icon class="el-icon--right"><ElIconArrowDown /></el-icon></el-button>
          </template>
          <div class="el-popover__content">
            <el-form :model="tableForm" label-position="top" label-width="auto">
              <el-form-item label="普通输入框">
                <el-input v-model="tableForm.input" placeholder="请输入关键字" />
              </el-form-item>
              <el-form-item label="选择框">
                <el-select v-model="tableForm.select" placeholder="请选择选项">
                  <el-option label="选项一" value="1" />
                  <el-option label="选项二" value="2" />
                  <el-option label="选项三" value="3" />
                </el-select>
              </el-form-item>
              <el-form-item label="时间范围">
                <el-date-picker v-model="tableForm.datepicker" type="daterange" range-separator="至" start-placeholder="选择开始日期" end-placeholder="选择结束日期" />
              </el-form-item>
              <el-form-item label="复选框">
                <el-checkbox-group v-model="tableForm.checkbox">
                  <el-checkbox label="场地处理" value="1" />
                  <el-checkbox label="回收" value="2" />
                  <el-checkbox label="焚烧销毁" value="3" />
                  <el-checkbox label="其他" value="4" />
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="单选框">
                <el-radio-group v-model="tableForm.radio">
                  <el-radio label="已处理" value="1" />
                  <el-radio label="已回收" value="2" />
                  <el-radio label="已销毁" value="3" />
                  <el-radio label="其他" value="4" />
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item>
        <el-popover title="动态筛选配置" width="320" trigger="click" placement="bottom-start" :teleported="false" :show-arrow="false">
          <template #reference>
            <el-button>动态筛选配置<el-icon class="el-icon--right"><ElIconArrowDown /></el-icon></el-button>
          </template>
          <div class="el-popover__content">
            <el-select v-model="tableForm.components" multiple clearable :show-arrow="false" :teleported="false">
              <el-option label="普通输入框" value="input" />
              <el-option label="下拉选择" value="select" />
              <el-option label="级联选择器" value="cascader" />
              <el-option label="复选框" value="checkbox" />
              <el-option label="单选框" value="radio" />
              <el-option label="日期范围选择器" value="datepicker" />
            </el-select>
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item v-if="tableForm.components.includes('input')">
        <el-input v-model="tableForm.input" placeholder="请输入内容" style="width: 176px;" />
      </el-form-item>
      <el-form-item v-if="tableForm.components.includes('select')">
        <el-select v-model="tableForm.select" placeholder="请选择选项" style="width: 176px;">
          <el-option label="选项一" value="1" />
          <el-option label="选项二" value="2" />
          <el-option label="选项三" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="tableForm.components.includes('cascader')">
        <el-cascader v-model="tableForm.cascader" :options="regionData" :props="{ expandTrigger: 'hover' }" clearable style="width: 176px;" />
      </el-form-item>
      <el-form-item v-if="tableForm.components.includes('datepicker')">
        <el-date-picker v-model="tableForm.datepicker" type="daterange" range-separator="至" start-placeholder="选择开始日期"
          end-placeholder="选择结束日期" style="width: 352px;" />
      </el-form-item>
      <el-form-item v-if="tableForm.components.includes('checkbox')">
        <el-checkbox-group v-model="tableForm.checkbox">
          <el-checkbox value="1" label="场地处理" />
          <el-checkbox value="2" label="回收" />
          <el-checkbox value="3" label="焚烧销毁" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="tableForm.components.includes('radio')">
        <el-radio-group v-model="tableForm.radio">
          <el-radio value="1" label="已处理" />
          <el-radio value="2" label="已回收" />
        </el-radio-group>
      </el-form-item>
      <el-form-item class="margin-right-auto">
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">主操作</el-button>
        <el-button>操作</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="ri-download-line" style="padding: 8px;" />
        <el-popover title="显示列设置" width="640" trigger="click" placement="bottom-end" :show-arrow="false">
          <template #reference>
            <el-button icon="ri-equalizer-3-line" style="padding: 8px;" />
          </template>
          <div class="el-popover__content">
            <el-table ref="tableColumnRef" :data="tableColumn">
              <el-table-column width="40">
                <el-button link class="sortable-move" icon="ri-draggable" style="cursor: move" />
              </el-table-column>
              <el-table-column prop="label" label="名称"></el-table-column>
              <el-table-column prop="hide" label="显示" width="80">
                <template #default="{ row }">
                  <el-switch v-model="row.hide" :active-value="false" :inactive-value="true" />
                </template>
              </el-table-column>

              <el-table-column prop="sortable" label="排序" width="80">
                <template #default="{ row }">
                  <el-switch v-model="row.sortable" />
                </template>
              </el-table-column>
              <el-table-column prop="fixed" label="固定列" width="80">
                <template #default="{ row }">
                  <el-switch v-model="row.fixed" />
                </template>
              </el-table-column>
              <el-table-column prop="width" label="宽度" width="112">
                <template #default="{ row }">
                  <el-input v-model="row.width" />
                </template>
              </el-table-column>
              <el-table-column prop="minWidth" label="最小宽度" width="112">
                <template #default="{ row }">
                  <el-input v-model="row.minWidth" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-popover>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" row-key="id">
      <el-table-column type="selection" width="50" align="center" />
      <template v-for="item in tableColumn">
        <el-table-column
          v-if="!item.hide"
          :key="item.prop"
          :column-key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          :min-width="item.minWidth"
          :sortable="item.sortable"
          :fixed="item.fixed?'left':false"
          :show-overflow-tooltip="item.showOverflowTooltip"
        >
          <template #default="{ row}">
            <template v-if="item.prop === 'name'">
              <el-link type="primary" underline="never">{{ row.name }}</el-link>
            </template>
            <template v-else-if="item.prop === 'status'">
              <el-tag type="info" v-if="row.status === 0">待审核</el-tag>
              <el-tag type="success" v-if="row.status === 1">已完成</el-tag>
              <el-tag type="primary" v-if="row.status === 2">审核中</el-tag>
              <el-tag type="danger" v-if="row.status === 3">已驳回</el-tag>
            </template>
            <template v-else-if="item.prop === 'rate'">
              <el-rate
                v-model="row.rate"
                :icons="['ri-star-s-fill', 'ri-star-s-fill', 'ri-star-s-fill']"
                disabled-void-icon="ri-star-s-fill"
                void-icon="ri-star-s-fill"
                disabled
              />
            </template>
            <template v-else>
              {{ row[item.prop] }}
            </template>
          </template>
        </el-table-column>
      </template>
      <el-table-column min-width="1" />
      <el-table-column :fixed="tableOperationFixed ? 'right' : false" label="操作" width="140">
        <template #header>
          <el-checkbox v-model="tableOperationFixed" label="固定列" true-value="right" />
        </template>
        <template #default="{ row }">
          <el-button type="primary" link>操作</el-button>
          <el-dropdown>
            <el-button type="primary" link>其他</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>操作</el-dropdown-item>
                <el-dropdown-item>操作</el-dropdown-item>
                <el-dropdown-item disabled>操作</el-dropdown-item>
                <el-dropdown-item>操作</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="justify-content-end" background layout="total, prev, pager, next, sizes" :total="1000" style="margin-top: 16px" />
  </el-card>
</template>
<script setup>
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import { regionData } from 'element-china-area-data'
import Sortable from 'sortablejs'
defineOptions({ name: 'tableSetting' })

const tableForm = ref({
  keyword: '',
  singleness: [],
  components: ['input'],
  input: '',
  select: '',
  cascader: [],
  datepicker: '',
  checkbox: [],
  radio: ''
})
const tableColumn = ref([
  { label: '图书', prop: 'name', width: '160', minWidth: 'auto', sortable: true },
  { label: '图书摘要', prop: 'remark', width: 'auto', minWidth: '400', sortable: true, showOverflowTooltip: true },
  { label: '图书作者', prop: 'author', width: '160', minWidth: 'auto', sortable: true },
  { label: '图书评星', prop: 'rate', width: '160', minWidth: 'auto', sortable: true },
  { label: '状态', prop: 'status', width: '160', minWidth: 'auto', sortable: true, filters: [{ text: '已驳回', value: 3 }, { text: '审核中', value: 2 }, { text: '已完成', value: 1 }, { text: '待审核', value: 0 }] },
  { label: '日期', prop: 'date', width: '240', minWidth: 'auto', sortable: true }
])
const tableData = ref([
  {
    id: 99,
    name: "时间简史",
    author: "史蒂芬·霍金",
    publisher: "湖南科学技术出版社",
    date: "2010-04-08 00:00:00",
    price: "45.00元",
    rate: 5,
    status: 1,
    cover: "https://img2.doubanio.com/view/subject/s/public/s1914861.jpg",
    remark: "遨游外层空间奇异领域初步了解狭义相对论以及时间、宇宙的起源等宇宙学的奥妙"
  },
    {
    id: 52,
    name: "格林童话全集",
    author: "格林兄弟",
    publisher: "人民文学出版社",
    date: "1994-11-25 00:00:00",
    price: "21.45元",
    rate: 2,
    status: 2,
    cover: "https://img2.doubanio.com/view/subject/s/public/s1134341.jpg",
    remark: "丰富的想象、优美的语言讲述神奇而又浪漫的童话故事"
  },
  {
    id: 138,
    name: "理想国",
    author: "柏拉图",
    publisher: "商务印书馆",
    date: "1986-08-18 00:00:00",
    price: "28.00元",
    rate: 4,
    status: 3,
    cover: "https://img1.doubanio.com/view/subject/s/public/s34157889.jpg",
    remark: "以对话体形式探讨正义与城邦治理的哲学经典，并通过政体设计阐述真善美统一的理想社会"
  },
  {
    id: 75,
    name: "撒哈拉的故事",
    author: "陈懋平",
    publisher: "哈尔滨出版社",
    date: "2003-06-25 00:00:00",
    price: "15.80元",
    rate: 3,
    status: 0,
    cover: "https://img9.doubanio.com/view/subject/s/public/s1020454.jpg",
    remark: "三毛和荷西在撒哈拉沙漠生活时的所见所闻，以及与当地相识的朋友的故事"
  },

  {
    id: 60,
    name: "四世同堂",
    author: "老舍",
    publisher: "北京十月文艺出版社",
    date: "2008-07-02 00:00:00",
    price: "36.00元",
    rate: 5,
    status: 1,
    cover: "https://img3.doubanio.com/view/subject/s/public/s3424257.jpg",
    remark: "一部表现抗战北平沦陷区普通民众生活与抗战的长篇小说"
  },
  {
    id: 133,
    name: "基地三部曲",
    author: "艾萨克·阿西莫夫",
    publisher: "江苏凤凰文艺出版社",
    date: "2015-10-01 00:00:00",
    price: "328.00元",
    rate: 2,
    status: 1,
    cover: "https://img9.doubanio.com/view/subject/s/public/s28284246.jpg",
    remark: "荒凉行星建立基地成为未来世代人类的希望灯塔"
  },
  {
    id: 137,
    name: "雷雨",
    author: "曹禺",
    publisher: "人民文学出版社",
    date: "1999-05-05 00:00:00",
    price: "9.20",
    rate: 3,
    status: 0,
    cover: "https://img3.doubanio.com/view/subject/s/public/s23579217.jpg",
    remark: "二十四小时内，集中展开了周鲁两家三十年的恩怨情仇"
  },
  {
    id: 42,
    name: "万历十五年",
    author: "黄仁宇",
    publisher: "生活·读书·新知三联书店",
    date: "1997-05-25 00:00:00",
    price: "18.00元",
    rate: 1,
    status: 3,
    cover: "https://img9.doubanio.com/view/subject/s/public/s1800355.jpg",
    remark: "运用历史小说的叙事模式和传记体式的章节，通过对关键历史人物悲惨命运的描述，探析了晚明帝国走向衰落的深刻原因"
  },
  {
    id: 142,
    name: "荒原狼",
    author: "黑塞",
    publisher: "上海译文出版社",
    date: "2008-07-08 00:00:00",
    price: "13.00",
    rate: 4,
    status: 2,
    cover: "https://img1.doubanio.com/view/subject/s/public/s3286369.jpg",
    remark: "通过对个人精神疾病的讲述，展示出现代社会中人性遭到分裂的恶果"
  },
  {
    id: 157,
    name: "银河系漫游指南",
    author: "道格拉斯·亚当斯",
    publisher: "四川科学技术出版社",
    date: "2005-06-14 00:00:00",
    price: "16.00元",
    rate: 2,
    status: 2,
    cover: "https://img1.doubanio.com/view/subject/s/public/s3696740.jpg",
    remark: "亚当斯为我们打开了一扇通往宇宙的窗户"
  },
    {
    id: 22,
    name: "明朝那些事儿",
    author: "当年明月",
    publisher: "中国海关出版社",
    date: "2009-04-12 00:00:00",
    price: "358.20元",
    rate: 5,
    status: 1,
    cover: "https://img9.doubanio.com/view/subject/s/public/s3745215.jpg",
    remark: "以史料为基础，以年代和具体人物为主线，并加入了小说的笔法，语言幽默风趣"
  },
  {
    id: 125,
    name: "古文观止",
    author: "吴楚材",
    publisher: "中华书局",
    date: "1987-01-01 00:00:00",
    price: "21.00元",
    rate: 4,
    status: 0,
    cover: "https://img3.doubanio.com/view/subject/s/public/s1325863.jpg",
    remark: "选文皆为语言精炼、短小精悍、便于传诵的佳作"
  },
])
const tableOperationFixed = ref(true)
const tableColumnRef = ref(null)
const handleSortableRowDrop = async () => {
  await nextTick()
  const tbody = tableColumnRef.value?.$el?.querySelector('.el-table__body-wrapper tbody')
  if (!tbody) return

  Sortable.create(tbody, {
    handle: '.sortable-move',
    animation: 300,
    ghostClass: 'ghost',
    onEnd({ oldIndex, newIndex }) {
      tableColumn.value.splice(newIndex, 0, tableColumn.value.splice(oldIndex, 1)[0])
      const _tableColumn = tableColumn.value.slice(0)
      tableColumn.value = []
      nextTick(() => {
        tableColumn.value = _tableColumn
      })
    },
  })
}
onMounted(() => {
  if (tableColumn.value.length > 0) {
    handleSortableRowDrop()
  }
})

</script>

<style lang="scss" scoped>

:deep(.el-form.el-form--inline) {
  padding-bottom: 16px;

  .el-popover {
    .el-select {
      .el-select__popper {
        top: 0 !important;
        display: block !important;
        position: relative !important;
        transform: none !important;
        transition: none !important;
        opacity: 1 !important;
        margin: 0 !important;
        border: 0 !important;
        box-shadow: none !important;
      }

      .el-select-dropdown {
        .el-select-dropdown__list {
          padding: 8px 0;
        }
        .el-select-dropdown__item {
          padding: 0;
          background: none;
          height: 32px;
          &::after {
            content: none;
          }
          &::before {
            content: "\eb7e";
            margin-right: 8px;
            font-family: "remixicon" !important;
            font-style: normal;
            font-size: 18px;
            color: var(--el-border-color-lighter);
          }
          &.is-selected {
            &::before {
              content: "\eb82";
              color: var(--el-color-primary);
            }
          }
        }
      }
    }
  }
}
:deep(.el-table) {
  .el-checkbox {
    display: flex;
    --el-checkbox-height: 20px;
  }
}
</style>

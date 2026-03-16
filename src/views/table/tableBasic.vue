<template>
  <el-card>
    <el-form :model="tableForm" inline>
      <el-form-item label="">
        <el-input v-model="tableForm.keyword" prefix-icon="ri-search-line" placeholder="输入关键字搜索" style="width: 176px;" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
        <el-badge :is-dot="Object.values(tableFormPlus).some(v => !isEmpty(v))">
          <el-button ref="tablePopoverButtonRef" @click="tablePopoverFormVisible = !tablePopoverFormVisible">高级查询</el-button>
        </el-badge>
      </el-form-item>
      <el-form-item class="margin-left-auto">
        <el-button type="primary">新建</el-button>
        <el-dropdown>
          <el-button>其他</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>操作</el-dropdown-item>
              <el-dropdown-item>操作</el-dropdown-item>
              <el-dropdown-item disabled>操作</el-dropdown-item>
              <el-dropdown-item>操作</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <el-popover
      :visible="tablePopoverFormVisible"
      :virtual-ref="tablePopoverButtonRef"
      placement="bottom"
      :teleported="false"
      :show-arrow="false"
      trigger="click"
      virtual-triggering
      width="100%"
    >
      <template #reference>

      </template>
      <el-form :model="tableFormPlus" label-width="100px">
        <el-row :gutter="16">
          <el-col :lg="12">
            <el-form-item label="申办流水号" prop="code">
              <el-input v-model="tableFormPlus.code" placeholder="请输入申办流水号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="tableFormPlus.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="设立时间" prop="time">
              <el-input v-model="tableFormPlus.time" placeholder="请输入设立时间"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="其他配置" prop="other">
              <el-input v-model="tableFormPlus.other" placeholder="请输入其他配置"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="" prop="" style="margin-bottom: 0;">
              <el-button type="primary" @click="tablePopoverFormVisible = false">操作</el-button>
              <el-button @click="tablePopoverFormVisible = false">操作</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-popover>

    <el-table :data="tableData" row-key="id">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="图书" width="160">
        <template #default="{ row }">
          <el-link type="primary" underline="never">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="图书摘要" prop="remark" min-width="400" />
      <el-table-column show-overflow-tooltip label="图书作者" prop="author" width="160" />
      <el-table-column label="图书等级" width="160">
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
      <el-table-column show-overflow-tooltip label="审核状态" prop="status" width="160">
        <template #default="{ row}">
          <el-tag type="info" v-if="row.status === 0"><i class="ri-checkbox-blank-circle-fill"></i><span>待审核</span></el-tag>
          <el-tag type="success" v-if="row.status === 1"><i class="ri-checkbox-blank-circle-fill"></i><span>已完成</span></el-tag>
          <el-tag type="primary" v-if="row.status === 2"><i class="ri-checkbox-blank-circle-fill"></i><span>审核中</span></el-tag>
          <el-tag type="danger" v-if="row.status === 3"><i class="ri-checkbox-blank-circle-fill"></i><span>已驳回</span></el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="创建日期" prop="date" width="240" />
      <el-table-column fixed="right" label="操作" width="140">
        <template #default="scope">
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
import { useRouter, useRoute } from 'vue-router'
import { isEmpty } from 'lodash-es'
defineOptions({ name: 'tableBasic' })
const route = useRoute()
const tableForm = ref({
  keyword: '',
})
const tableFormPlus = ref({
  code: '',
  phone: '',
  time: '',
  other: ''
})
const tablePopoverFormVisible = ref(false)
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
const tablePopoverButtonRef = ref(null)
</script>

<style lang="scss" scoped>

.el-form.el-form--inline {
  padding-bottom: 16px;
}
:deep(.el-popover) {
  --el-popover-padding: 24px;
  left: 0 !important;
}
:deep(.el-table) {
  .el-tag {
    --el-tag-bg-color: transparent;
    --el-tag-border-color: transparent;
    --el-tag-font-size: var(--el-font-size-base);
    padding: 0;
    margin-top: 4px;
    .el-tag__content {
      > span {
        color: var(--el-text-color-regular);
      }
      > i {
        transform: scale(0.65) translateX(-4px);
      }
    }
  }
}
</style>

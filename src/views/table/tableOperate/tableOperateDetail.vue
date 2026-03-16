<template>
  <el-card>
    <template #header>
      <div class="el-card__title">
        <i class="ri-arrow-left-line" @click="router.go(-1)"></i>
        <el-divider direction="vertical" />
        <label>{{ title[mode] }}</label>
      </div>
      <div class="el-card__action">
        <el-button link icon="ri-close-large-line" @click="router.go(-1)" />
      </div>
    </template>
    <el-form ref="formsRef" :model="forms" :rules="rules" label-width="auto" :disabled="mode === 'detail'">
      <el-form-item label="图书名称" prop="name">
        <el-input v-model="forms.name" placeholder="请输入图书名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="图书作者" prop="author">
        <el-input v-model="forms.author" placeholder="请输入图书作者" clearable></el-input>
      </el-form-item>
      <el-form-item label="图书内容摘要" prop="remark">
        <el-input v-model="forms.remark" type="textarea" :rows="3" placeholder="请输入图书内容摘要" clearable></el-input>
      </el-form-item>
      <el-form-item label="图书星级" prop="rate">
        <el-rate v-model="forms.rate" :icons="['ri-star-s-fill', 'ri-star-s-fill', 'ri-star-s-fill']" disabled-void-icon="ri-star-s-fill" void-icon="ri-star-s-fill" />
      </el-form-item>
      <el-form-item label="图书状态" prop="status">
        <el-select v-model="forms.status" placeholder="请选择选图书当前状态">
          <el-option label="待发布" value="0" />
          <el-option label="已发布" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="图书日期" prop="date">
        <el-date-picker v-model="forms.date" placeholder="请选择日期" type="datetime" class="width-100" />
      </el-form-item>
      <el-form-item v-if="route.query.mode !== 'detail'" label=" ">
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script setup>
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTabsStore } from '@/stores/modules/tabsStore'
defineOptions({ name: 'TableOperateDetail' })
const route = useRoute()
const router = useRouter()
const mode = ref(route.query.mode)
const formsRef = ref(null)
const forms = ref({
  id: route.query.id,
  name: '',
  author: '',
  remark: '',
  rate: 0,
  status: '',
  date: '',
})
const title = ref({
  add: '新增',
  edit: '编辑',
  detail: '详情',
})
const rules = ref()
const datas = ref([
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
onMounted(async () => {
  await nextTick()
  const { UpdateTabsVisitsTitle } = useTabsStore()
  UpdateTabsVisitsTitle(forms.value.id ? `CURD ${mode.value} ID: ${forms.value.id}` : `CURD ${mode.value}`)

  if (!route.query.id) return
  const row = datas.value.find(item => item.id = route.query.id)
  Object.keys(forms.value).forEach(key => {
    forms.value[key] = row[key]
  })
})
</script>
<style lang="scss" scoped>

</style>

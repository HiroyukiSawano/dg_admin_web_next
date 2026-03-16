<template>
  <el-row :gutter="16">
    <el-col :lg="5">
      <el-card>
        <el-input placeholder="输入关键字搜索" v-model="treeFilterText" style="margin-bottom: 16px;" />
        <el-scrollbar>
          <el-tree :data="treeData">
            <template #default="{ node, data }">
              <i v-if="data.value.length >= 6" class="el-tree-node__icon ri-pushpin-fill text-info"></i>
              <i v-else class="el-tree-node__icon ri-map-pin-2-fill"></i>
              <span class="el-tree-node__label">{{ data.label }}</span>
            </template>
          </el-tree>
        </el-scrollbar>
      </el-card>
    </el-col>
    <el-col :lg="19">
      <el-card>
        <el-form :model="tableForm" inline style="padding-bottom: 16px;">
          <el-form-item label="">
            <el-input v-model="tableForm.keyword" prefix-icon="el-icon-search" placeholder="输入关键字搜索" style="width: 176px;" />
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="tableForm.range" type="daterange" range-separator="至" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期" style="width: 352px;" />
          </el-form-item>
          <el-form-item class="margin-right-auto">
            <el-button type="primary">查询</el-button>
            <el-button>重置</el-button>
          </el-form-item>
          <el-form-item>
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
        <el-table :data="tableData" row-key="id">
          <el-table-column type="selection" width="48" align="center" />
          <el-table-column label="图书" width="160">
            <template #default="{ row }">
              <el-link type="primary" underline="never">{{ row.name }}</el-link>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="图书摘要" prop="remark" min-width="480" />
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
          <el-table-column show-overflow-tooltip label="发布状态" prop="status" width="160">
            <template #default="{ row}">
              <el-tag type="info" v-if="row.status === '0'">待发布</el-tag>
              <el-tag type="success" v-if="row.status === '1'">已发布</el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="出版日期" prop="date" width="240" />
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
    </el-col>
  </el-row>
</template>
<script setup>
import { ref } from 'vue'
import { regionData } from 'element-china-area-data'
const treeFilterText = ref('')
const treeData = ref(regionData)
const tableForm = ref({
  keyword: '',
  range: ''
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
  {
    id: 'o8hs6mrm-jqom-7d3j-g1e8-kfdrrsff6dv0',
    name: '白鹿原',
    author: '陈忠实',
    publisher: '人民文学出版社',
    date: '2012-09-30 00:00:00',
    price: '39.00元',
    rate: 3,
    status: '0',
    cover: 'https://img3.doubanio.com/view/subject/s/public/s34777382.jpg',
    remark: '以陕西关中地区白鹿原上白鹿村为缩影，讲述白姓和鹿姓两大家族祖孙三代的恩怨纷争'
  },
  {
    id: 'wxb86prk-rqtv-4yht-dmxl-3xb1fz1extt3',
    name: '平凡的世界三部曲',
    author: '路遥',
    publisher: '人民文学出版社',
    date: '2005-01-18 00:00:00',
    price: '64.00元',
    rate: 5,
    status: '1',
    cover: 'https://img2.doubanio.com/view/subject/s/public/s1144911.jpg',
    remark: '一部全景式地表现中国当代城乡社会生活的百万字长篇小说'
  },
  {
    id: '7d22s0qg-4sjx-ele6-cafi-sefwoc1fhedf',
    name: '江城',
    author: '彼得·海斯勒',
    publisher: '上海译文出版社',
    date: '2012-01-28 00:00:00',
    price: '36.00元',
    rate: 4,
    status: '0',
    cover: 'https://img3.doubanio.com/view/subject/s/public/s7019913.jpg',
    remark: '从地理和历史上看，涪陵都位于江河中游，所以人们有时很难看清她从何而来，又去往何处'
  },
  {
    id: 'llkv9syp-592t-x9sz-63qf-qhgciebg8hol',
    name: '窗边的小豆豆',
    author: '黑柳彻子',
    publisher: '南海出版公司',
    date: '2003-01-01 00:00:00',
    price: '20.00元',
    rate: 2,
    status: '0',
    cover: 'https://img2.doubanio.com/view/subject/s/public/s1067911.jpg',
    remark: '日本作家、主持人黑柳彻子著作的儿童文学小说，首次出版于1981年'
  },
  {
    id: '4nfdfscb-7sst-z7bf-x6ft-kam7u0s0piuz',
    name: '罪与罚',
    author: '陀思妥耶夫斯基',
    publisher: '上海译文出版社',
    date: '2006-08-22 00:00:00',
    price: '23.00元',
    rate: 3,
    status: '1',
    cover: 'https://img9.doubanio.com/view/subject/s/public/s1790246.jpg',
    remark: '是作家接近走向性的一个成熟的标志。从欧洲长篇小说的发展历史中对之进行考察'
  },
  {
    id: 'igr0qaxi-g2w0-7o7y-80ig-y0h4ldtv7898',
    name: '社会心理学',
    author: '戴维·迈尔斯',
    publisher: '人民邮电出版社',
    date: '2006-01-08 00:00:00',
    price: '68.00元',
    rate: 5,
    status: '1',
    cover: 'https://img3.doubanio.com/view/subject/s/public/s1670932.jpg',
    remark: '解析社会认知、社会影响、偏见等核心议题'
  },
  {
    id: 'omzhkh6s-zc3g-bqgv-t5ci-qpt3gkzbikf4',
    name: '万物有灵且美',
    author: '吉米·哈利',
    publisher: '中国城市出版社',
    date: '2010-01-08 00:00:00',
    price: '28.80',
    rate: 4,
    status: '1',
    cover: 'https://img9.doubanio.com/view/subject/s/public/s4093514.jpg',
    remark: '活泼的生命完全无须借助魔法，便能对我们述说至美至真的故事'
  },
])

</script>
<style lang="scss" scoped>
.el-card {
  height: calc(100% - 16px);
}
.el-table {
  .el-rate {
    margin: 0 -2px;
    --el-rate-icon-margin: 0;
  }
}
.el-tree {
  --el-tree-node-content-height: 32px;
  --el-tree-text-color: var(--el-text-color-primary);
  .el-tree-node {
    .el-tree-node__icon {
      margin-right: 6px;
      color: var(--el-color-primary);
      transform: scale(1.14285);
    }
    .el-tree-node__label {
      max-width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>

import { random } from 'lodash-es'
import axios from 'axios'
import dayjs from 'dayjs'
export const getBookList = async (params) => {
  const { data } = await axios({ url: '/bookList/getList', params })
  return data
}

export const apiNewsList = (params) => {
  if (params.locale === 'en') {
    return {
      code: 200,
      message: 'success',
      data: {
        data: [
          { id: 't4k8hyp7-519v-z0al-pbcv-iymuq9h2n1if', title: 'The taste of the most popular city in Yangzhou, China', tag: '1', time: '2025-08-08' },
          { id: 'rxvc9ig4-u9i4-dnb7-255p-b8jth5lhbnoa', title: 'Wherever snowflakes go, there is not only the silver coated scenery of northern China, but also the Liaoning answer sheet that reads Ice and snow are also mountains of gold and silver', tag: '2', time: '2025-08-08' },
          { id: 'dgx65izs-xr1g-guum-gsif-0xh96hrikrpe', title: 'The Supreme Peoples Procuratorate and the Ministry of Justice have issued a document to promote the construction of a comprehensive guarantee mechanism for lawyers on-site, off-site, and online grading in all scenarios', tag: '3', time: '2025-08-08' },
          { id: 'hh9173mo-eyli-i024-znom-h89pydj3a79g', title: 'Xinjiang Aleutian Snowfall after Kanasan Lake Meets the beauty of the Northern Hemisphere', tag: '4', time: '2025-08-08' },
          { id: 'ne2eh34f-29np-jlzi-uitk-h29fpt6qa44g', title: 'Countrywide Exchange Management Bureau announces november end foreign exchange reserves data', tag: '5', time: '2025-08-08' },
          { id: 'n1711pay-a9yt-a8pj-w9l8-vi1ueysog1kg', title: 'Central Asia freight trains establish a golden corridor for China Central Asia economic cooperation', tag: '1', time: '2025-08-08' },
          { id: '1iprujn8-i6br-z4d7-ycy4-923vwix8qi3w', title: 'Scenic villages with cascading waterfalls, cascading streams, and cascading terraces are natural landscapes in Uying Tun, Xinjiang, China', tag: '2', time: '2025-08-08' },
          { id: '8cagaqu7-xach-ky2j-rep8-0cl0d78zkjfi', title: 'Chongqing, China is the only major city in the world built on a parallel ridge valley', tag: '3', time: '2025-08-08' },
          { id: 'vnlcnfcp-28ma-f74p-1xzr-19q0d7h0xylu', title: 'Snow falls along the Lixiao Road in Lixian County, Aba Tibetan and Qiang Autonomous Prefecture, Sichuan Province', tag: '4', time: '2025-08-08' },
        ],
        categories: [
          { label: 'Headlines', value: 1, count: random(0, 8) },
          { label: 'Policy', value: 2, count: random(0, 8) },
          { label: 'Other', value: 3, count: random(0, 8) },
        ],
        tags: [
          { label: 'Consult', value: '1', type: 'primary' },
          { label: 'Comply', value: '2', type: 'danger' },
          { label: 'Help', value: '3', type: 'warning' },
          { label: 'Praise', value: '4', type: 'danger' },
          { label: 'Other', value: '5', type: 'info' },
        ],
      }
    }
  } else {
    return {
      code: 200,
      message: 'success',
      data: {
        data: [
          { id: 't4k8hyp7-519v-z0al-pbcv-iymuq9h2n1if', title: '中国历史文化名街东关街上最扬州的味道', tag: '1', time: '2025-08-08' },
          { id: 'rxvc9ig4-u9i4-dnb7-255p-b8jth5lhbnoa', title: '雪花所到之处，既有银装素裹的北国风光，更书写着冰天雪地也是金山银山的辽宁答卷', tag: '2', time: '2025-08-08' },
          { id: 'dgx65izs-xr1g-guum-gsif-0xh96hrikrpe', title: '最高检司法部发文推动构建律师现场、异地、线上阅卷全场景保障机制', tag: '3', time: '2025-08-08' },
          { id: 'hh9173mo-eyli-i024-znom-h89pydj3a79g', title: '新疆阿勒泰雪后喀纳斯湖美如仙境', tag: '4', time: '2025-08-08' },
          { id: 'ne2eh34f-29np-jlzi-uitk-h29fpt6qa44g', title: '国家外汇管理局公布2025年11月末外汇储备规模数据', tag: '5', time: '2025-08-08' },
          { id: 'n1711pay-a9yt-a8pj-w9l8-vi1ueysog1kg', title: '中亚班列铺就中国—中亚经济合作黄金走廊', tag: '1', time: '2025-08-08' },
          { id: '1iprujn8-i6br-z4d7-ycy4-923vwix8qi3w', title: '鳞次栉比的吊脚楼层层叠叠的梯田潺潺流过的溪流乌英屯自然风景秀丽', tag: '2', time: '2025-08-08' },
          { id: '8cagaqu7-xach-ky2j-rep8-0cl0d78zkjfi', title: '中国重庆世界上唯一建在平行岭谷的大城市', tag: '3', time: '2025-08-08' },
          { id: 'vnlcnfcp-28ma-f74p-1xzr-19q0d7h0xylu', title: '四川省阿坝藏族羌族自治州理县理小路沿线迎来降雪', tag: '4', time: '2025-08-08' },
        ],
        categories: [
          { label: '要闻', value: 1, count: random(0, 8) },
          { label: '政策', value: 2, count: random(0, 8) },
          { label: '其他', value: 3, count: random(0, 8) },
        ],
        tags: [
          { label: '咨询', value: '1', type: 'primary' },
          { label: '投诉', value: '2', type: 'danger' },
          { label: '求助', value: '3', type: 'warning' },
          { label: '表扬', value: '4', type: 'danger' },
          { label: '其他', value: '5', type: 'info' },
        ],
      }
    }
  }
}
export const apiBookList = (params) => {
  if (params.locale === 'en') {
    return {
      code: 200,
      message: 'success',
      data: {
        columns: [
          { prop: 'name', label: 'Book', type: 'link', width: '160', minWidth: '', align: '', showOverflowTooltip: true, formatter: null },
          { prop: 'remark', label: 'Book Summary', type: 'text', width: '', minWidth: '400', align: '', showOverflowTooltip: true, formatter: null },
          { prop: 'author', label: 'Book Author', type: 'text', width: '160', minWidth: '', align: '', showOverflowTooltip: false, formatter: null },
          { prop: 'star', label: 'Book Level', type: 'rate', width: '160', minWidth: '', align: '', showOverflowTooltip: false, formatter: null },
          { prop: 'status', label: 'Book Status', type: 'tag', width: '160', minWidth: '', align: '', showOverflowTooltip: false, formatter: null},
          { prop: 'date', label: 'Book Publish Date', type: 'text', width: '224', minWidth: '', align: '', showOverflowTooltip: false, formatter: null },
        ],
        source: [
          {
            id: 'p7ipyvtn-9md6-f9i2-n8zv-t2hstvqb7ujy',
            name: "Complete Fairy Tales",
            author: 'Jacob Grimm',
            publisher: "People's Literature Publishing House",
            date: '1994-11-25 00:00:00',
            price: '¥21.45',
            star: 3,
            status: 2,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/65vweqve-bdds-y1nf-j615-anaxwf5xcy4w.jpg',
            remark: 'Magical and romantic fairy tales told with rich imagination and elegant language.',
          },
          {
            id: 'fxvg3ukr-n31z-508j-oom0-f7c4ltl0lz4w',
            name: 'Time Brief History',
            author: 'Stephen Hawking',
            publisher: 'Hunan Science & Technology Press',
            date: '2010-04-08 00:00:00',
            price: '¥45.00',
            star: 5,
            status: 1,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/8l80yvop-t818-c29i-2n0y-tc9if4hbpvbi.jpg',
            remark:
              'An introductory journey into the mysteries of cosmology, including special relativity and the origins of time and the universe.',
          },
          {
            id: '21hp6d8x-5zmw-mtqo-9mb3-77myxw356rj5',
            name: 'The Republic',
            author: 'Plato',
            publisher: 'The Commercial Press',
            date: '1986-08-18 00:00:00',
            price: '¥28.00',
            star: 4,
            status: 3,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/93d6jyhm-sjwe-tbfk-bbe8-rs8r4gcv7ww3.jpg',
            remark:
              'A philosophical classic written in dialogue form that explores justice and city-state governance, presenting an ideal society where truth, goodness, and beauty are unified through political design.',
          },
          {
            id: '58mbrcq6-x4z7-5808-ssi3-60tk2ofw6ti2',
            name: 'Lost Salt Gift of Blood',
            author: 'Alistair MacLeod',
            publisher: 'Shanghai Literature & Art Publishing House',
            date: '2015-06-01 00:00:00',
            price: '¥20.00',
            star: 2,
            status: 1,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/a38w2wfs-yvwg-acas-f6f1-j6zhnex4yw28.jpg',
            remark:
              'The profound bonds—and unbridgeable chasms—between men and women, and between parents and children.',
          },
          {
            id: 'zuk0dm9i-gbs8-g5td-9w6j-raj18xpvlp3s',
            name: 'Sahara Stories',
            author: 'Sanmao',
            publisher: 'Harbin Publishing House',
            date: '2003-06-25 00:00:00',
            price: '¥15.80',
            star: 3,
            status: 0,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/arta1313-xot3-nrcz-50d6-j4f1x5yizur6.jpg',
            remark:
              'Chronicles Sanmao and José’s life in the Sahara Desert, along with their encounters and friendships with local people.',
          },
          {
            id: 'jlpcetst-5o9c-pkql-36u6-pnvoldhqayxi',
            name: 'Foundation',
            author: 'Isaac Asimov',
            publisher: 'Jiangsu Phoenix Literature and Art Publishing Ltd.',
            date: '2015-10-01 00:00:00',
            price: '¥328.00',
            star: 2,
            status: 1,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/byzia10a-essn-fm07-usro-to191l7u0vjo.jpg',
            remark:
              'On a desolate planet, a Foundation is established to become a beacon of hope for future generations of humanity.',
          },
          {
            id: 'xgt15qit-thmc-z801-danq-fd5vl0a2tcgv',
            name: 'Thunderstorm',
            author: 'Cao Yu',
            publisher: "People's Literature Publishing House",
            date: '1999-05-05 00:00:00',
            price: '¥9.20',
            star: 3,
            status: 0,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/ec0brs4r-bust-jb8y-bmh3-gea7wrf0bjc7.jpg',
            remark:
              'Within twenty-four hours, the story unfolds three decades of tangled grievances and passions between the Zhou and Lu families.',
          },
          {
            id: '7lx3t05i-i6sb-alop-4pdc-tax8m3tfao4w',
            name: 'Year of No Significance',
            author: 'Ray Huang',
            publisher: 'SDX Joint Publishing Company',
            date: '1997-05-25 00:00:00',
            price: '¥18.00',
            star: 1,
            status: 3,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/eqhx6lu6-mi64-fgbk-57b8-bpzk2yqjayuw.jpg',
            remark:
              'Using a narrative style akin to historical fiction and biographical chapters, it examines the profound reasons behind the late Ming dynasty’s decline through the tragic fates of key historical figures.',
          },
          {
            id: 'ufblmndc-qxt3-i2h5-6khl-en3ifsxwu6dd',
            name: 'Steppen Wolf',
            author: 'Hermann Hesse',
            publisher: 'Shanghai Translation Publishing House',
            date: '2008-07-08 00:00:00',
            price: '¥13.00',
            star: 4,
            status: 2,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/f3lnqahf-pugb-xup2-bpzh-sglehll787ct.jpg',
            remark:
              'Through the portrayal of an individual’s psychological turmoil, it reveals the fragmentation of human nature in modern society.',
          },
          {
            id: 'qczfuynh-dmbw-o324-7e8f-dafpaa6ymluk',
            name: "The Hitchhiker's Guide to the Galaxy",
            author: 'Douglas Adams',
            publisher: 'Sichuan Science & Technology Press',
            date: '2005-06-14 00:00:00',
            price: '¥16.00',
            star: 2,
            status: 2,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/ktlmi47d-n2dy-qjhq-4mqz-pfs5cg4lrp05.jpg',
            remark: 'Adams opens a window for us onto the cosmos.',
          },
          {
            id: 'w4y31c45-mv9n-ak0r-szho-xkehrm3xneyy',
            name: 'Those Happenings of the Ming Dynasty',
            author: 'Shi Yue',
            publisher: 'China Customs Press',
            date: '2009-04-12 00:00:00',
            price: '¥358.20',
            star: 5,
            status: 1,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/lfcw1nmi-54lo-gfa1-3lpv-hnkjpf95h4qr.jpg',
            remark:
              'Based on historical records and structured around chronological events and key figures, it employs novelistic techniques and humorous, engaging language.',
          },
          {
            id: 'aek6zvas-wxd9-0wpo-dkmh-d4th05vqlrcw',
            name: 'Anthology of Classical Chinese Prose',
            author: 'Wu Chucai',
            publisher: 'Zhonghua Book Company',
            date: '1987-01-01 00:00:00',
            price: '¥21.00',
            star: 4,
            status: 0,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/lx0za4n0-gi1f-38rg-ze63-ir4jixt5kbxw.jpg',
            remark:
              'A collection of concise, eloquent, and memorable classical Chinese essays, ideal for recitation.',
          },
        ],
        status: [
          { label: 'Draft', value: 0, type: 'info' },
          { label: 'Pending', value: 1, type: 'primary' },
          { label: 'Approved', value: 2, type: 'success' },
          { label: 'Rejected', value: 3, type: 'danger' },
          { label: 'Revoked', value: 4, type: 'warning' },
          { label: 'Canceled', value: 5, type: 'info' },
        ],
        categories: [
          { label: 'Book Available', value: 1, count: random(0, 8) },
          { label: 'Book Borrowed', value: 2, count: random(0, 8) },
          { label: 'Book Destroyed', value: 3, count: random(0, 8) },
          { label: 'Book Archived', value: 4, count: random(0, 8) },
        ],
        pagination: {
          total: 12,
        }
      },
    }
  } else {
    return {
      code: 200,
      message: 'success',
      data: {
        columns: [
          { prop: 'name', label: '图书', type: 'link', width: '160', minWidth: '', align: '', showOverflowTooltip: true, formatter: null },
          { prop: 'remark', label: '图书摘要', type: 'text', width: '', minWidth: '400', align: '', showOverflowTooltip: true, formatter: null },
          { prop: 'author', label: '图书作者', type: 'text', width: '160', minWidth: '', align: '', showOverflowTooltip: false, formatter: null },
          { prop: 'star', label: '图书等级', type: 'rate', width: '160', minWidth: '', align: '', showOverflowTooltip: false, formatter: null },
          { prop: 'status', label: '图书状态', type: 'tag', width: '160', minWidth: '', align: '', showOverflowTooltip: false, formatter: null },
          { prop: 'date', label: '图书出版日期', type: 'text', width: '240', minWidth: '', align: '', showOverflowTooltip: false, formatter: null },
        ],
        source: [
          {
            id: 'p7ipyvtn-9md6-f9i2-n8zv-t2hstvqb7ujy',
            name: '格林童话全集',
            author: '雅各布·格林',
            publisher: '人民文学出版社',
            date: '1994-11-25 00:00:00',
            price: '21.45元',
            star: 3,
            status: 2,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/65vweqve-bdds-y1nf-j615-anaxwf5xcy4w.jpg',
            remark: '丰富的想象、优美的语言讲述神奇而又浪漫的童话故事',
          },
          {
            id: 'fxvg3ukr-n31z-508j-oom0-f7c4ltl0lz4w',
            name: '时间简史',
            author: '史蒂芬·霍金',
            publisher: '湖南科学技术出版社',
            date: '2010-04-08 00:00:00',
            price: '45.00元',
            star: 5,
            status: 1,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/8l80yvop-t818-c29i-2n0y-tc9if4hbpvbi.jpg',
            remark: '遨游外层空间奇异领域初步了解狭义相对论以及时间、宇宙的起源等宇宙学的奥妙',
          },
          {
            id: '21hp6d8x-5zmw-mtqo-9mb3-77myxw356rj5',
            name: '理想国',
            author: '柏拉图',
            publisher: '商务印书馆',
            date: '1986-08-18 00:00:00',
            price: '28.00元',
            star: 4,
            status: 3,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/93d6jyhm-sjwe-tbfk-bbe8-rs8r4gcv7ww3.jpg',
            remark: '以对话体形式探讨正义与城邦治理的哲学经典，并通过政体设计阐述真善美统一的理想社会',
          },
          {
            id: '58mbrcq6-x4z7-5808-ssi3-60tk2ofw6ti2',
            name: '海风中失落的血色馈赠',
            author: '阿利斯泰·麦克劳德',
            publisher: '上海文艺出版社',
            date: '2015-06-01 00:00:00',
            price: 'CNY 20.00',
            star: 2,
            status: 1,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/a38w2wfs-yvwg-acas-f6f1-j6zhnex4yw28.jpg',
            remark: '男女之间、父母与子女之间紧密的纽带和难以逾越的鸿沟',
          },
          {
            id: 'zuk0dm9i-gbs8-g5td-9w6j-raj18xpvlp3s',
            name: '撒哈拉的故事',
            author: '三毛',
            publisher: '哈尔滨出版社',
            date: '2003-06-25 00:00:00',
            price: '15.80元',
            star: 3,
            status: 0,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/arta1313-xot3-nrcz-50d6-j4f1x5yizur6.jpg',
            remark: '三毛和荷西在撒哈拉沙漠生活时的所见所闻，以及与当地相识的朋友的故事',
          },
          {
            id: 'jlpcetst-5o9c-pkql-36u6-pnvoldhqayxi',
            name: '基地三部曲',
            author: '艾萨克·阿西莫夫',
            publisher: '江苏凤凰文艺出版社',
            date: '2015-10-01 00:00:00',
            price: '328.00元',
            star: 2,
            status: 1,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/byzia10a-essn-fm07-usro-to191l7u0vjo.jpg',
            remark: '荒凉行星建立基地成为未来世代人类的希望灯塔',
          },
          {
            id: 'xgt15qit-thmc-z801-danq-fd5vl0a2tcgv',
            name: '雷雨',
            author: '曹禺',
            publisher: '人民文学出版社',
            date: '1999-05-05 00:00:00',
            price: '9.20',
            star: 3,
            status: 0,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/ec0brs4r-bust-jb8y-bmh3-gea7wrf0bjc7.jpg',
            remark: '二十四小时内，集中展开了周鲁两家三十年的恩怨情仇',
          },
          {
            id: '7lx3t05i-i6sb-alop-4pdc-tax8m3tfao4w',
            name: '万历十五年',
            author: '黄仁宇',
            publisher: '生活·读书·新知三联书店',
            date: '1997-05-25 00:00:00',
            price: '18.00元',
            star: 1,
            status: 3,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/eqhx6lu6-mi64-fgbk-57b8-bpzk2yqjayuw.jpg',
            remark:
              '运用历史小说的叙事模式和传记体式的章节，通过对关键历史人物悲惨命运的描述，探析了晚明帝国走向衰落的深刻原因',
          },
          {
            id: 'ufblmndc-qxt3-i2h5-6khl-en3ifsxwu6dd',
            name: '荒原狼',
            author: '黑塞',
            publisher: '上海译文出版社',
            date: '2008-07-08 00:00:00',
            price: '13.00',
            star: 4,
            status: 2,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/f3lnqahf-pugb-xup2-bpzh-sglehll787ct.jpg',
            remark: '通过对个人精神疾病的讲述，展示出现代社会中人性遭到分裂的恶果',
          },
          {
            id: 'qczfuynh-dmbw-o324-7e8f-dafpaa6ymluk',
            name: '银河系漫游指南',
            author: '道格拉斯·亚当斯',
            publisher: '四川科学技术出版社',
            date: '2005-06-14 00:00:00',
            price: '16.00元',
            star: 2,
            status: 2,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/ktlmi47d-n2dy-qjhq-4mqz-pfs5cg4lrp05.jpg',
            remark: '亚当斯为我们打开了一扇通往宇宙的窗户',
          },
          {
            id: 'w4y31c45-mv9n-ak0r-szho-xkehrm3xneyy',
            name: '明朝那些事儿',
            author: '当年明月',
            publisher: '中国海关出版社',
            date: '2009-04-12 00:00:00',
            price: '358.20元',
            star: 5,
            status: 1,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/lfcw1nmi-54lo-gfa1-3lpv-hnkjpf95h4qr.jpg',
            remark: '以史料为基础，以年代和具体人物为主线，并加入了小说的笔法，语言幽默风趣',
          },
          {
            id: 'aek6zvas-wxd9-0wpo-dkmh-d4th05vqlrcw',
            name: '古文观止',
            author: '吴楚材',
            publisher: '中华书局',
            date: '1987-01-01 00:00:00',
            price: '21.00元',
            star: 4,
            status: 0,
            cover: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/lx0za4n0-gi1f-38rg-ze63-ir4jixt5kbxw.jpg',
            remark: '选文皆为语言精炼、短小精悍、便于传诵的佳作',
          },
        ],
        status: [
          { label: '未提交', value: 0, type: 'info' },
          { label: '审批中', value: 1, type: 'primary' },
          { label: '已通过', value: 2, type: 'success' },
          { label: '已驳回', value: 3, type: 'danger' },
          { label: '已撤回', value: 4, type: 'warning' },
          { label: '已取消', value: 5, type: 'info' },
        ],
        categories: [
          { label: '图书在库', value: 1, count: random(0, 8) },
          { label: '图书已借阅', value: 2, count: random(0, 8) },
          { label: '图书销毁处理', value: 3, count: random(0, 8) },
          { label: '图书归档', value: 4, count: random(0, 8) },
        ],
        pagination: {
          total: 12,
        }
      }
    }
  }
}
export const apiBookGenres = (params) => {
  if (params.locale === 'en') {
    return {
      code: 200,
      message: 'success',
      data: {
        data: [
          { name: 'Philosophy&Religion', value: random(8, 888) },
          { name: 'Language', value: random(8, 888) },
          { name: 'Geography&History', value: random(8, 888) },
          { name: 'Mathematical Science', value: random(8, 888) },
          { name: 'Astrophysics', value: random(8, 888) },
          { name: 'Other', value: random(8, 888) },
        ],
      },
    }
  } else {
    return {
      code: 200,
      message: 'success',
      data: {
        data: [
          { name: '哲学宗教', value: random(8, 888) },
          { name: '语言', value: random(8, 888) },
          { name: '地理历史', value: random(8, 888) },
          { name: '数理科学', value: random(8, 888) },
          { name: '天体物理学', value: random(8, 888) },
          { name: '其他', value: random(8, 888) },
        ],
      }
    }
  }
}
export const apiBookHot = (params) => {
  if (params.locale === 'en') {
    return {
      code: 200,
      message: 'success',
      data: {
        data: [
          { name: 'Philosophy&Enlightenment Reading Materials', value: random(8, 888) },
          { name: 'Photography', value: random(8, 888) },
          { name: 'Electronic Engineering', value: random(8, 888) },
          { name: 'Chinese Philosophy', value: random(8, 888) },
          { name: 'German Classical Philosophy', value: random(8, 888) },
          { name: 'National Administrative Management', value: random(8, 888) },
          { name: 'Ideological Political Education', value: random(8, 888) },
          { name: 'Economic Overview', value: random(8, 888) },
          { name: 'Posts Telecommunications', value: random(8, 888) },
          { name: 'Annual Yearbook', value: random(8, 888) },
          { name: 'Theoretical Physics', value: random(8, 888) },
          { name: 'Folk Literature', value: random(8, 888) },
          { name: 'Prose', value: random(8, 888) },
          { name: 'Guidelines Policies', value: random(8, 888) },
          { name: 'Grammar', value: random(8, 888) },
        ],
      },
    }
  } else {
    return {
      code: 200,
      message: 'success',
      data: {
        data: [
          { name: '启蒙读物', value: random(8, 888) },
          { name: '摄影', value: random(8, 888) },
          { name: '电子工程', value: random(8, 888) },
          { name: '中国哲学', value: random(8, 888) },
          { name: '德国古典哲学', value: random(8, 888) },
          { name: '国家行政管理', value: random(8, 888) },
          { name: '思想政治', value: random(8, 888) },
          { name: '世界各国经济概况', value: random(8, 888) },
          { name: '邮电', value: random(8, 888) },
          { name: '年刊年鉴', value: random(8, 888) },
          { name: '理论物理', value: random(8, 888) },
          { name: '民间文学', value: random(8, 888) },
          { name: '散文', value: random(8, 888) },
          { name: '方针政策及其阐述', value: random(8, 888) },
          { name: '语法', value: random(8, 888) },
        ],
      }
    }
  }
}
export const apiAppList = (params) => {
  if (params.locale === 'en') {
    return {
      code: 200,
      message: 'success',
      data: {
        data: [
          { id: 'shqr2ze3-25t8-rq4i-b3hp-pegf2pj17yh1', name: 'IT Tools', icon: 'ri-triangular-flag-fill', background: '#1B89FA' },
          { id: 'zskuabpt-43wr-a9a2-g3vm-3vx5de2nht1g', name: 'Infrastructure Monitoring System', icon: 'ri-token-swap-fill', background: '#1BB8FA' },
          { id: 'xn1uxkm4-h8mt-pzm1-5dtl-ohs47gxr0eky', name: 'Cloud Management Platform', icon: 'ri-flashlight-fill', background: '#29D7CB' },
          { id: '5vacsaif-vz4h-9wu2-0zxe-r36u09o6psil', name: 'Problem Tracking Tool', icon: 'ri-drinks-2-fill', background: '#57D9A3' },
          { id: '3lyp8nwq-9df3-2swj-xscc-xesxhj6e7510', name: 'Feishu Project', icon: 'ri-pushpin-fill', background: '#5364E5' },
          { id: 'b8sgslfo-ahkc-7kr7-buce-mpwn6xejjx79', name: 'Developer Management Platform', icon: 'ri-video-add-fill', background: '#7988FA' },
          { id: '91u8e7f3-0gi5-r1vy-oqko-aflm57q8m4ua', name: 'Work Order', icon: 'ri-function-add-fill', background: '#FA8679' },
          { id: 'aonofa71-pbbn-a8an-c40r-e0m5lj78yhds', name: 'DingTalk Workflow', icon: 'ri-checkbox-multiple-fill', background: '#FFA43F' },
          { id: 't9mqh6mk-1v4f-sny0-7fxs-27tu1tjhpshg', name: 'Cycle Developer Management Platform', icon: 'ri-eye-close-fill', background: '#F5C330' },
          { id: '9mjml2he-p25g-s2cn-oggt-nub1yjiu8802', name: 'Mingdao Cloud', icon: 'ri-search-ai-fill', background: '#1BB8FA' },
          { id: 'vk7pllq2-2j7r-t6jw-0lmz-hd650uj1nhzq', name: 'Tenant Developer Management Platform', icon: 'ri-parent-fill', background: '#29D7CB' },
          { id: 'ulkquqna-lnnd-e2by-ssh1-7xoa38d8dycn', name: 'Information and Event Management Platform', icon: 'ri-shapes-fill', background: '#57D9A3' },
        ],
      }
    }
  } else {
    return {
      code: 200,
      message: 'success',
      data: {
        data: [
          { id: 'shqr2ze3-25t8-rq4i-b3hp-pegf2pj17yh1', name: '运维工具', icon: 'ri-triangular-flag-fill', background: '#1B89FA' },
          { id: 'zskuabpt-43wr-a9a2-g3vm-3vx5de2nht1g', name: '基础设施监控系统', icon: 'ri-token-swap-fill', background: '#1BB8FA' },
          { id: 'xn1uxkm4-h8mt-pzm1-5dtl-ohs47gxr0eky', name: '云管理平台', icon: 'ri-flashlight-fill', background: '#29D7CB' },
          { id: '5vacsaif-vz4h-9wu2-0zxe-r36u09o6psil', name: '问题跟踪工具', icon: 'ri-drinks-2-fill', background: '#57D9A3' },
          { id: '3lyp8nwq-9df3-2swj-xscc-xesxhj6e7510', name: '飞书项目', icon: 'ri-pushpin-fill', background: '#5364E5' },
          { id: 'b8sgslfo-ahkc-7kr7-buce-mpwn6xejjx79', name: '研发管理平台', icon: 'ri-video-add-fill', background: '#7988FA' },
          { id: '91u8e7f3-0gi5-r1vy-oqko-aflm57q8m4ua', name: '工单', icon: 'ri-function-add-fill', background: '#FA8679' },
          { id: 'aonofa71-pbbn-a8an-c40r-e0m5lj78yhds', name: '钉钉宜搭', icon: 'ri-checkbox-multiple-fill', background: '#FFA43F' },
          { id: 't9mqh6mk-1v4f-sny0-7fxs-27tu1tjhpshg', name: '周期研发管理平台', icon: 'ri-eye-close-fill', background: '#F5C330' },
          { id: '9mjml2he-p25g-s2cn-oggt-nub1yjiu8802', name: '明道云', icon: 'ri-search-ai-fill', background: '#1BB8FA' },
          { id: 'vk7pllq2-2j7r-t6jw-0lmz-hd650uj1nhzq', name: '租户研发管理平台', icon: 'ri-parent-fill', background: '#29D7CB' },
          { id: 'ulkquqna-lnnd-e2by-ssh1-7xoa38d8dycn', name: '信息与事件管理平台', icon: 'ri-shapes-fill', background: '#57D9A3' },
        ],
      }
    }
  }
}

export const apiScheduleList = (params) => {
  if (params.locale === 'en') {
    return {
      code: 200,
      message: 'success',
      data: {
        data: [
          { title: '国国国国', content: '国国国国国国国国', date: dayjs().subtract(4, 'day').format('YYYY-MM-DD'), color: '#1B89FA' },
          { title: '国国国国国国国', content: '国国国国国国国国国国国国国国国国', date: dayjs().subtract(3, 'day').format('YYYY-MM-DD'), color: '#1BB8FA' },
          { title: '国国国国国', content: '国国国国国国国国国国国国', date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'), color: '#29D7CB' },
          { title: '国国国国国国', content: '国国国国国国国国国国国国国国国国国国国国国国国国', date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), color: '#57D9A3' },
          { title: '国国国国', content: '国国国国国国国国国国国国', date: dayjs().format('YYYY-MM-DD'), color: '#5364E5' },
          { title: '国国国国国国', content: '国国国国国国国国国国国国国国国国', date: dayjs().add(1, 'day').format('YYYY-MM-DD'), color: '#7988FA' },
          { title: '国国国国国国国国', content: '国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国', date: dayjs().add(2, 'day').format('YYYY-MM-DD'), color: '#FA8679' },
          { title: '国国国国国', content: '国国国国国国国国国国国国', date: dayjs().add(3, 'day').format('YYYY-MM-DD'), color: '#FFA43F' },
          { title: '国国国国国', content: '国国国国国国国国国国国国国国国国国国国国国国国国', date: dayjs().add(4, 'day').format('YYYY-MM-DD'), color: '#F5C330' },
        ],
      }
    }
  } else {
    return {
      code: 200,
      message: 'success',
      data: {
        data: [
          { title: '国国国国', content: '国国国国国国国国', date: dayjs().subtract(4, 'day').format('YYYY-MM-DD'), color: '#1B89FA' },
          { title: '国国国国国国国', content: '国国国国国国国国国国国国国国国国', date: dayjs().subtract(3, 'day').format('YYYY-MM-DD'), color: '#1BB8FA' },
          { title: '国国国国国', content: '国国国国国国国国国国国国', date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'), color: '#29D7CB' },
          { title: '国国国国国国', content: '国国国国国国国国国国国国国国国国国国国国国国国国', date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), color: '#57D9A3' },
          { title: '国国国国', content: '国国国国国国国国国国国国', date: dayjs().format('YYYY-MM-DD'), color: '#5364E5' },
          { title: '国国国国国国', content: '国国国国国国国国国国国国国国国国', date: dayjs().add(1, 'day').format('YYYY-MM-DD'), color: '#7988FA' },
          { title: '国国国国国国国国', content: '国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国国', date: dayjs().add(2, 'day').format('YYYY-MM-DD'), color: '#FA8679' },
          { title: '国国国国国', content: '国国国国国国国国国国国国', date: dayjs().add(3, 'day').format('YYYY-MM-DD'), color: '#FFA43F' },
          { title: '国国国国国', content: '国国国国国国国国国国国国国国国国国国国国国国国国', date: dayjs().add(4, 'day').format('YYYY-MM-DD'), color: '#F5C330' },
        ],
      }
    }
  }
}

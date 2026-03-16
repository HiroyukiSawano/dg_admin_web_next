
import Mock from 'mockjs'

const List = {
  en: [],
  'zh-CN': [],
}
const count = 50
for (let i = 0; i < count; i++) {
  List['en'].push({
    record: {
      id: '@guid',
      type: 'Book',
      created: '@datetime',
      modified: '@datetime',
      source: `@pick(['National Library of China', 'Shanghai Library', 'Tsinghua University Library', 'Nanjing Library', 'Wuhan Library', 'Central Library', 'Suzhou Library', 'Ningbo One Gate Library'])`,
    },
    resource: {
      id: '@guid',
      title: ['The Catcher in the Rye', 'To Kill a Mockingbird', 'Nineteen Eighty-Four', 'Pride and Prejudice', 'The Great Gatsby', 'Moby Dick', 'War and Peace', 'The Odyssey', 'The Divine Comedy', 'Crime and Punishment', 'The Brothers Karamazov', 'Grimms Fairy Tales'][i % 12],
      subtitle: '@title(8, 18)',
      'alternative|1-5': ['@title'],
      summary: '@sentence(8, 88)',
      author: {
        name: ['Stephen Hawking', 'The Brothers Grimm', 'Plato', 'Sanmao', 'Lao She', 'Isaac Asimov', 'Cao Yu', 'Ray Huang', 'Hermann Hesse', 'Douglas Adams', 'Dang Nian Mingyue', 'Wu Chucai'][i % 12],
        type: 'person',
        role: 'author',
        nationality: '@ip',
      },
      'contributors|1-5': [
        {
          type: `@pick(['person', 'organization'])`,
          name: '@name',
          role: `@pick(['author', 'illustrator', 'editor', 'translator'])`,
        },
      ],
      language: 'zh',
      languages: ['zh', 'en'],
      'genres|1-5': [`@pick(['Engineering&Technology', 'Essays', 'Poetry', 'Philosophy', 'Inference', 'Literature Classics', 'Movies', 'Reference Books', 'Psychology'])`],

      'contents|1-5': [`Chapter @character("number"): @paragraph(1, 5)`],
      'subjects|1-3': [
        `@pick(['Time Travel - Fiction', 'Interstellar Colonization - Science Fiction Genre', 'Steampunk - Retro-Futurism', 'Future - Literature Work - Super-Realistic Narrative', 'Parallel Universes - Fantasymedia', 'Digital immortality -赛博格主题', '中国—当代主题', '现代-歌剧', '记忆—文学表现'])`,
      ],
      'keywords|1-5': [`@pick(['AI', 'Essays', 'Reports', 'True Stories', 'Inference', 'Critique', 'Suspense', 'Modern Opera', 'Philosophy&Psychology'])`],
      'awards|1-3': [`@pick(['International Booker Prize', 'Nebula Prize', 'Hugo Award', 'Priner Award', 'Alessandro Poincare Award', 'Costantino Book Award', 'Fermi Award', 'Pynchon Award', 'Kate Greenner Award', 'Sweeny Award'])`],
    },
    instance: {
      isbn: '@id',
      publisher: `@pick(['Zhonghua Book Company', 'SDX Joint Publishing Company', 'Shanghai Translation Publishing House', 'Science Press', 'Guangxi Normal University Press', 'CITIC Press Group', 'The Commercial Press', 'Peoples Literature Publishing House'])`,
      place: '@ip',
      date: '@date',
      edition: 'Edition @integer(1, 8)',
      extent: 'Page @integer(88, 888)',
      binding: `@pick(['Paperback', 'Hardback', 'Threadback'])`,
      series: {
        title: '@title(8, 18)',
        volume: 'Volume @integer(1, 8)',
      },
      cover: {
        url: [
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/65vweqve-bdds-y1nf-j615-anaxwf5xcy4w.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/8l80yvop-t818-c29i-2n0y-tc9if4hbpvbi.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/93d6jyhm-sjwe-tbfk-bbe8-rs8r4gcv7ww3.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/a38w2wfs-yvwg-acas-f6f1-j6zhnex4yw28.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/arta1313-xot3-nrcz-50d6-j4f1x5yizur6.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/byzia10a-essn-fm07-usro-to191l7u0vjo.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/ec0brs4r-bust-jb8y-bmh3-gea7wrf0bjc7.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/eqhx6lu6-mi64-fgbk-57b8-bpzk2yqjayuw.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/f3lnqahf-pugb-xup2-bpzh-sglehll787ct.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/ktlmi47d-n2dy-qjhq-4mqz-pfs5cg4lrp05.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/lfcw1nmi-54lo-gfa1-3lpv-hnkjpf95h4qr.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/lx0za4n0-gi1f-38rg-ze63-ir4jixt5kbxw.jpg',
        ][i % 12],
        alt: '@sentence',
        size: '@natural(1024, 2097152)',
        format: 'jpg',
        color: '@color',
        thumbnail: '@image("50x50", "@color", "#FFF", "Thumbnail")',
        copyright: `@word(4, 16) © @date('yyyy')`,
        source: '@domain',
      },
      'files|1-3': [
        {
          id: '@guid',
          uid: '@guid',
          name: '@title(5, 20)',
          format: `@pick(['PDF', 'OTF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'ZIP', 'RAR'])`,
          size: '@natural(1024, 2097152)',
          url: '@url',
        },
      ],
    },
    community: {
      rating: '@float(0, 5, 1, 1)',
      review: '@integer(8, 88888)',
      'tags|1-5': [`@pick(['Hard Science Fiction', 'Female Perspective', 'Philosophy Thought', 'Cyberpunk', 'Magic Realism', 'Non-Fiction Writing', 'Space Opera', 'Psychological Suspense', 'Urban'])`],
      'quotes|1-5': ['@sentence(8, 88)'],
      level: `@pick(['Beginner', 'Intermediate', 'Advanced'])`,
      lexile: null,
    },
    circulation: {
      total: '@integer(8, 8888)',
      available: '@integer(8, 888)',
      borrowed: '@integer(8, 88)',
      status: '@pick([0, 1, 2, 3])',
      period: '@integer(0, 88)',
      library: '@name() Library',
      number: '@natural',
    },
  })
  List['zh-CN'].push({
    record: {
      id: '@guid',
      type: 'Book',
      created: '@datetime',
      modified: '@datetime',
      source: `@pick(['中国国家图书馆', '上海图书馆', '清华大学图书馆', '南京图书馆', '武汉图书馆', '中央图书馆', '苏州图书馆', '宁波天一阁图书馆'])`,
    },
    resource: {
      id: '@guid',
      title: ['麦田里的守望者', '杀死一只知更鸟', '一九八四', '傲慢与偏见', '了不起的盖茨比', '白鲸', '战争与和平', '奥德赛', '神曲', '罪与罚', '卡拉马佐夫兄弟', '格林童话'][i % 12],
      subtitle: '@ctitle(8, 18)',
      'alternative|1-5': ['@title'],
      summary: '@csentence(8, 88)',
      author: {
        name: ['史蒂芬·霍金', '格林兄弟', '柏拉图', '陈懋平', '老舍', '艾萨克·阿西莫夫', '曹禺', '黄仁宇', '黑塞', '道格拉斯·亚当斯', '当年明月', '吴楚材'][i % 12],
        type: 'person',
        role: 'author',
        nationality: '@city',
      },
      'contributors|1-5': [
        {
          type: `@pick(['person', 'organization'])`,
          name: '@cname',
          role: `@pick(['author', 'illustrator', 'editor', 'translator'])`,
        },
      ],
      language: 'zh',
      languages: ['zh', 'en'],
      'genres|1-5': [`@pick(['工程技术', '散文', '诗歌集', '哲学著作', '推理', '文学经典', '电影', '工具书', '心理'])`],

      'contents|1-5': [`第@character("number")章：@cparagraph(1, 5)`],
      'subjects|1-3': [
        `@pick(['时间旅行—小说', '星际殖民—科幻题材', '蒸汽朋克—复古未来主义', '未来—文学作品—超现实叙事', '平行宇宙—幻想文学', '数字永生—赛博格主题', '中国—当代主题', '现代-歌剧', '记忆—文学表现'])`,
      ],
      'keywords|1-5': [`@pick(['AI', '散文', '报告', '真实故事', '推理', '批判', '悬疑', '现代歌剧', '哲学心理'])`],
      'awards|1-3': [`@pick(['国际布克奖', '星云奖', '雨果奖', '普利策奖', '艾略特诗歌奖', '科斯塔图书奖', '费米娜奖', '毕希纳奖', '凯特·格林纳威奖', '塞万提斯奖'])`],
    },
    instance: {
      isbn: '@id',
      publisher: `@pick(['中华书局', '生活·读书·新知三联书店', '上海译文出版社', '科学出版社', '广西师范大学出版社', '中信出版集团', '商务印书馆', '人民文学出版社'])`,
      place: '@city(true)',
      date: '@date',
      edition: '第@integer(1, 8)版',
      extent: '@integer(88, 888)页',
      binding: `@pick(['平装', '精装', '线装'])`,
      series: {
        title: '@ctitle(8, 18)',
        volume: '第@integer(1, 8)册',
      },
      cover: {
        url: [
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/65vweqve-bdds-y1nf-j615-anaxwf5xcy4w.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/8l80yvop-t818-c29i-2n0y-tc9if4hbpvbi.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/93d6jyhm-sjwe-tbfk-bbe8-rs8r4gcv7ww3.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/a38w2wfs-yvwg-acas-f6f1-j6zhnex4yw28.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/arta1313-xot3-nrcz-50d6-j4f1x5yizur6.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/byzia10a-essn-fm07-usro-to191l7u0vjo.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/ec0brs4r-bust-jb8y-bmh3-gea7wrf0bjc7.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/eqhx6lu6-mi64-fgbk-57b8-bpzk2yqjayuw.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/f3lnqahf-pugb-xup2-bpzh-sglehll787ct.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/ktlmi47d-n2dy-qjhq-4mqz-pfs5cg4lrp05.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/lfcw1nmi-54lo-gfa1-3lpv-hnkjpf95h4qr.jpg',
          'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/book/lx0za4n0-gi1f-38rg-ze63-ir4jixt5kbxw.jpg',
        ][i % 12],
        alt: '@csentence',
        size: '@natural(1024, 2097152)',
        format: 'jpg',
        color: '@color',
        thumbnail: '@image("50x50", "@color", "#FFF", "Thumbnail")',
        copyright: `@cword(4, 16) © @date('yyyy')`,
        source: '@domain',
      },
      'files|1-3': [
        {
          id: '@guid',
          uid: '@guid',
          name: '@ctitle(5, 20)',
          format: `@pick(['PDF', 'OTF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'ZIP', 'RAR'])`,
          size: '@natural(1024, 2097152)',
          url: '@url',
        },
      ],
    },
    community: {
      rating: '@float(0, 5, 1, 1)',
      review: '@integer(8, 88888)',
      'tags|1-5': [`@pick(['硬核科幻', '女性视角', '哲学思考', '赛博朋克', '魔幻现实主义', '非虚构写作', '太空歌剧', '心理悬疑', '都市'])`],
      'quotes|1-5': ['@csentence(8, 88)'],
      level: `@pick(['初级', '中级', '高级'])`,
      lexile: null,
    },
    circulation: {
      total: '@integer(8, 8888)',
      available: '@integer(8, 888)',
      borrowed: '@integer(8, 88)',
      status: '@pick([0, 1, 2, 3])',
      period: '@integer(0, 88)',
      library: '@city()图书馆',
      number: '@natural',
    },
  })
}
export default [
  {
    url: '/bookList/getList',
    method: 'get',
    response({ query }) {
      const { name, pageNo = 1, pageSize = 12, locale = 'zh-CN' } = query
      let _List = [...List[locale]]
      const data = _List.filter((item, index) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))
      data.sort(() => Math.random() - 0.5)
      return {
        code: 200,
        msg: 'success',
        data: { data, total: _List.length },
      }
    },
  },
]


// 审批工作流人员/组织选择器配置

import { avatarEmits } from "element-plus"

export default {
  // 配置接口正常返回代码
  successCode: 200,
  // 配置组织
  group: {
    // 请求接口对象
    apiObj: {
      url: '#',
      name: '获取部门列表',
      get: async function () {
        return {
          code: 200,
          data: [
            {
              id: '1',
              parentId: '0',
              label: '华南分部',
              date: '2022-10-10 08:00:00',
              remark: '',
              status: 1,
              sort: 1,
              children: [
                {
                  id: '11',
                  parentId: '1',
                  label: '售前客服部',
                  date: '2022-10-10 08:00:00',
                  remark: '',
                  status: 1,
                  sort: 2
                },
                {
                  id: '12',
                  parentId: '1',
                  label: '技术研发部',
                  date: '2022-10-10 08:00:00',
                  remark: '软件开发&测试',
                  status: 0,
                  sort: 3
                }
              ]
            },
            {
              id: '2',
              parentId: '0',
              label: '华东分部',
              date: '2022-10-10 08:00:00',
              remark: '',
              status: 1,
              sort: 4,
              children: [
                {
                  id: '21',
                  parentId: '2',
                  label: '售前客服部',
                  date: '2022-10-10 08:00:00',
                  remark: '',
                  status: 1,
                  sort: 5
                },
                {
                  id: '22',
                  parentId: '2',
                  label: '技术研发部',
                  date: '2022-10-10 08:00:00',
                  remark: '',
                  status: 1,
                  sort: 6
                }
              ]
            }
          ],
          message: ''
        }
      }
    },
    // 接受数据字段映射
    parseData: function (res) {
      return {
        rows: res.data,
        msg: res.message,
        code: res.code
      }
    },
    // 显示数据字段映射
    props: {
      key: 'id',
      label: 'label',
      children: 'children'
    }
  },
  // 配置用户
  user: {
    apiObj: {
      url: '#',
      name: '分页列表',
      get: async function () {
        return {
          code: 200,
          data: {
            total: 41,
            rows: [
              {
                id: '410000199512025445',
                name: '用户登录',
                url: '/oauth/token',
                type: 'GET',
                code: '401',
                cip: '95.214.92.71',
                user: '魏磊',
                time: '2012-09-05 18:08:06',
                avatar: 'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg'
              },
              {
                id: '520000198407304275',
                name: '用户登录',
                url: '/oauth/token',
                type: 'GET',
                code: '500',
                cip: '129.166.168.115',
                user: '史平',
                time: '1993-08-25 05:08:41'
              },
              {
                id: '230000199511014097',
                name: '用户登录',
                url: '/oauth/token',
                type: 'GET',
                code: '200',
                cip: '186.160.119.210',
                user: '于杰',
                time: '1998-02-09 13:42:41',
                avatar: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
              },
              {
                id: '990000197205236780',
                name: '用户登录',
                url: '/oauth/token',
                type: 'POST',
                code: '401',
                cip: '193.14.94.222',
                user: '田娟',
                time: '2009-11-05 12:37:58',
                avatar: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg'
              },
              {
                id: '640000200911201176',
                name: '用户登录',
                url: '/oauth/token',
                type: 'GET',
                code: '500',
                cip: '12.69.226.121',
                user: '邵涛',
                time: '1989-08-25 05:33:06'
              },
              {
                id: '710000198709077149',
                name: '用户登录',
                url: '/oauth/token',
                type: 'GET',
                code: '500',
                cip: '116.42.15.149',
                user: '魏娟',
                time: '2008-09-07 10:35:41'
              },
              {
                id: '360000197302144442',
                name: '用户登录',
                url: '/oauth/token',
                type: 'GET',
                code: '500',
                cip: '239.114.89.252',
                user: '王国维',
                time: '2016-07-14 20:41:53',
                avatar: 'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg'
              },
              {
                id: '500000199407048831',
                name: '用户登录',
                url: '/oauth/token',
                type: 'GET',
                code: '401',
                cip: '95.203.182.52',
                user: '傅刚',
                time: '1995-03-09 23:53:50'
              },
              {
                id: '450000198307033289',
                name: '用户登录',
                url: '/oauth/token',
                type: 'GET',
                code: '500',
                cip: '60.137.195.112',
                user: '康伟',
                time: '1970-01-13 19:18:19'
              },
              {
                id: '220000200908305857',
                name: '用户登录',
                url: '/oauth/token',
                type: 'POST',
                code: '500',
                cip: '106.167.1.227',
                user: '璀玉隆',
                time: '1976-01-01 14:27:22',
                avatar: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
              },
              {
                id: '450000201411302578',
                name: '用户登录',
                url: '/oauth/token',
                type: 'GET',
                code: '401',
                cip: '241.235.41.98',
                user: '吴涛',
                time: '2003-10-22 18:03:07'
              },
              {
                id: '81000020100227047X',
                name: '用户登录',
                url: '/oauth/token',
                type: 'GET',
                code: '200',
                cip: '120.218.167.233',
                user: '毛军',
                time: '1983-12-27 22:13:35'
              },
              {
                id: '420000198411242296',
                name: '用户登录',
                url: '/oauth/token',
                type: 'GET',
                code: '500',
                cip: '123.130.209.70',
                user: '张霞',
                time: '2008-06-17 01:36:50'
              },
              {
                id: '460000201605269026',
                name: '用户登录',
                url: '/oauth/token',
                type: 'POST',
                code: '500',
                cip: '79.243.107.181',
                user: '段超',
                time: '1980-01-16 19:59:55'
              },
              {
                id: '610000200506056280',
                name: '用户登录',
                url: '/oauth/token',
                type: 'POST',
                code: '200',
                cip: '14.23.92.219',
                user: '宋涛',
                time: '1986-10-19 11:28:05'
              },
              {
                id: '370000197405268159',
                name: '用户登录',
                url: '/oauth/token',
                type: 'POST',
                code: '500',
                cip: '233.81.94.91',
                user: '石勇',
                time: '2012-04-29 21:58:34'
              },
              {
                id: '440000200407105727',
                name: '用户登录',
                url: '/oauth/token',
                type: 'POST',
                code: '200',
                cip: '178.29.69.222',
                user: '贾超',
                time: '1989-09-28 16:26:08'
              },
              {
                id: '45000019760731722X',
                name: '用户登录',
                url: '/oauth/token',
                type: 'GET',
                code: '500',
                cip: '117.35.28.120',
                user: '汤强',
                time: '1975-05-24 14:29:46'
              }
            ]
          },
          message: ''
        }
      }
    },
    pageSize: 20,
    parseData: function (res) {
      return {
        rows: res.data.rows,
        total: res.data.total,
        msg: res.message,
        code: res.code
      }
    },
    props: {
      key: 'id',
      label: 'user'
    },
    request: {
      page: 'page',
      pageSize: 'pageSize',
      groupId: 'groupId',
      keyword: 'keyword'
    }
  },
  // 配置角色
  role: {
    // 请求接口对象
    apiObj: {
      url: '#',
      name: '获取角色列表',
      get: async function () {
        return {
          code: 200,
          data: {
            total: 2,
            page: 1,
            pageSize: 20,
            rows: [
              {
                id: '1',
                label: '超级管理员',
                alias: 'SA',
                sort: 1,
                status: '1',
                remark: '内置超级管理员角色',
                date: '2020-05-07 09:30:00'
              },
              {
                id: '2',
                label: '业务管理员',
                alias: 'Business Administrator',
                sort: 2,
                status: '1',
                remark: '',
                date: '2020-05-07 09:30:00'
              },
              {
                id: '3',
                label: '文章管理员',
                alias: 'Article administrator',
                sort: 3,
                status: '0',
                remark: '',
                date: '2020-05-07 09:30:00'
              },
              {
                id: '4',
                label: '发布人员',
                alias: 'publish',
                sort: 4,
                status: '1',
                remark: '',
                date: '2020-05-07 09:30:00'
              }
            ]
          },
          message: ''
        }
      }
    },
    // 接受数据字段映射
    parseData: function (res) {
      return {
        rows: res.data.rows,
        msg: res.message,
        code: res.code
      }
    },
    // 显示数据字段映射
    props: {
      key: 'id',
      label: 'label',
      children: 'children'
    }
  }
}

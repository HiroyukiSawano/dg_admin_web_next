import _ from 'lodash'
import { translate } from '@/locales'
const demo1 = [
  {
    id: '13272548-5bf0-476f-8d75-cf2e2a019ef1',
    title: translate('ec.dashboard.custom.card.8d75.title', { 'en': { 'ec.dashboard.custom.card.8d75.title': 'Geographic Beacons' }, 'zh-CN': { 'ec.dashboard.custom.card.8d75.title': '地理信标总计' } }),
    key: 'CardStatistic',
    grid: { column: 6, row: 1 },
    data: {
      icon: 'ri-shapes-fill',
      label: translate('ec.dashboard.custom.card.8d75.title', { 'en': { 'ec.dashboard.custom.card.8d75.title': 'Geographic Beacons' }, 'zh-CN': { 'ec.dashboard.custom.card.8d75.title': '地理信标' } }),
      value: 33
    }
  },
  {
    id: 'b4e3cb4a-f366-4876-bc38-7ec514c6c88a',
    title: translate('ec.dashboard.custom.card.f366.title', { 'en': { 'ec.dashboard.custom.card.f366.title': 'Connected Beacon' }, 'zh-CN': { 'ec.dashboard.custom.card.f366.title': '已连接信标' } }),
    key: 'CardStatistic',
    grid: { column: 6, row: 1 },
    data: {
      icon: 'ri-pushpin-fill',
      label: translate('ec.dashboard.custom.card.f366.title', { 'en': { 'ec.dashboard.custom.card.f366.title': 'Connected Beacon' }, 'zh-CN': { 'ec.dashboard.custom.card.f366.title': '已连接信标' } }),
      value: 5345
    }
  },
  {
    id: 'd0bc859b-2ecc-4f80-86b9-7b5596e9485b',
    key: 'CardStatistic',
    title: translate('ec.dashboard.custom.card.4f80.title', { 'en': { 'ec.dashboard.custom.card.4f80.title': 'Detected Beacon' }, 'zh-CN': { 'ec.dashboard.custom.card.4f80.title': '已检测信标' } }),
    grid: { column: 6, row: 1 },
    data: {
      icon: 'ri-stock-fill',
      label: translate('ec.dashboard.custom.card.4f80.title', { 'en': { 'ec.dashboard.custom.card.4f80.title': 'Detected Beacon' }, 'zh-CN': { 'ec.dashboard.custom.card.4f80.title': '已检测信标' } }),
      value: 674
    }
  },
  {
    id: '11c85508-21da-4b6b-9ab9-4ed2a44f26ff',
    key: 'CardStatistic',
    title: translate('ec.dashboard.custom.card.4b6b.title', { 'en': { 'ec.dashboard.custom.card.4b6b.title': 'Obsolete Beacon' }, 'zh-CN': { 'ec.dashboard.custom.card.4b6b.title': '已废弃信标' } }),
    grid: { column: 6, row: 1 },
    data: {
      icon: 'ri-time-fill',
      label: translate('ec.dashboard.custom.card.4b6b.title', { 'en': { 'ec.dashboard.custom.card.4b6b.title': 'Obsolete Beacon' }, 'zh-CN': { 'ec.dashboard.custom.card.4b6b.title': '已废弃信标' } }),
      value: 8068
    }
  },
  {
    id: '10bf61c4-aa22-4a01-bf39-23dc9370b43e',
    title: translate('ec.dashboard.custom.card.4a01.title', { 'en': { 'ec.dashboard.custom.card.4a01.title': 'Geographical Time Precipitation & Evaporation' }, 'zh-CN': { 'ec.dashboard.custom.card.4a01.title': '地理时间降水蒸发量' } }),
    key: 'CardChartBar',
    grid: { column: 12, row: 3 },
    data: {
      data: [
        { name: '11.1', pt: _.random(8, 88), et: _.random(8, 88) },
        { name: '11.2', pt: _.random(8, 88), et: _.random(8, 88) },
        { name: '11.3', pt: _.random(8, 88), et: _.random(8, 88) },
        { name: '11.4', pt: _.random(8, 88), et: _.random(8, 88) },
        { name: '11.5', pt: _.random(8, 88), et: _.random(8, 88) },
        { name: '11.6', pt: _.random(8, 88), et: _.random(8, 88) },
        { name: '11.7', pt: _.random(8, 88), et: _.random(8, 88) },
      ],
      option: {
        series: [
          {
            name: translate('ec.dashboard.custom.chart.bar.option.standardPrecipitation', { 'en': { 'ec.dashboard.custom.chart.bar.option.standardPrecipitation': 'Standard Precipitation' }, 'zh-CN': { 'ec.dashboard.custom.chart.bar.option.standardPrecipitation': '国标降水量' } }),
            type: 'bar',
            barWidth: '15%',
          },
          {
            name: translate('ec.dashboard.custom.chart.bar.option.standardEvaporation', { 'en': { 'ec.dashboard.custom.chart.bar.option.standardEvaporation': 'Standard Evaporation' }, 'zh-CN': { 'ec.dashboard.custom.chart.bar.option.standardEvaporation': '国标蒸发量' } }),
            type: 'bar',
            barWidth: '15%',
          }
        ]
      }
    }
  },

  {
    id: '0ed9bd72-0b33-4b11-8ab2-125a09e454e0',
    title: translate('ec.dashboard.custom.card.8ab2.title', { 'en': { 'ec.dashboard.custom.card.8ab2.title': 'Geographical Data Source Channels' }, 'zh-CN': { 'ec.dashboard.custom.card.8ab2.title': '地理数据来源渠道' } }),
    key: 'CardChartPie',
    grid: { column: 12, row: 3 },
    data: {
      data: [
        { value: _.random(8, 88), name: translate('ec.dashboard.custom.chart.pie.option.engine', { 'en': { 'ec.dashboard.custom.chart.pie.option.engine': 'Search Engine' }, 'zh-CN': { 'ec.dashboard.custom.chart.pie.option.engine': '搜索引擎' } }) },
        { value: _.random(8, 88), name: translate('ec.dashboard.custom.chart.pie.option.direct', { 'en': { 'ec.dashboard.custom.chart.pie.option.direct': 'Direct Access' }, 'zh-CN': { 'ec.dashboard.custom.chart.pie.option.direct': '直接访问' } }) },
        { value: _.random(8, 88), name: translate('ec.dashboard.custom.chart.pie.option.email', { 'en': { 'ec.dashboard.custom.chart.pie.option.email': 'Email Market' }, 'zh-CN': { 'ec.dashboard.custom.chart.pie.option.email': '邮件营销' } }) },
        { value: _.random(8, 88), name: translate('ec.dashboard.custom.chart.pie.option.alliance', { 'en': { 'ec.dashboard.custom.chart.pie.option.alliance': 'Alliance AD' }, 'zh-CN': { 'ec.dashboard.custom.chart.pie.option.alliance': '联盟广告' } }) },
        { value: _.random(8, 88), name: translate('ec.dashboard.custom.chart.pie.option.video', { 'en': { 'ec.dashboard.custom.chart.pie.option.video': 'Video AD' }, 'zh-CN': { 'ec.dashboard.custom.chart.pie.option.video': '视频广告' } }) },
      ],
      option: {
        series: [
          {
            radius: ['40%', '65%'],
          }
        ]
      }
    }
  },
  {
    id: 'badd65c7-c3bb-4ece-b297-b480944342a0',
    title: translate('ec.dashboard.custom.card.b297.title', { 'en': { 'ec.dashboard.custom.card.b297.title': 'Geographic Beacon Area Distribution' }, 'zh-CN': { 'ec.dashboard.custom.card.b297.title': '地理信标地区分布' } }),
    key: 'CardChartScatter',
    grid: { column: 24, row: 3 },
    data: {
      data: [
        [_.random(8, 88), _.random(8, 88)],
        [_.random(8, 88), _.random(8, 88)],
        [_.random(8, 88), _.random(8, 88)],
        [_.random(8, 88), _.random(8, 88)],
        [_.random(8, 88), _.random(8, 88)],
        [_.random(8, 88), _.random(8, 88)],
        [_.random(8, 88), _.random(8, 88)],
        [_.random(8, 88), _.random(8, 88)],
        [_.random(8, 88), _.random(8, 88)],
        [_.random(8, 88), _.random(8, 88)],
        [_.random(8, 88), _.random(8, 88)],
        [_.random(8, 88), _.random(8, 88)],
        [_.random(8, 88), _.random(8, 88)],
        [_.random(8, 88), _.random(8, 88)],
      ],
      option: {
        tooltip: {
          trigger: 'item',
        },
        xAxis: {
          type: 'category',
        },
        yAxis: {
          type: 'value',
        },
      }
    }
  },
]
const demo2 = [
  {
    id: 'd5285b0a-ca1a-8b08-b1c6-8533e634a991',
    title: translate('ec.dashboard.custom.card.8b08.title', { 'en': { 'ec.dashboard.custom.card.8b08.title': 'Geographic Beacons' }, 'zh-CN': { 'ec.dashboard.custom.card.8b08.title': '地理信标总计' } }),
    key: 'CardStatistic',
    grid: { column: 6, row: 1 },
    data: {
      icon: 'ri-token-swap-fill',
      label: translate('ec.dashboard.custom.card.8b08.title', { 'en': { 'ec.dashboard.custom.card.8b08.title': 'Geographic Beacons' }, 'zh-CN': { 'ec.dashboard.custom.card.8b08.title': '地理信标' } }),
      value: 566
    }
  },
  {
    id: 'eb688d4f-a3eb-b919-ca3b-b5971eba49ce',
    title: translate('ec.dashboard.custom.card.f366.title', { 'en': { 'ec.dashboard.custom.card.f366.title': 'Connected Beacon' }, 'zh-CN': { 'ec.dashboard.custom.card.f366.title': '已连接信标' } }),
    key: 'CardStatistic',
    grid: { column: 6, row: 1 },
    data: {
      icon: 'ri-discount-percent-fill',
      label: translate('ec.dashboard.custom.card.f366.title', { 'en': { 'ec.dashboard.custom.card.f366.title': 'Connected Beacon' }, 'zh-CN': { 'ec.dashboard.custom.card.f366.title': '已连接信标' } }),
      value: 88
    }
  },
  {
    id: '2e4dedde-c5c3-f183-1cc3-c736d82f5e44',
    key: 'CardMap',
    title: translate('ec.dashboard.custom.card.1cc3.title', { 'en': { 'ec.dashboard.custom.card.1cc3.title': 'Map' }, 'zh-CN': { 'ec.dashboard.custom.card.1cc3.title': '地图' } }),
    grid: { column: 12, row: 2 },
    data: {
      ak: 'qxMwDOELvGQDLxEYcde9rTY7Gbx8eXzy'
    }
  },
  {
    id: '5fbc9284-959e-a765-1f03-dc870407b094',
    key: 'CardStatistic',
    title: translate('ec.dashboard.custom.card.4f80.title', { 'en': { 'ec.dashboard.custom.card.4f80.title': 'Detected Beacon' }, 'zh-CN': { 'ec.dashboard.custom.card.4f80.title': '已检测信标' } }),
    grid: { column: 6, row: 1 },
    data: {
      icon: 'ri-aed-electrodes-fill',
      label: translate('ec.dashboard.custom.card.4f80.title', { 'en': { 'ec.dashboard.custom.card.4f80.title': 'Detected Beacon' }, 'zh-CN': { 'ec.dashboard.custom.card.4f80.title': '已检测信标' } }),
      value: 355
    }
  },
  {
    id: '471fef27-55e6-4dbb-e6ff-b00a9df631ea',
    key: 'CardStatistic',
    title: translate('ec.dashboard.custom.card.4b6b.title', { 'en': { 'ec.dashboard.custom.card.4b6b.title': 'Obsolete Beacon' }, 'zh-CN': { 'ec.dashboard.custom.card.4b6b.title': '已废弃信标' } }),
    grid: { column: 6, row: 1 },
    data: {
      icon: 'ri-apps-2-add-fill',
      label: translate('ec.dashboard.custom.card.4b6b.title', { 'en': { 'ec.dashboard.custom.card.4b6b.title': 'Obsolete Beacon' }, 'zh-CN': { 'ec.dashboard.custom.card.4b6b.title': '已废弃信标' } }),
      value: 9874
    }
  },
  {
    id: '8141179d-7c13-8943-81da-43cfed12348e',
    title: translate('ec.dashboard.custom.card.4a01.title', { 'en': { 'ec.dashboard.custom.card.4a01.title': 'Geographical Time Precipitation & Evaporation' }, 'zh-CN': { 'ec.dashboard.custom.card.4a01.title': '地理时间降水蒸发量' } }),
    key: 'CardChartLine',
    grid: { column: 12, row: 3 },
    data: {
      data: [
        { name: '11.1', pt: _.random(8, 88), et: _.random(8, 88) },
        { name: '11.2', pt: _.random(8, 88), et: _.random(8, 88) },
        { name: '11.3', pt: _.random(8, 88), et: _.random(8, 88) },
        { name: '11.4', pt: _.random(8, 88), et: _.random(8, 88) },
        { name: '11.5', pt: _.random(8, 88), et: _.random(8, 88) },
        { name: '11.6', pt: _.random(8, 88), et: _.random(8, 88) },
        { name: '11.7', pt: _.random(8, 88), et: _.random(8, 88) },
      ],
      option: {
        series: [
          {
            name: translate('ec.dashboard.custom.chart.bar.option.standardPrecipitation', { 'en': { 'ec.dashboard.custom.chart.bar.option.standardPrecipitation': 'Standard Precipitation' }, 'zh-CN': { 'ec.dashboard.custom.chart.bar.option.standardPrecipitation': '国标降水量' } }),
            type: 'bar',
            barWidth: '15%'
          },
          {
            name: translate('ec.dashboard.custom.chart.bar.option.standardEvaporation', { 'en': { 'ec.dashboard.custom.chart.bar.option.standardEvaporation': 'Standard Evaporation' }, 'zh-CN': { 'ec.dashboard.custom.chart.bar.option.standardEvaporation': '国标蒸发量' } }),
            type: 'bar',
            barWidth: '15%'
          }
        ]
      }
    }
  },

  {
    id: '80eb5f0c-b545-1b10-9dd6-5c63972c8551',
    title: translate('ec.dashboard.custom.card.8ab2.title', { 'en': { 'ec.dashboard.custom.card.8ab2.title': 'Geographical Data Source Channels' }, 'zh-CN': { 'ec.dashboard.custom.card.8ab2.title': '地理数据来源渠道' } }),
    key: 'CardList',
    grid: { column: 12, row: 3 },
    data: [
      { id: '1', name: '中国历史文化名街东关街上最扬州的味道', type: '咨询', tag: '', time: '2024-03-04' },
      { id: '2', name: '中国重庆世界上唯一建在平行岭谷的大城市', type: '投诉', tag: 'danger', time: '2024-03-04' },
      { id: '3', name: '鳞次栉比的吊脚楼层层叠叠的梯田潺潺流过的溪流乌英屯自然风景秀丽', type: '求助', tag: 'warning', time: '2024-03-04' },
      { id: '5', name: '新疆阿勒泰雪后喀纳斯湖美如仙境', type: '表扬', tag: 'success', time: '2024-03-04' },
      { id: '6', name: '四川省阿坝藏族羌族自治州理县理小路沿线迎来降雪', type: '其他', tag: 'info', time: '2024-03-04' },
    ]
  },
  {
    id: '21e23d06-2b77-5794-0182-54384a1bc41c',
    title: translate('ec.dashboard.custom.card.b297.title', { 'en': { 'ec.dashboard.custom.card.b297.title': 'Geographic Beacon Area Distribution' }, 'zh-CN': { 'ec.dashboard.custom.card.b297.title': '地理信标地区分布' } }),
    key: 'CardTable',
    grid: { column: 24, row: 4 },
    data: [
      {
        code: 1,
        type: '4',
        name: '雨水井盖',
        count: 0,
        time: '2088-08-08 08:08:08',
        description: '标有“城建、市政、建设局、雨水、雨” 等字样的地下雨水管道的井盖',
        status: 1
      },
      {
        code: 2,
        type: '4',
        name: '上水井盖',
        count: 0,
        time: '2088-08-08 08:08:08',
        description: '标有“供水、给水、自来水公司、水闸、水门、水表”等字样的地下给水管道的井盖',
        status: 0
      },
      {
        code: 3,
        name: '污水井盖',
        type: '4',
        count: 0,
        time: '2088-08-08 08:08:08',
        description: '标有“污水、污”等字样的地下污水管道的井盖',
        status: 1
      },
      {
        code: 4,
        name: '电力井盖',
        type: '4',
        count: 88,
        time: '2088-08-08 08:08:08',
        description: '标有“电力”等字样的电力设备地下专用管道的井盖',
        status: 0
      },
      {
        code: 5,
        name: '治安岗亭',
        type: '4',
        time: '2088-08-08 08:08:08',
        count: 0,
        description: '公安部门设立的岗亭',
        status: 1
      },
      {
        code: 6,
        type: '4',
        name: '交通信号灯',
        count: 0,
        time: '2088-08-08 08:08:08',
        description: '指安装在道路两旁指挥车辆和行人通行的信号装备',
        status: 1
      },
      {
        code: 7,
        type: '4',
        name: '交通标志牌',
        count: 0,
        time: '2088-08-08 08:08:08',
        description: '指交通引导作用的指示牌、无障碍设施指示牌、地铁站指示牌、公安交警指示牌、交通反视镜等',
        status: 1
      },
      {
        code: 8,
        type: '4',
        name: '监控电子眼',
        count: 0,
        time: '2088-08-08 08:08:08',
        description: '指安装在公共场所用于监控的电子设备，含各种监控探头',
        status: 0
      },
      {
        code: 9,
        type: '4',
        name: '停车场',
        count: 0,
        time: '2088-08-08 08:08:08',
        description: '经许可停放车辆的场所，含路边停车场',
        status: 1
      },
      {
        code: 10,
        type: '4',
        name: '公交站亭',
        count: 0,
        time: '2088-08-08 08:08:08',
        description: '指供乘客上下车而设置的固定停车点，含公交起点和终点停车场',
        status: 1
      }
    ]
  },
]

export { demo1, demo2 }

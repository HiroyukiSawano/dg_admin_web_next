//表格选择器配置

export default {
	pageSize: 10,
	parseData: (res) =>{
		return {
			data: res.data,
			rows: res.data.rows,
			total: res.data.total,
			msg: res.message,
			code: res.code
		}
	},
	request: {
		page: 'page',
		pageSize: 'pageSize',
		keyword: 'keyword'
	},
	props: {
		label: 'label',
		value: 'value',
	}
}

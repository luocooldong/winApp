var wallet = new Vue({
	el: '#wallet',
	data: {
		wx_userInfo:Object,
		sys_userInfo:Object,
		made_power:'',
		wallet:Object,
		alco_value:'',
		todayprice:0,
		names: [],
		datas: [],
		charts: [],
		drawList: [],
		chart: 0,
		
	},
	watch:{'chart': function(newValue, oldValue) {

			this.getChart()
		}},
	mounted: function() {
		//this.wx_userInfo = JSON.parse(localStorage.getItem("wx_userInfo"))
		this.sys_userInfo = JSON.parse(localStorage.getItem("sys_userInfo"))
		this.getValueAndPower()
		this.getWallet()
		this.getChart()
		this.gettodayprice()
	},
	methods: {
		switchChart: function(i) {
			this.chart = i
		},
		getChart: function() {
			this.names = []
			this.datas = []
			var _this = this
			axios({
				url: base_url + '/property/charts',
				method: 'POST',
				timeout: 50000,
				// 设置请求头
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
			 	_this.charts = res.data.data
				if(_this.chart == 0) {
					_this.drawList = _this.charts.slice(0, 7)
				}
				if(_this.chart == 1) {
					_this.drawList = _this.charts.slice(0, 30)
				}
				if(_this.chart == 2) {
					_this.drawList = _this.charts.slice(0, 90)
				}
		
				_this.drawLine() 
			})
		},
		gettodayprice: function() {
			var _this = this
			axios({
				url: base_url + '/alco/getPriceToday',
				method: 'POST',
				// 请求体重发送的数据
				params: {
		
				},
				timeout: 50000,
				// 设置请求头
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				if(res.status == "200") {
					_this.todayprice = res.data.priceToday
				}
			})
		},
		alcoValueHistory:function(){
			openWin('wine-history.html')
		},
		getValueAndPower:function(){
				var _this = this
				axios({
						url: base_url + '/user/getValueAndPower',
						method: 'POST',
						// 请求体重发送的数据
						params: {
							'id':_this.sys_userInfo.id
						},
						timeout: 50000,
						// 设置请求头
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
				}).then(function(res) {
						if(res.status=="200"){
							_this.made_power = res.data.data.madePower
							_this.alco_value = res.data.data.alcoValue
						} 
						
							

					})
		},	getWallet:function(){
			var _this = this
				axios({
						url: base_url + '/user/getWallet',
						method: 'POST',
						// 请求体重发送的数据
						params: {
							'user.id':_this.sys_userInfo.id
						},
						timeout: 50000,
						// 设置请求头
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
				}).then(function(res) {
						if(res.status=="200"){
							_this.wallet = res.data.data
						}
						
							

					})
		},
				drawLine: function() {
				var _this = this
				var arr = _this.drawList;
				for(var i = 0; i < arr.length; i++) {
					_this.names.push(_this.drawList[i].create_date)
					_this.datas.push(_this.drawList[i].price_today)
			
				}
				var myChart = echarts.init(document.getElementById('lineChart'));
				// 指定图表的配置项和数据
				var option = {
					color: "#ffa128",
					tooltip: {
						trigger: 'none',
						axisPointer: {
							type: 'cross'
						}
					},
					grid: {
						top: 10,
						bottom: 50
					},
					xAxis: [{
						type: 'category',
						axisTick: {
							alignWithLabel: true
						},
						axisLine: {
							onZero: false,
			
						},
						axisPointer: {
							label: {
								formatter: function(params) {
									return params.value +
										(params.seriesData.length ? ', ￥' + params.seriesData[0].data : '');
								}
							}
						},
						data: _this.names.reverse()
					}],
					yAxis: [{
						type: 'value'
					}],
					series: [{
						name: '价格',
						type: 'line',
						xAxisIndex: 0,
						smooth: true,
						data: _this.datas.reverse()
					}]
				};
			
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
			}
		
	},
});
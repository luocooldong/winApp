var sjSell = new Vue({
	el: '#sjSell',
	data: {
		sellCount: null,
		sellPrice: null,
		alcoValue: 0,
		market_max_value: "",
		market_min_price_str: "",
		market_server_fee: "",
		market_max_value: "",
		market_min_price: "",
		todayprice: "",
		wallet: Object,
		sys_userInfo: Object
	},
	filters: {
		phoneFilter: function(value) {
			if(value) {
				var hide = value.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
				return hide;
			}
		},
		nameFilter: function(value) {
			if(value) {
				var str = value.length > 3 ? '**' + (value.substr(2)) : '*' + (value.substr(1))
				return str;
			}
		}
	},
	mounted: function() {
		this.gettodayprice()
		this.sys_userInfo = JSON.parse(localStorage.getItem("sys_userInfo"))
		this.getWallet()
		this.getMarketConfig()
		this.getValueAndPower()
	},
	methods: {
		submitSell: function() {
				var _this = this
			mui.plusReady(function() {
				_this.sellPrice = _this.todayprice
				if(_this.sellPrice == null) {
					mui.toast("请填写出售价格")
					return
				}
				if(Number(_this.market_min_price.value) > _this.sellPrice ) {
					mui.toast("不得低于"+_this.market_min_price_str)
					return
				}
				
				if(_this.sellCount == null) {
					mui.toast("请填写出售数量")
					return
				}
				
				if(_this.sellCount > parseInt(_this.alcoValue) * _this.market_max_value.value) {
					mui.toast("可出售TTI不足")
					return
				}
				if(_this.sellCount < 1) {
					mui.toast("最少出售1个")
					return
				}
				
				plus.nativeUI.showWaiting()
			
				axios({
					url: base_url + '/alco/addMarket',
					method: 'POST',
					// 请求体重发送的数据
					params: {
						'sellerId': JSON.parse(localStorage.sys_userInfo).id,
						"alcoCount":_this.sellCount,
						"alcoPrice":_this.sellPrice,
						"status":0
					},
					timeout: 50000,
					// 设置请求头
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res) {
				/*	 var html1 = plus.webview.getWebviewById('index.html');
							    if(html1){
								 html1.fire()
					}
					var html2 = plus.webview.getWebviewById('wine-history.html');
							    if(html2){
								 html2.fire()
					}*/
					if(res.status == "200") {
						mui.toast(res.data.msg)
							_this.sellCount=null
							//_this.sellPrice= null
						plus.nativeUI.closeWaiting()
						var html1 = plus.webview.getWebviewById('wine-history.html');
							    if(html1){
								 html1.reload()
					}
					}

				})

			})

		},
		allSell: function() {
			//if( parseInt(this.alcoValue) * this.market_max_value.value){return}
			this.sellCount = parseInt(this.alcoValue) * this.market_max_value.value
		},
		getValueAndPower: function() {
			var _this = this
			axios({
				url: base_url + '/user/getValueAndPower',
				method: 'POST',
				// 请求体重发送的数据
				params: {
					'id': JSON.parse(localStorage.sys_userInfo).id
				},
				timeout: 50000,
				// 设置请求头
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				if(res.status == "200") {
					_this.alcoValue = res.data.data.alcoValue
				}

			})
		},
		getMarketConfig: function() {
			var _this = this
			axios({
				url: base_url + '/alco/getMarketConfig',
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
					_this.market_server_fee = res.data.market_server_fee
					_this.market_max_value = res.data.market_max_value
					_this.market_min_price = res.data.market_min_price
					_this.market_min_price_str = "不得低于" + _this.market_min_price.value + "元/个"
				}
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
		getWallet: function() {
			var _this = this
			axios({
				url: base_url + '/user/getWallet',
				method: 'POST',
				// 请求体重发送的数据
				params: {
					'user.id': _this.sys_userInfo.id
				},
				timeout: 50000,
				// 设置请求头
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				if(res.status == "200") {
					_this.wallet = res.data.data
				}

			})
		},
	},
});
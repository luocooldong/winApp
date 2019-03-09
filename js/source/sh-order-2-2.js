var order1 = new Vue({
	el: '#order1',
	data: {
		sys_userInfo: Object,
		list: []
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
	watch: {　　　　　

	},
	mounted: function() {
		this.sys_userInfo = JSON.parse(localStorage.getItem("sys_userInfo"))
		this.getList()
	},
	methods: {
		call:function(i){
			mui.plusReady(function(){  
				plus.device.dial(i, false);
			});  
			
		},
			complain:function(i){
				var btnArray = ['取消', '确认'];
				mui.confirm('提申诉后订单将进入申诉状态并交于客服处理,是否确认提交？', '提示', btnArray, function(e) {
					if (e.index == 1) {
						localStorage.setItem("complain",JSON.stringify(i))
						openWin("complain.html")
					} else {
					
					}
				})
		},
		getPay:function(i){
			var btnArray = ['取消', '确认'];
			mui.confirm('为避免给您带来不必要的纠纷，请确认是否已已收到买家支付宝打款', '提示', btnArray, function(e) {
				if (e.index == 1) {
							var _this = this 
			axios({
				url: base_url + '/user/getPay',
				method: 'POST',
				// 请求体重发送的数据
				params: {
					"id":i.id
				},
				timeout: 50000,
				// 设置请求头
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				if(res.status == "200") {
					mui.toast("交易已完成")
					 window.location.reload()
				}

			})				
				} 
			})
	
		},
		getList: function() {
			var _this = this
			axios({
				url: base_url + '/user/myMarketOrderSell',
				method: 'POST',
				// 请求体重发送的数据
				params: {
					'sellerId': _this.sys_userInfo.id,
					'status': 3
				},
				timeout: 50000,
				// 设置请求头
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				if(res.status == "200") {
					console.log(_this.list.length)
					_this.list = res.data.data
				}

			})
		}
	},
});
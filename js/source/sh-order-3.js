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
		hasPayed: function(i) {
			var _this = this
			var btnArray = ['取消', '确认'];
			mui.confirm('为避免给您带来不必要的纠纷，请确认是否已打款至卖家指定支付宝账户', '提示', btnArray, function(e) {
				if(e.index == 1) {
					_this.payedOption(i)
				} 
			})
		},
		payedOption:function(i){
				var _this = this
			axios({
				url: base_url + '/alco/payedOption',
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
					mui.toast(res.data.msg)
					_this.getList()
			
				}
			})
		},
		getList: function() {
			var _this = this
			axios({
				url: base_url + '/user/myMarketOrderBought',
				method: 'POST',
				// 请求体重发送的数据
				params: {
					'boughterId': _this.sys_userInfo.id,
					'status': 1
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
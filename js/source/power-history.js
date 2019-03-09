var powerHistory = new Vue({
	el: '#powerHistory',
	data: {
	madePower:0
		
	},
	mounted: function() {
		this.getValueAndPower()
	},
	methods: {
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
					_this.madePower = res.data.data.madePower
				}

			})
		},
		
	},
});
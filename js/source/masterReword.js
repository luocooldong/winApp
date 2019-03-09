var mr = new Vue({
	el: '#mr',
	data: {
		gz:0,
		sys_userInfo: Object,
		showShare: 0,
		fans: [],
	},
	mounted: function() {
		this.sys_userInfo = JSON.parse(localStorage.getItem("sys_userInfo"))
		this.getFans()
	},
	methods: {
		openGz:function(){
			this.gz = 1
		},
		closeGz:function(){
			this.gz = 0
		},
		toShare: function(i) {
			this.showShare = 0
			openWin('share-' + i + '.html')
		},
		openShare: function() {
			this.showShare = 1
		},
		closeShare: function() {
			this.showShare = 0
		},getFans: function() {
			var _this = this
			axios({
				url: base_url + '/user/getFans',
				method: 'POST',
				// 请求体重发送的数据
				params: {
					id: _this.sys_userInfo.id
				},
				timeout: 50000,
				// 设置请求头
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				if(res.status == "200") {
					_this.fans = res.data.data
				}
			})
		}

	},
});
var fans = new Vue({
	el: '#fans',
	data: {
		sys_userInfo: Object,
		fans: [],
		hgfs:0,

		
	},
	mounted: function() {
		this.sys_userInfo = JSON.parse(localStorage.getItem("sys_userInfo"))
		this.getFans()
	},
	methods: {
		getFans: function() {
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
					for(var i=0;i<_this.fans.length;i++){
						if(_this.fans[i].wallet&&_this.fans[i].wallet>0){
							_this.hgfs  = _this.hgfs + 1
						}
					}
				}
			})
		}
	},
});
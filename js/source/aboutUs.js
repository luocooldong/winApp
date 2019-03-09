var acoutUs = new Vue({
	el: '#acoutUs',
	data: {
	photoSrc:photo_src,
	aboutUs:Object
		
	},
	mounted: function() {
 			this.getAountUs()
	},
	methods: {
		getAountUs: function() {
	
			var _this = this
			axios({
				url: base_url + '/property/aboutUs',
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
					_this.aboutUs = res.data
				}
			})
		}
	},
});
var record = new Vue({
	el: '#record',
	data: {
	  list:[]
	},
	mounted: function() {
		this.getList()
	},
	methods: {
		getList:function(){ 
			
			var _this = this
			axios({
				url: base_url + '/alco/alcoValueDetails',
				method: 'POST',
				// 请求体重发送的数据
				params: {
					'user.id': JSON.parse(localStorage.sys_userInfo).id
				},
				timeout: 50000,
				// 设置请求头
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				if(res.status == "200") {
					_this.list = res.data.data	
				}

			})	
		}		
	},
});
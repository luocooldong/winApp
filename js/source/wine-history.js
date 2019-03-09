var wineHistory = new Vue({
	el: '#wineHistory',
	data: {
		alcoValue:0,
		freezValue:null,
		wallet:Object,
	},
	mounted: function() {
		this.getValueAndPower()
		this.getWallet()
	},
	filters: {

	},
	methods: {
		getWallet:function(){
			var _this = this
				axios({
						url: base_url + '/user/getWallet',
						method: 'POST',
						// 请求体重发送的数据
						params: {
							'user.id':JSON.parse(localStorage.sys_userInfo).id
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
			toSell:function(){
				if(!this.wallet.id){
					mui.toast('请先注册数字钱包')
					return
				}
				openWin('sj-sell.html')
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
					_this.freezValue = res.data.freez
				}

			})
		},
		
	},
});
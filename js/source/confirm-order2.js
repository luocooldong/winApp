var confirmOrder = new Vue({
	el: '#confirmOrder',
	data: {
		count:localStorage.orderCount,
		good:Object,
		sys_userInfo:Object,
		address:[]
	},
	mounted: function() {
		
		this.sys_userInfo = JSON.parse(localStorage.getItem("sys_userInfo"))
	 	this.good = JSON.parse(localStorage.manorGood)
	 	this.getAddress()
	},
	methods: {
		getAddress:function(){
			var _this = this
				axios({
						url: base_url + '/property/getAddressByUser',
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
							_this.address = res.data.data
						}
						
							

					})
			
		},
		addAddress:function(){
			openWin('add-address.html')
		},
		submitOrder:function(){
			if(this.address.length<=0){
				mui.toast('请选择收货地址')
			}else{
				var _this = this
				axios({
						url: base_url + '/property/addOrderManor',
						method: 'POST',
						// 请求体重发送的数据
						params: {
							goodId:_this.good.id,
							status:0,
							count:_this.count,
							addId:_this.address[0].id,
							userId:_this.sys_userInfo.id
						},
						timeout: 50000,
						// 设置请求头
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
				}).then(function(res) {
						if(res.status=="200"){
							mui.toast(res.data.msg)
							openWin('manor.html')
						}else{
							mui.toast("下单失败")
						}
						
							

					})
			}
		}
	},
});
var ads = new Vue({
	el: '#ads',
	data: {
		id:'',
		sys_userInfo:Object,
		phone:'',
		name:'',
		address:'',
		area:'',
		stree:''
		
	},
	mounted: function() {
		this.sys_userInfo = JSON.parse(localStorage.getItem("sys_userInfo"))
		if(localStorage.address.length>0){
		 	console.log(localStorage.address)
		 	var json  = JSON.parse(localStorage.address);
		 	this.phone = json.phone
		 	this.name = json.name
		 	this.stree = json.stree
		 	this.id = json.id
		 	this.address = json.address
		 	$("#cityResult3").text(this.address)
		 	
		}
	},
	methods: {
		addAddress:function(){
			var _this = this
				axios({
						url: base_url + '/property/addAddress',
						method: 'POST',
						// 请求体重发送的数据
						params: {
							'id':_this.id,
							'user.id':_this.sys_userInfo.id,
							'phone':_this.phone,
							'name':_this.name,
							'address':_this.address,
							'area':_this.area,
							'stree':_this.stree
							
						},
						timeout: 50000,
						// 设置请求头
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
				}).then(function(res) {
						if(res.status=="200"){
							mui.toast("收货地址保存成功")
							 /*	var html = plus.webview.getWebviewById('cofirm-order.html');
							    if(html){
								 html.reload()
								}*/
							    /*var html2 = plus.webview.getWebviewById('cofirm-order2.html');
							    if(html2){
								 html2.reload()*/
							mui.back()
								
						}else{
							mui.toast("网络异常,请重试")
						}
						
							

					})
			
		},
		
		
	},
});
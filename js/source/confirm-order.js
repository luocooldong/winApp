var confirmOrder = new Vue({
	el: '#confirmOrder',
	data: {
		count:localStorage.orderCount,
		good:Object,
		sys_userInfo:Object,
		address:[],
		photo_src:''
	},
	mounted: function() {
		this.photo_src = photo_src
		this.sys_userInfo = JSON.parse(localStorage.getItem("sys_userInfo"))
	 	this.good = JSON.parse(localStorage.mallGood)
	 	console.log(JSON.stringify(this.sys_userInfo))
	 	this.getAddress()
	},
	methods: {
		editAdd:function(){
			localStorage.address = JSON.stringify(this.address[0])
			openWin('add-address.html')
		},
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
			localStorage.address = ''
			openWin('add-address.html')
		},
		submitOrder:function(){
			if(this.address.length<=0){
				mui.toast('请选择收货地址')
			}else{
				var _this = this
				axios({
						url: base_url + '/property/addOrderMall',
						method: 'POST',
						// 请求体重发送的数据
						params: {
							'goodId.id':_this.good.id,
							status:0,
							count:_this.count,
							'addId.id':_this.address[0].id,
							'userId.id':_this.sys_userInfo.id
						},
						timeout: 50000,
						// 设置请求头
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
				}).then(function(res) {
						if(res.data.success){
					
							var btnArray = ['否', '是'];
							mui.confirm('下单成功,是否立即支付？', '提示', btnArray, function(e) {
								if (e.index == 1) {
									_this.aliPayGet('alipay',res.data.order)
								} else {
									openWin('mall.html')
								}
							})

						}else{
							mui.toast(res.data.msg?res.data.msg:"下单失败")
						}
						
							

					})
			}
		},
			aliPayGet:function(id,i){

			 // 从服务器请求支付订单
				var PAYSERVER='';
				if(id=='alipay'){
					PAYSERVER=ALIPAYSERVER +"?id="+i.good_id+"&count="+i.count+"&orderId="+i.id;
					
				}else{
					plus.nativeUI.alert("不支持此支付通道！",null,"购买商品");
					return;
				}
			
				var xhr=new XMLHttpRequest();
				var _this = this
				xhr.onreadystatechange=function(){
					switch(xhr.readyState){
						case 4:
						if(xhr.status==200){
					/* 		$("#ttt").html(xhr.responseText)
							return */
							plus.payment.request(channel,xhr.responseText,function(result){
								
								plus.nativeUI.alert("支付成功！",function(){
									_this.switchOrderStatus(i.id,1)
									//back();
								});
							},function(error){
								plus.nativeUI.alert("支付失败：" + error.code);
							});
						}else{
							alert("获取订单信息失败！");
						}
						break;
						default:
						break;
					}
				}
				xhr.open('GET',PAYSERVER);
			
				xhr.send(); 
		},
			switchOrderStatus:function(id,status){
				var _this = this
				axios({
						url: base_url + '/property/switchOrderStatus',
						method: 'POST',
						// 请求体重发送的数据
						params: {
							'id':id,
							'status':status
						},
						timeout: 50000,
						// 设置请求头
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
				}).then(function(res) {
openWin('mall.html')
					})
		}
	},
});
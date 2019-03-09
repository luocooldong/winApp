var mallOrder = new Vue({
	el: '#mallOrder',
	data: {
		list:[],
		status:'',
		photo_src:'',
		aboutUs:Object
	},
	mounted: function() {
		this.photo_src = photo_src
	this.status = localStorage.mallStatus
	this.getList()
	this.getAountUs()

	},
	methods: {
		concatUs:function(){
				  mui.alert('客服QQ号:824508901', function() {
			     
			 });
		},
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
		},
		deleteOrderTrue:function(i){
			var _this = this
			axios({
					url: base_url + '/mall/deleteOrder',
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
				_this.getList()
			})
		},
		deleteOrder:function(i){
				
				var _this = this
				var btnArray = ['取消', '确定'];
				
				mui.confirm('是否确定取消该订单','确认操作', btnArray, function(e) {
					if(e.index == 1) {
						_this.deleteOrderTrue(i)
					} else {
						
					}
				})
				
			
		},
		switchStatus:function(n){
			localStorage.mallStatus = n
			this.status = n
			this.getList()
		},
		getList:function(){
			var _this = this
				axios({
						url: base_url + '/property/getMallOrders',
						method: 'POST',
						// 请求体重发送的数据
						params: {
							'userId':JSON.parse(localStorage.getItem("sys_userInfo")).id,
							'status':localStorage.mallStatus
						},
						timeout: 50000,
						// 设置请求头
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
				}).then(function(res) {
						if(res.status=="200"){
							_this.list = []
							_this.list = res.data.data
							console.log(JSON.stringify(res.data.data))
							
						}
						
							

					})
		},
		pay:function(i){
	/* 		console.log(JSON.stringify(i))
				var _this = this
			axios({
					url: base_url + '/ali/pay',
					method: 'POST',
					// 请求体重发送的数据
					params: {
						'id':i.good_id,
						'count':i.count
					},
					timeout: 50000,
					// 设置请求头
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
			}).then(function(res) {
				 */
					
						this.aliPayGet('alipay',i)
			
			/* 	}) */
			
			/* mui.toast('模拟付款成功')
			this.switchOrderStatus(i.id,1) */
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
		down:function(i){
			mui.toast('操作成功')
			this.switchOrderStatus(i.id,2)
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
						if(res.status=="200"){
						_this.getList()
						}
						
							

					})
		}
		
	},
});



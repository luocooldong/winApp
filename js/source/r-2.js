var r2 = new Vue({
	el: '#r2',
	data: {
		phone:'',
		invitedCode:'',
		name:'',
		idCard:'',
		password:'',
		msgCode:'',
		trueCode:'',
		wx_userInfo:Object
	},
	mounted: function() {
		this.phone = localStorage.phone
		//this.wx_userInfo = JSON.parse(localStorage.getItem("wx_userInfo"))
	},
	methods: {
		sendMsg:function(){
			var _this = this
					axios({
							url: base_url + '/user/sendMsg',
							method: 'POST',
							// 请求体重发送的数据
							params: {
								phone:_this.phone
							},
							timeout: 50000,
							// 设置请求头
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
					}).then(function(res) {
						
							_this.trueCode = res.data.data		
										
			
					})
		},
		regist:function(){
			if(this.msgCode.length<=0){
				
				mui.toast('请您填写验证码')
				return false;
			}
			if(this.trueCode.length<=0){
				
				mui.toast('验证码已失效')
				return false;
			}
			if(this.trueCode != this.msgCode){
				
				mui.toast('验证码错误')
				return false;
			}
				var _this = this
				plus.nativeUI.showWaiting()
				axios({
						url: base_url + '/user/registSysUserInfo',
						method: 'POST',
						// 请求体重发送的数据
						params: {
							phone:_this.phone,
							invitedCode:_this.invitedCode,
							name:_this.name,
							idCard:_this.idCard,
							password:_this.password,
							msgCode:_this.msgCode
							//wxOpenId:_this.wx_userInfo.openid,
							//wxUserInfo: _this.wx_userInfo.headimgurl
						},
						timeout: 50000,
						// 设置请求头
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
				}).then(function(res) {
						plus.nativeUI.closeWaiting()
					if(res.status=="200"){
						mui.toast(res.data.msg)
						if(res.data.success){
							_this.getSysUserInfo()
						}
					}
						
							

				})
		},getSysUserInfo:function(){
			plus.nativeUI.showWaiting();
			var _this = this
				axios({
						url: base_url + '/user/getSysUserInfo',
						method: 'POST',
						// 请求体重发送的数据
						params: {
							phone:_this.phone
						},
						timeout: 50000,
						// 设置请求头
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
				}).then(function(res) {
					plus.nativeUI.closeWaiting()
						mui.toast(res.data.msg);
						if(res.data.success){
							localStorage.setItem('sys_userInfo',JSON.stringify(res.data.data))
							if(localStorage.index=='true'){
								plus.webview.open(plus.webview.getLaunchWebview().getURL())
							}else{
								plus.webview.open('mine.html');
							}
						}
						
						
							

					})
		}
	
		
	},
});
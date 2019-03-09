var r4 = new Vue({
	el: '#r4',
	data: {
		sys_userInfo: Object,
		msgCode:'',
		imgCode:'',
		aliName:'',
		aliAccount:'',
		trueCode:'',
		img:[],
		
	},
	filters: {
		phoneFilter: function(value) {
			if(value) {
				var hide = value.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
				return hide;
			}
		},
		nameFilter: function(value) {
			if(value) {
				var str = value.length>3?'**'+(value.substr(2)):'*'+(value.substr(1))
				return str;
			}
		}
	},
	mounted: function() {
		this.getImgCode()
		this.sys_userInfo = JSON.parse(localStorage.sys_userInfo)
		var _this = this
		mui.plusReady(function(){
			document.getElementById("createId").addEventListener('tap',function(){
				var username = $("#pay-username").val(),			
			useraccount = $("#pay-account").val();
			//imgcode = $("#img-code").val(),
			//phonecode = $("#phone-code").val();
			
			
			//验证支付宝真实姓名
			if(username.length == 0) {  
				mui.toast('姓名不能为空');
				return false;
			}			
			var regname = /^[\u4e00-\u9fa5]{2,4}$/;
			if(!regname.test(username)) {
				mui.toast('请输入真实姓名！');
				return false;
			}
			
			//验证支付宝账号
			if(useraccount.length == 0) {
				mui.toast('支付宝账号不能为空');
				return false;
			}
			if(_this.trueCode.length<=0){
				mui.toast('短信验证码失效');
				return false;
			}
			if(_this.trueCode!=_this.msgCode){
				mui.toast('短信验证码错误');
				return false;
			}
			if(_this.img.length<=0){
					mui.toast('请您上传手持身份证照片,真实的照片能快速通过审核');
				return false;
			}


			_this.perfectWallet()
			})
		})
	},
	methods: {
		sendMsg:function(){
			var _this = this
					axios({
							url: base_url + '/user/sendMsg',
							method: 'POST',
							// 请求体重发送的数据
							params: {
								phone:_this.sys_userInfo.phone
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
		getImgCode: function() {
			var date  = new Date().getTime();
			$('#imgCodeController').attr('src', base_url + '/servlet/validateCodeServlet?date='+date);
		},
		perfectWallet:function(){
			plus.nativeUI.showWaiting()
			var _this = this
				axios({
						url: base_url + '/user/perfectWallet',
						method: 'POST',
						// 请求体重发送的数据
						params: {
							'user.id':_this.sys_userInfo.id,
							'aliName':_this.aliName,
							'aliAccount':_this.aliAccount,
							'imgCode':_this.imgCode,
							'img':_this.img[0].path 
						},
						timeout: 50000,
						// 设置请求头
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
				}).then(function(res) { 
					plus.nativeUI.closeWaiting()
					mui.toast(res.data.msg)
					openWin('mine.html')
					/* 	if(res.data.success){
							
								if(localStorage.index=='true'){
								plus.webview.open(plus.webview.getLaunchWebview().getURL())
							}else{
								plus.webview.open('mine.html');
							}
						} */
						
							

					})
		},	upload: function(file) {
							var _this = this

							var task = plus.uploader.createUpload(base_url + '/imgUpload/trail', {
									method: "POST",
									blocksize: 204800,
									priority: 100
								},
								function(t, status) {
									// 上传完成
									if (status == 200) {

										//mui.toast("头像上传成功")
									} else {
										plus.nativeUI.closeWaiting();
										mui.alert("上传图片出现异常");
									}
								}
							);
							task.addFile(file, {
								key: file
							});

							task.start()
						},
						chooseWay: function() {
							var bts = [{
								title: "拍照"
							}, {
								title: "从相册选择"
							}];
							var _this = this;
							plus.nativeUI.actionSheet({
									cancel: "取消",
									buttons: bts
								},
								function(e) {
									if (e.index == 1) {
										_this.getImage();
									} else if (e.index == 2) {
										_this.galleryImgs();
									}
								}
							);
						},
						getImage: function() {
							this.img = []
							var newUrlAfterCompress = '';
							var dstname = '';
							var cmr = plus.camera.getCamera();
							var _this = this;
							cmr.captureImage(function(p) {
								plus.io.resolveLocalFileSystemURL(p, function(entry) {
									var localurl = entry.toLocalURL(); //   
									dstname = "_downloads/" + _this.getUid() + ".jpg"; //设置压缩后图片的路径   
									newUrlAfterCompress = _this.compressImage(localurl, dstname);

									_this.img.push({
										"localurl": localurl,
										"path": dstname,
										"uploaded": false
									});
									setTimeout(function() {
										_this.upload(dstname);
									}, 1000)





								});
							});
						},
						galleryImgs: function() { // 从相册中选择图片   
						this.img = []
							var _this = this;
							plus.gallery.pick(function(e) {

								for (var i = 0; i < e.files.length; i++) {
									if (i < 1) {
										var dstname = "_downloads/" + _this.getUid() + ".jpg"; //设置压缩后图片的路径   
										_this.compressImage(e.files[i], dstname);


										_this.img.push({
											"localurl": e.files[i],
											"path": dstname,
											"uploaded": false
										});
										setTimeout(function() {
											_this.upload(dstname);
										}, 1000)
									}
								}

							}, function(e) {
								console.log("取消选择图片");
							}, {
								filter: "image",
								multiple: true
							});
						},
						getUid: function() {
							return Math.floor(Math.random() * 100000000 + 10000000).toString();
						},
						compressImage: function(src, dstname) {
							plus.zip.compressImage({
									src: src,
									dst: dstname,
									overwrite: true,
									quality: 20
								},
								function(event) {
									return event.target;
								},
								function(error) {
									console.log(error);
									return src;
								}

							);
						}

	},
});
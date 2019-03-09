var sjrz = new Vue({
	el: '#sjrz',
	data: {
		photo_type: 0,
		sys_userInfo: Object,
		sellerName: '膏药店',
		sellerBs: '',
		sellerAddress: '人民路',
		contactName: '刘医生',
		contactPhone: '18287125806',
		phone: '18287125806',
		msgCode: '',
		photo_user: [],
		photo_shop: [],
		photo_fm:[],
		uploadcount: 0,
		sendAuthCode:true,/*布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */
		auth_time: 0 /*倒计时 计数器*/

	},
	filters: {
		cashFilter: function(value) {
			return Math.round(value);
		}
	},
	watch: {
		uploadcount: function(curVal, oldVal) {
			console.log(curVal)
			var _this = this
			var l = _this.photo_user.length + _this.photo_shop.length +_this.photo_fm.length
			if (curVal != 0 && curVal == l) {
				plus.nativeUI.closeWaiting();
				mui.toast("申请成功，请耐心等待审核")
				mui.back()

			}
		}
	},
	mounted: function() {
		this.sys_userInfo = JSON.parse(localStorage.getItem('sys_userInfo'))
	},
	methods: {
		getAuthCode:function () {
			this.sendAuthCode = false;
			this.auth_time = 60;
			var auth_timetimer =  setInterval(()=>{
				this.auth_time--;
				if(this.auth_time<=0){
					this.sendAuthCode = true;
					clearInterval(auth_timetimer);
				}
			}, 1000);
		},
		sendMsg: function() {
			if (this.sellerName.length <= 0) {
				mui.toast('请输入商家名称');
				return false;
			}
			if (this.sellerBs.length <= 0) {
				mui.toast('请输入商家行业');
				return false;
			}
			if (this.sellerAddress.length <= 0) {
				mui.toast('请输入商家地址');
				return false;
			}
			if (this.contactName.length <= 0) {
				mui.toast('请输入联系人姓名');
				return false;
			}
			if (this.contactPhone.length <= 0) {
				mui.toast('请输入联系人电话');
				return false;
			}
			 			if(this.photo_user.length<3){mui.toast('请选择负责人图片');return false;}
						if(this.photo_shop.length<3){mui.toast('请选择店招图片');return false;} 
			if (this.phone.length <= 0) {
				mui.toast('请输入手机号码');
				return false;
			}
			if (!(this.phone == this.sys_userInfo.phone)) {
				mui.toast('手机号码与注册电话不一致');
				return false;
			}
			var params = {
				"phone": this.phone
			}
			sendPost('/sendMsgCode', params).then(function(res) {

			})
			return true;
		},
		submitShq: function() {
			if (this.sellerName.length <= 0) {
				mui.toast('请输入商家名称');
				return false;
			}
			if (this.sellerBs.length <= 0) {
				mui.toast('请输入商家行业');
				return false;
			}
			if (this.sellerAddress.length <= 0) {
				mui.toast('请输入商家地址');
				return false;
			}
			if (this.contactName.length <= 0) {
				mui.toast('请输入联系人姓名');
				return false;
			}
			if (this.contactPhone.length <= 0) {
				mui.toast('请输入联系人电话');
				return false;
			}
			 			if(this.photo_user.length<3){mui.toast('请选择负责人图片');return false;}
						if(this.photo_shop.length<3){mui.toast('请选择店招图片');return false;} 
		/* 	if (this.phone.length <= 0) {
				mui.toast('请输入手机号码');
				return false;
			}
			if (!(this.phone == this.sys_userInfo.phone)) {
				mui.toast('手机号码与注册电话不一致');
				return false;
			}
			if (this.msgCode.length <= 0) {
				mui.toast('请输入短信验证码');
				return false;
			} */
			plus.nativeUI.showWaiting()
			var user_route = ''
			for (var i = 0; i < this.photo_user.length; i++) {
				if (i == 0) {
					user_route = this.photo_user[i].path
				} else {

					user_route = user_route + "," + this.photo_user[i].path
				}

			}
			var shop_route = ''
			for (var i = 0; i < this.photo_shop.length; i++) {
				if (i == 0) {
					shop_route = this.photo_shop[i].path
				} else {

					shop_route = shop_route + "," + this.photo_shop[i].path
				}

			}
			
			var fm_route = ''
						for (var i = 0; i < this.photo_fm.length; i++) {
							if (i == 0) {
								fm_route = this.photo_fm[i].path
							} else {
			
								fm_route = fm_route + "," + this.photo_fm[i].path
							}
			
			}
			var params = {
				"user.id": this.sys_userInfo.id,
				"sellerName": this.sellerName,
				"sellerBs": this.sellerBs,
				"sellerAddress": this.sellerAddress,
				"contactName": this.contactName,
				"contactPhone": this.contactPhone,
				"msgCode": this.msgCode,
				"userPhotos": user_route,
				"dzPhotos": shop_route,
				"fmPhoto":fm_route
			}
			var _this = this
			sendPost('/trail/addSellerInfo', params).then(function(res) {
				//plus.nativeUI.closeWaiting()
				//openWin("../index/userCenter.html",true,"slide-in-left")
				if (res.data.success) {
					for (var i = 0; i < _this.photo_user.length; i++) {
						_this.upload(_this.photo_user[i].path);
					}

					for (var i = 0; i < _this.photo_shop.length; i++) {
						_this.upload(_this.photo_shop[i].path);
					}
					
					for (var i = 0; i < _this.photo_fm.length; i++) {
						_this.upload(_this.photo_fm[i].path);
					}

				}
			})


		},
		upload: function(file) {
			var _this = this
			
			var task = plus.uploader.createUpload(base_url + '/imgUpload/trail', {
					method: "POST",
					blocksize: 204800,
					priority: 100
				},
				function(t, status) {
					// 上传完成
					if (status == 200) {
						_this.uploadcount = _this.uploadcount + 1
					} else {
						plus.nativeUI.closeWaiting();
						mui.alert("上传文件出现问题");
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
			var newUrlAfterCompress = '';
			var dstname = '';
			var cmr = plus.camera.getCamera();
			var _this = this;
			cmr.captureImage(function(p) {
				plus.io.resolveLocalFileSystemURL(p, function(entry) {
					var localurl = entry.toLocalURL(); //   
					dstname = "_downloads/" + _this.getUid() + ".jpg"; //设置压缩后图片的路径   
					newUrlAfterCompress = _this.compressImage(localurl, dstname);
					if (_this.photo_type == 0) {
						_this.photo_user.push({
							"localurl": localurl,
							"path": dstname,
							"uploaded": false
						});
					}

					if (_this.photo_type == 1) {
						_this.photo_shop.push({
							"localurl": localurl,
							"path": dstname,
							"uploaded": false
						});
					}

					if (_this.photo_type == 2) {
						_this.photo_fm.push({
							"localurl": localurl,
							"path": dstname,
							"uploaded": false
						});
					}


				});
			});
		},
		galleryImgs: function() { // 从相册中选择图片   
			var _this = this;
			plus.gallery.pick(function(e) {
				var had = _this.photo_type == 0 ? _this.photo_user.length : _this.photo_shop.length
				had = _this.photo_type == 2? 2:had
				for (var i = 0; i < e.files.length; i++) {
					if (i + had < 3) {
						var dstname = "_downloads/" + _this.getUid() + ".jpg"; //设置压缩后图片的路径   
						_this.compressImage(e.files[i], dstname);


						if (_this.photo_type == 0) {
							_this.photo_user.push({
								"localurl": e.files[i],
								"path": dstname,
								"uploaded": false
							});
						}

						if (_this.photo_type == 1) {
							_this.photo_shop.push({
								"localurl": e.files[i],
								"path": dstname,
								"uploaded": false
							});
						}
						if (_this.photo_type == 2) {
							_this.photo_fm.push({
								"localurl": e.files[i],
								"path": dstname,
								"uploaded": false
							});
						}


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
		},


	},
});

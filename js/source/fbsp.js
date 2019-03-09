var fbsp = new Vue({
	el: '#fbsp',
	data: {
		photo_type: 0,
		sys_userInfo: Object,
		name: '狗皮膏药',
		category: '医疗',
		payType: '',
		price: '',
		kc: '',
		photo_shop: [],
		photo_fm:[],
		brief:'555',
		uploadcount: 0,

	},
	filters: {
		cashFilter: function(value) {
			return Math.round(value);
		}
	},
	watch: {
		uploadcount: function(curVal, oldVal) {
			var _this = this
			var l =  _this.photo_shop.length +_this.photo_fm.length
			if (curVal != 0 && curVal == l) {
				plus.nativeUI.closeWaiting();
				mui.toast("发布成功，请耐心等待审核")
				mui.back()

			}
		}
	},
	mounted: function() {
		this.sys_userInfo = JSON.parse(localStorage.getItem('sys_userInfo'))
	},
	methods: {
		submitShq: function() {
			if (this.name.length <= 0) {
				mui.toast('请输入商品名称');
				return false;
			}
			if (this.category.length <= 0) {
				mui.toast('请选择商品行业');
				return false;
			}
			if (this.payType.length <= 0) {
				mui.toast('请选择货币方式');
				return false;
			}
			if (this.price.length <= 0) {
				mui.toast('请输入价格');
				return false;
			}
			if (this.brief.length <= 0) {
				mui.toast('请输入商品简介');
				return false;
			}
			if (this.kc.length <= 0) {
				mui.toast('请输入商品库存');
				return false;
			}
			if(this.photo_shop.length<3){mui.toast('请上传商品轮播');return false;} 
			
			if(this.photo_fm.length<1){mui.toast('请上传商品封面');return false;} 
			plus.nativeUI.showWaiting()

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
				"createBy.id": this.sys_userInfo.id,
				"name": this.name,
				"category": this.category,
				"payType": this.payType,
				"price": this.price,
				"kc": this.kc,
				"msgCode": this.msgCode,
				"lb": shop_route,
				"img":fm_route,
				"brief":this.brief,
				"upShow":0,
				"isSys":0,
				"isShow":0
				
			}
			var _this = this
			sendPost('/trail/addMall', params).then(function(res) {
				if (res.data.success) {
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
			
			var task = plus.uploader.createUpload(base_url + '/imgUpload/mall', {
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

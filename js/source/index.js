var index = new Vue({
	el: '#index',
	data: {
		version:'',
		showShare: 0,
		i: Object,
		shares: null,
		market201: [],
		market20: [],
		todayprice: "",
		notice: [],
		names: [],
		datas: [],
		charts: [],
		drawList: [],
		chart: 0,
		mescroll: null,
		poolId: '',
		poolValue: '',
		pool: [],
		currentWord: [], 
		words: [],
		keyWord: [],
		wordcorrect: false,
		sys_userInfo: Object,
		made_power: '',
		alco_value: '',
		alco_red:'',
		login: false
	},
	filters: {
		phoneFilter: function(value) {
			if(value) {
				var hide = value.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
				return hide;
			}
		},
		dateTime: function(value) {
			return value ? value.substring(2, 10) : ''
		}
	},
	watch: {

		'chart': function(newValue, oldValue) {

			this.getChart()
		},
		'keyWord': {
			handler: function(newValue, oldValue) {
				if(newValue.length <= 0) {
					this.getValueAndPower()
					this.alcoVluePool()
					return
				}
				if(newValue.length == this.currentWord.length) {
					var temp = []
					for(var i = 0; i < this.keyWord.length; i++) {
						temp.push(this.words[this.keyWord[i].words_index])
					}
					if(this.currentWord.toString() == temp.toString()) {
						//输入正确隐藏键盘开始动画
						$(".mui-popup-backdrop").css("display", "block");
						$(".wine-word").css("display", "none");
						$(".bottle-box").css("display", "block");
						$(".bottle").addClass("my-animate")

						//pool删除水滴,圣酒账户增加，圣酒账户记录增加
						this.dealPool()
						setTimeout(function() {
							$(".mui-popup-backdrop").css("display", "none");
							$(".dialog-wrap ").css("display", "none");
							$(".bottle-box").css("display", "none");
							$(".bottle").removeClass("my-animate")
						}, 1000);
					} else {
						mui.toast("输入错误")
					}
				}

			},
			deep: true,
		}
	},
	mounted: function() {
		this.version = version
		this.getMarket20();
		this.gettodayprice()
		this.getNotice()
		this.getChart()
		if(!localStorage.getItem("sys_userInfo")) {
			return false
		} else {
			this.login = true
		}
		this.sys_userInfo = JSON.parse(localStorage.getItem("sys_userInfo"))

		this.getValueAndPower()

		this.alcoVluePool()
	},

	methods: {
		show:function(n){
			localStorage.setItem("notice",n.content)
			openWin("notice.html")
		},
		toSharei: function(i) {
			this.showShare = 0
			openWin('share-' + i + '.html')
		},
		openShare: function() {
			if(this.sys_userInfo && this.sys_userInfo.id) {
				this.showShare = 1
			} else {
				var btnArray = ['取消', '立即登录'];
				var tip = "当前账号未登录,请登录"
				//提示去登录
				mui.confirm(tip, '', btnArray, function(e) {
					if(e.index == 1) {
						localStorage.last = 0
						openWin('login.html')
					} else {

					}
				})
			}

		},
		closeShare: function() {
			this.showShare = 0
		},
		submitMarket: function() {
			$(".mui-popup-backdrop ").css("display", "none");
			$(".verify-dialog ").css("display", "none");
			var _this = this
			axios({
				url: base_url + '/alco/submitMarket',
				method: 'POST',
				// 请求体重发送的数据
				params: {
					"id": _this.i.id,
					"boughterId": _this.sys_userInfo.id,
				},
				timeout: 50000,
				// 设置请求头
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				if(res.status == "200") {
					_this.closeBuy()
					mui.toast(res.data.msg)
					_this.getMarket20()

				}
			})
		},
		closeBuy: function() {
			$(".mui-popup-backdrop ").css("display", "none");
			$(".dialog-wrap ").css("display", "none");
		},
		buyDialog: function(i) {
			$(".mui-popup-backdrop ").css("display", "block");
			$(".dialog-wrap ").css("display", "block");
			this.i = i
		},
		toShare: function() {

		},
		getMarket20: function() {
			var _this = this
			axios({
				url: base_url + '/alco/marketLast20',
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
					_this.market20 = res.data.data0
					_this.market201 = res.data.data1
				
				}
			})
		},
		getNotice: function() {
			var _this = this
			axios({
				url: base_url + '/alco/getNotice',
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
					_this.notice = res.data.data
				}
			})
		},

		gettodayprice: function() {
			var _this = this
			axios({
				url: base_url + '/alco/getPriceToday',
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
					_this.todayprice = res.data.priceToday
				}
			})
		},

		clearLocal: function() {
			//localStorage.clear()

		},
		getChart: function() {
			this.names = []
			this.datas = []
			var _this = this
			axios({
				url: base_url + '/property/charts',
				method: 'POST',
				timeout: 50000,
				// 设置请求头
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
			/* 	_this.charts = res.data.data
				if(_this.chart == 0) {
					_this.drawList = _this.charts.slice(0, 7)
				}
				if(_this.chart == 1) {
					_this.drawList = _this.charts.slice(0, 30)
				}
				if(_this.chart == 2) {
					_this.drawList = _this.charts.slice(0, 90)
				}

				_this.drawLine() */
			})
		},
		switchChart: function(i) {
			this.chart = i
		},
		toLogin: function() {
			localStorage.index = true
			var btnArray = ['取消', '立即登录'];
			var tip = "当前账号未登录,请登录"
			//提示去登录
			mui.confirm(tip, '', btnArray, function(e) {
				if(e.index == 1) {
					localStorage.last = 0
					openWin('login.html')
				} else {

				}
			})
		},
		down: function() {
			this.mescroll.endSuccess();
		},
		newMeScroll: function() {
			this.mescroll = new MeScroll("mall", {
				down: {
					callback: this.down
				}
			});
		},
		dealPoolAll:function(){
			
			var _this = this
			mui.plusReady(function(){  
					plus.nativeUI.showWaiting()
					axios({
					url: base_url + '/user/dealPoolAll',
					method: 'POST',
					// 请求体重发送的数据
					params: {
						userId: _this.sys_userInfo.id,
						version:_this.version
					},
					timeout: 50000,
					// 设置请求头
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res) {
					mui.toast(res.data.msg)
				
					plus.nativeUI.closeWaiting()
					if(!res.data.success||res.data.msg=="请更新至最新版本。"){
						   var btnArray = ['否', '是'];
							mui.confirm('您当前使用的不是最新版本,更新后可正常收取,立刻前往更新？', '系统提示', btnArray, function(e) {
								if (e.index == 1) {
									    axios({
									     url: base_url + '/property/shareInfo',
									     method: 'POST',
									     // 请求体重发送的数据
									     params: {},
									     timeout: 50000,
									     // 设置请求头
									     headers: {
									       'Content-Type': 'application/x-www-form-urlencoded'
									     }
									   }).then(function(res) { 
										  plus.runtime.openURL(res.data.hrefApk);	
									   }); 
								} else {
									
								}
							})
					}else{
							_this.getValueAndPower()
						_this.alcoVluePool()
					}
				})
			}); 
		},
		dealPool: function() {
			var _this = this
			axios({
				url: base_url + '/user/dealPool',
				method: 'POST',
				// 请求体重发送的数据
				params: {
					id: _this.poolId,
					version:_this.version
				},
				timeout: 50000,
				// 设置请求头
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
			  debugger
				if(!res.data.success||res.data.msg=="请更新至最新版本。"){
					   var btnArray = ['否', '是'];
												mui.confirm('您当前使用的不是最新版本,更新后可正常收取,立刻前往更新？', '系统提示', btnArray, function(e) {
													if (e.index == 1) {
														    axios({
														     url: base_url + '/property/shareInfo',
														     method: 'POST',
														     // 请求体重发送的数据
														     params: {},
														     timeout: 50000,
														     // 设置请求头
														     headers: {
														       'Content-Type': 'application/x-www-form-urlencoded'
														     }
														   }).then(function(res) { 
															  plus.runtime.openURL(res.data.hrefApk);	
														   }); 
													} else {
														
													}
												})
				}else{
					_this.getValueAndPower()
					_this.alcoVluePool()
				}
			
			})
		},
		getAlcoWord: function() {
			this.currentWord = []
			this.words = []
			this.keyWord = []
			$(".mui-popup-backdrop ").css("display", "block");
			$(".wine-word ").css("display", "block");
			var _this = this
			axios({
				url: base_url + '/user/getAlcoWord',
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
					_this.currentWord = res.data.current
					_this.words = res.data.word
				}
			})
		},
		addWater: function() {
			var flag = Math.random() > 0.5;
			var pullArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,15]
			
			$(".wine-water").remove()
			for(var i = 0; i < this.pool.length; i++) {
	
				
				var image = this.pool[i].type==0?"img/main_water.png":"img/yb.png"
				var animated = (i + 1) % 2 == 0 ? ' wine-animated-2' : ' wine-animated'
				var index = Math.floor((Math.random() * pullArr.length));
				var wineWater = flag ? (' wine-water' + pullArr[index]) : (' wine-water' + pullArr[index] + '-2')
				var water = '<div  class="wine-water' + animated + wineWater + '"><img  src="'+image+'"/><p>' +  this.pool[i].alco_value  + '</p><span hidden="true">' + this.pool[i].id + '</span></div>'
				$("#beforeWater").after(water)
				pullArr.splice(index, 1)
			}
			var _this = this;
			$(".wine-water").click(function() {
				_this.poolValue = $(this).find("p").html()
				_this.poolId = $(this).find("span").html()
				
				
				//输入正确隐藏键盘开始动画
				$(".mui-popup-backdrop").css("display", "block");
				$(".wine-word").css("display", "none");
				$(".bottle-box").css("display", "block");
				$(".bottle").addClass("my-animate")
				//pool删除水滴,圣酒账户增加，圣酒账户记录增加
				_this.dealPool()
				setTimeout(function() {
					$(".mui-popup-backdrop").css("display", "none");
					$(".dialog-wrap ").css("display", "none");
					$(".bottle-box").css("display", "none");
					$(".bottle").removeClass("my-animate")
				}, 1000);
				
				/* _this.getAlcoWord() */
			})
		},
		alcoVluePool: function() {
			if(this.sys_userInfo.id <= 0) {
				return false;
			}
			var _this = this
			axios({
				url: base_url + '/user/getAlcoValuePool',
				method: 'POST',
				// 请求体重发送的数据
				params: {
					'id': _this.sys_userInfo.id
				},
				timeout: 50000,
				// 设置请求头
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				if(res.status == "200") {
					_this.pool = res.data.data
					if(_this.pool.length <= 0) {
						//太阳动画
						$("#imgAnimate").css("display", "block");
						$(".wine-water").css("display", "none");
						_this.changeImg("imgAnimate");
					} else {
						$("#imgAnimate").css("display", "none");
						//添加水滴
						_this.addWater()
					}

				}

			})

		},
		alcoValueHistory: function() {
			openWin('wine-history.html')
		},
		madePowerHistory: function() {
			openWin('power-history.html')
		},
		getValueAndPower: function() {
			var _this = this
			axios({
				url: base_url + '/user/getValueAndPower',
				method: 'POST',
				// 请求体重发送的数据
				params: {
					'id': _this.sys_userInfo.id
				},
				timeout: 50000,
				// 设置请求头
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				if(res.status == "200") {
					console.log(JSON.stringify(res.data))
					_this.made_power = res.data.data.madePower
					_this.alco_value = res.data.data.alcoValue
					_this.alco_red = res.data.data.alcoRed
				}

			})
		},
		//图片播放
		changeImg: function(id) {
			var imgname = "img/sun_loading_", //假设图片都是以这个开头，后面对应数字。
				num = 1,
				type = ".png",
				speed = 200, //图片切换速度
				ele = document.getElementById(id); //假设这是需要改变的img的元素id
			function changeImgSrc() {
				var numstr = num > 9 ? num : ('0' + num)
				ele.src = imgname + numstr + type;
				num = num > 30 ? 1 : num + 1;
				setTimeout(changeImgSrc, speed);
			}
			setTimeout(changeImgSrc, speed);
		},
		//输入藏酒
		addKeyWord: function(event, index) {

			var dom = event.currentTarget;
			//键盘点击效果
			if($(dom).attr('class')) {
				$(dom).removeClass("on")

				for(var i = 0; i < this.keyWord.length; i++) {
					if(this.keyWord[i].words_index == index) {
						$($(".currentWord")[this.keyWord[i].currentWord_index]).removeClass("correct")
						$($(".currentWord")[this.keyWord[i].currentWord_index]).removeClass("error")
						$($(".currentWord")[this.keyWord[i].currentWord_index]).html(this.currentWord[this.keyWord[i].currentWord_index])
						this.keyWord.splice(i, 1)
					}
				}
			} else {
				if(this.keyWord.length == this.currentWord.length) {
					return
				}
				$(dom).addClass("on")
				var temp = {}
				temp.words_index = index
				$(".currentWord").each(function(i, e) {
					if($(e).hasClass("error") || $(e).hasClass("correct")) {

					} else {
						temp.currentWord_index = i
						return false
					}
				})

				if(this.words[temp.words_index] == this.currentWord[temp.currentWord_index]) {
					$($(".currentWord")[temp.currentWord_index]).addClass("correct")
					$($(".currentWord")[temp.currentWord_index]).html(this.words[temp.words_index]);
				} else {
					$($(".currentWord")[temp.currentWord_index]).addClass("error")
					$($(".currentWord")[temp.currentWord_index]).html(this.words[temp.words_index]);
				}
				this.keyWord.push(temp)

			}
		},
		drawLine: function() {
			var _this = this
			var arr = _this.drawList;
			for(var i = 0; i < arr.length; i++) {
				_this.names.push(_this.drawList[i].create_date)
				_this.datas.push(_this.drawList[i].price_today)

			}
			var myChart = echarts.init(document.getElementById('lineChart'));
			// 指定图表的配置项和数据
			var option = {
				color: "#ffa128",
				tooltip: {
					trigger: 'none',
					axisPointer: {
						type: 'cross'
					}
				},
				grid: {
					top: 10,
					bottom: 50
				},
				xAxis: [{
					type: 'category',
					axisTick: {
						alignWithLabel: true
					},
					axisLine: {
						onZero: false,

					},
					axisPointer: {
						label: {
							formatter: function(params) {
								return params.value +
									(params.seriesData.length ? ', ￥' + params.seriesData[0].data : '');
							}
						}
					},
					data: _this.names.reverse()
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: '价格',
					type: 'line',
					xAxisIndex: 0,
					smooth: true,
					data: _this.datas.reverse()
				}]
			};

			// 使用刚指定的配置项和数据显示图表。
			myChart.setOption(option);
		}

	},
});
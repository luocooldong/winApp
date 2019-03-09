var marketMore = new Vue({
	el: '#marketMore',
	data: {
		sys_userInfo:Object,
	  mescroll: null,
	 list0:[],
	 list1:[],
	 i: Object
	},
	filters:{
		dateTime:function(value){
			return value.substring(2,10)
		}
	},
	mounted: function() {
			this.sys_userInfo = JSON.parse(localStorage.getItem("sys_userInfo"))
	  //	this.newMeScroll()
	  	this.getMarket()
	},
	methods: {
			submitMarket: function() {

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
				
					_this.closeBuy()
					mui.toast(res.data.msg)
					_this.getMarket()
	
			})
		},
		closeBuy: function() {
					$(".mui-popup-backdrop ").css("display","none");
		$(".dialog-wrap ").css("display","none");
		},
			buyDialog: function(i) {
			$(".mui-popup-backdrop ").css("display", "block");
			$(".dialog-wrap ").css("display", "block");
			this.i = i
		},
		newMeScroll: function() {
			this.mescroll = new MeScroll("marketMore", {
				down: {
					callback: function(){
						this.mescroll.endSuccess();
					}
				},
				warpClass: null
			});
		},
			getMarket:function(){
			var _this = this
			axios({
				url: base_url + '/alco/marketList',
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
                 _this.list0 =res.data.data0
                  _this.list1 =res.data.data1
				}
			})
		}
		
	},
});
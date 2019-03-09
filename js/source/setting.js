var setting = new Vue({
	el: '#setting',
	data: {
		wx_userInfo: Object,
		sys_userInfo: Object,
		cache:0

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
				var str = value.length > 3 ? '**' + (value.substr(2)) : '*' + (value.substr(1))
				return str;
			}
		}
	},
	mounted: function() {
		if(!localStorage.getItem("sys_userInfo")) {
			return false
		}
		//this.wx_userInfo = JSON.parse(localStorage.getItem("wx_userInfo"))
		this.sys_userInfo = JSON.parse(localStorage.getItem("sys_userInfo"))
		var _this = this
		mui.plusReady(function() {
			_this.getCache()
		})


	},
	methods: {
		getCache: function() {
			var _this = this
			plus.cache.calculate(function(size) {
				console.log(size)
				sizeCache = size;
				var size_m = parseFloat(sizeCache / (1024 * 1024)).toFixed(2);
				_this.cache = size_m
			})
		},
		clearCache:function(){
				var _this = this
			plus.cache.calculate(function(size) {
				sizeCache = size;
				var size_m = parseFloat(sizeCache / (1024 * 1024)).toFixed(2);
				_this.cache = size_m
				
					mui.confirm("清除缓存" + size_m + "M",'',["取消", "确定"], function(e) {
						if(e.index == 1){
							plus.cache.clear(function() {
								_this.cache = 0
								localStorage.setItem("wx_userInfo",JSON.stringify(_this.wx_userInfo))
								localStorage.setItem("sys_userInfo",JSON.stringify(_this.sys_userInfo))
							});
						}
					});
				
			})
		}

	},
});
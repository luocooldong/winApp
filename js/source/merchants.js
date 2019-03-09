var merchants = new Vue({
	el: '#merchants',
	data: {
		pg: 1,
		ps: 10,
		photoSrc: '',
		sellerBs: '',
		categorys: [],
		list: [],
		mescroll: null,
		done: 0
	},
	filters: {

	},
	watch: {

	},
	mounted: function() {
		this.photoSrc = photo_src
		this.getCategorys()

	},
	methods: {
		down: function() {
			this.mescroll.endSuccess();
		},
		up: function(page) {
			var _this = this
			_this.pg = page.num
			_this.ps = page.size
			_this.getSellers(_this.sellerBs)
		},
		newMeScroll: function() {
			var _this = this
			this.mescroll = new MeScroll("merchants", {
				down: {
					callback: _this.down
				},
				up: {
					callback: _this.up,
					auto: true
				}
			});
		},
		switchBs: function(text) {
			this.list = []
			this.sellerBs = text
			this.mescroll.destroy();
			this.newMeScroll()
		},
		getCategorys: function() {
			var _this = this
			sendPost('/trail/getCategory', null).then(function(res) {
				console.log(res)
				_this.categorys = res.data.category
				_this.sellerBs = _this.categorys[0].text
				_this.newMeScroll()
			})
		},
		getSellers: function(sellerBs) {
			var params = {
				'sellerBs': sellerBs,
				'pg': this.pg,
				'ps': this.ps
			}
			var _this = this
			sendPost('/trail/getSellers', params).then(function(res) {
				if (res.data.sellers && res.data.sellers.length > 0) {
					for (var i = 0; i < res.data.sellers.length; i++) {
						_this.list.push(res.data.sellers[i])
					}
					_this.mescroll.endSuccess(res.data.sellers.length);
				} else {
					_this.mescroll.endErr();
				}


			})
		},
		toStore:function(userId){
			localStorage.sellerId = userId
			openWin("store.html")
		}
	},
});

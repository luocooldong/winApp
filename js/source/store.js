var store = new Vue({
	el: '#store',
	data: {
		seller:Object,
		pg: 1,
		ps: 10,
		photoSrc: '',
		sellerBs: '',
		categorys: [],
		list: [],
		mescroll: null,
		done: 0,
		lb:[]
	},
	filters: {

	},
	watch: {

	},
	mounted: function() {
		this.getSeller()
		this.photoSrc = photo_src
		this.getCategorys()

	},
	methods: {
		toMallDetail:function(i){
		  localStorage.setItem("good",JSON.stringify(i))
		  openWin('good/good.html');
		},
		down: function() {
			this.mescroll.endSuccess();
		},
		up: function(page) {
			var _this = this
			_this.pg = page.num
			_this.ps = page.size
			_this.getMalls(_this.sellerBs)
		},
		newMeScroll: function() {
			var _this = this
			this.mescroll = new MeScroll("store", {
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
				_this.categorys = res.data.category
				_this.sellerBs = _this.categorys[0].text
				_this.newMeScroll()
			})
		},
		getMalls:function(){
			var _this = this
			var params={"show":1,"isSys":0,"category":_this.sellerBs,"pg":_this.pg,"ps":_this.ps,'createBy.id':localStorage.sellerId}
			sendPost('/trail/getMalls', params).then(function(res) {
				if (res.data.malls && res.data.malls.length > 0) {
					for (var i = 0; i < res.data.malls.length; i++) {
						_this.list.push(res.data.malls[i])
					}
					_this.mescroll.endSuccess(res.data.malls.length);
				} else {
					_this.mescroll.endErr();
				}
			})
		},
		getSeller:function(){
			var params = {
				"id":localStorage.sellerId
			}
			var _this = this
			sendPost('/trail/getSellerInfo', params).then(function(res) {
				console.log(JSON.stringify(res))
				_this.seller = res.data.seller
				_this.lb = 	_this.seller.dzPhotos.split(",")
			})
		}
	},
});

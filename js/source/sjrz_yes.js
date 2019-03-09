var sjrzYes = new Vue({
	el: '#sjrzYes',
	data: {
		seller: Object,
		//money:Object

	},
	filters: {
		fixed:function(value){
			return Number(value).toFixed(2)
		}
	},
	watch: {

	},
	mounted: function() {
		this.getSeller()
	},
	methods: {
		getSeller: function() {
			
			var params = {
				"id": JSON.parse(localStorage.getItem('sys_userInfo')).id
			}
			var _this = this
			sendPost('/trail/getSellerInfo', params).then(function(res) {
				console.log(JSON.stringify(res))
				_this.seller = res.data.seller
				//_this.money = res.data.money
			})
		}

	},
});

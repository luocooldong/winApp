var pinfoManor = new Vue({
	el: '#pinfoManor',
	data: {
		good:Object
	
	},
	mounted: function() {
	 this.good = JSON.parse(localStorage.manor)
	},
	methods: {
		toConfirmOrder:function(){
			localStorage.orderCount =  $($(".mui-numbox-input")[0]).val()
			localStorage.setItem('manorGood',JSON.stringify(this.good)) 
			openWin('cofirm-order2.html')
		}
	},
});
var pinfoMall = new Vue({
	el: '#pinfoMall',
	data: {
		good:Object,
		lb:[],
		photo_src:''
	
	},
	mounted: function() {
		this.photo_src = photo_src
	 this.good = JSON.parse(localStorage.mall)
	var arr = this.good.lb.substr(1).split("|")
	this.lb=[]
	 for(var i=0;i<arr.length;i++){
	 	this.lb.push(photo_src+arr[i])
	 }
	
	},
	methods: {
		toConfirmOrder:function(){
			localStorage.orderCount =  $($(".mui-numbox-input")[0]).val()
			localStorage.setItem('mallGood',JSON.stringify(this.good)) 
			openWin('cofirm-order.html')
		}
	},
});
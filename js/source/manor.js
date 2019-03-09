var manor = new Vue({
	el: '#manor',
	data: {
		photo_src:"",
		list: [],
		
		
	},
	mounted: function() {
	   this.photo_src = photo_src
	},
	methods: {
		toManorDetail:function(i){
			localStorage.isManor = 1
			localStorage.isMall = 0
			localStorage.setItem("manor",JSON.stringify(i)) 
			openWin('pin-manor.html')
		}
		
	},
});
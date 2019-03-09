var jd = new Vue({
	el: '#jd',
	data: {
		showShare:0
		
	},
	mounted: function() {
	  
	},
	methods: {
			toShare:function(i){
			this.showShare = 0
			openWin('share-'+i+'.html')
	},
	openShare:function(){
		this.showShare = 1
	},
	closeShare:function(){
		this.showShare = 0
	}	
	},
});
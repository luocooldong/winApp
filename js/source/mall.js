var mall = new Vue({
	el: '#mall',
	data: {
		mescroll: null,
		category: [],
		list:[],
		categoryId:'',
		photo_src:"",
		searchKey:""
	},
	watch: {
	searchKey:function(curVal,oldVal){
			this.list = []
			this.mescroll.resetUpScroll(true)
	},
		categoryId:function(curVal,oldVal){
			console.log(curVal+","+oldVal)
			this.list = []
			this.mescroll.resetUpScroll(true)

			if(this.categoryId.length<=0){$(".mui-slider-item img").attr("src",'img/banner-3.png')}
			for(var i=0;i<this.category.length;i++){
				if(this.category[i].id == this.categoryId){
			

					$(".mui-slider-item img").attr("src",photo_src+this.category[i].img)
				}
			}
		}
	},
	mounted: function() {
		
	  this.photo_src = photo_src
	  console.log( this.photo_src )
	  this.getCategory() 
	  this.newMeScroll()
	},
	methods: {
		
		toMallDetail:function(i){
			localStorage.isManor = 0
			localStorage.isMall = 1
			localStorage.setItem("mall",JSON.stringify(i)) 
			openWin('pinfo-mall.html')
		},
		newMeScroll:function(){
			this.mescroll = new MeScroll("mall", {
					down: {
						callback: this.down
					},
					up: {
						callback: this.up,
						auto: true
					}
				});
		},
		down:function(){
			this.mescroll.endSuccess();
		},
		up:function(page){
			var _this = this
				axios({
						url: base_url + '/mall/mallList',
						method: 'POST',
						// 请求体重发送的数据
						params: {
							"spec":_this.searchKey,
							pg: page.num,
							ps: page.size,
							"category.id":_this.categoryId
						},
						timeout: 50000,
						// 设置请求头
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}).then(function(res) {
					
						setTimeout(function() {
							if(res.status=="200"){
								if(res.data.data&&res.data.data.length>0){
									for(var i=0;i<res.data.data.length;i++){
										console.log(res.data.data[i].img)
										_this.list.push(res.data.data[i])
									}
									_this.mescroll.endSuccess(res.data.data.length);
								}else{
									_this.mescroll.endErr();
								}
							}else{
								_this.mescroll.endErr();
							}
						}, 800);

					})
			
		}
		,getCategory:function(){
			var _this = this
				axios({
				url: base_url + '/mall/mallCategory',
				method: 'POST',
				params: {
				},
				timeout: 50000,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				if(res.status=="200"){
					_this.category = res.data.data
				}
			})	
		},
		changeCategory:function(categoryId,e){
		    $(".mall-link").find("li").removeClass("current")
		    $(e.srcElement).parent("li").addClass("current")	    
			this.categoryId = categoryId
		}
		
	},
});
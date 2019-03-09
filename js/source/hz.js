var hz = new Vue({
	el: '#hz',
	data: {
		type: 1,
		photoSrc:'',
		childIndex:0,
		showwin:0,
		areas:[],
		areaNameSelected:'',
		areaIdSelected:'',
		name:'',
		phone:'',
		tjphone:'',
		gh:'',
		msgcode:'11'
	},
	watch:{
		'childIndex':function(){
			//console.log(this.areas[this.childIndex])
		}
	},
	mounted: function() {
		this.photoSrc = photo_src
		this.getAreas()
	},
	methods: {
		resAgency:function(){
				var _this = this
			axios({
				url: base_url + '/agency/resAgency',
				method: 'POST',
				// 请求体重发送的数据
				params: {
					"areaCode":_this.areaIdSelected,
					"name":_this.name,
					"phone":_this.phone,
					"user.id":JSON.parse(localStorage.sys_userInfo).id,
					"tjPhone":_this.tjphone,
					"gh":_this.gh,
					"type.type":_this.type
					
				},
				timeout: 50000,
				// 设置请求头
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then(function(res) {
				if(res.status == "200") {
					mui.toast(res.data.msg)
					location.reload()
				}
			})
		},
		selectArea:function(i){
			if(i.count){
				return
			}else{
				this.closeWin()
				this.areaNameSelected = this.areas[this.childIndex].name+'>'+i.name
				this.areaIdSelected = i.id
				
			}
		},
		closeWin:function(){
			this.showwin = 0
		},
		openChildCity:function(index){
			this.childIndex = index
				this.showwin = 1
		},
		changeType: function(num) {
			this.type = num
		},
		getAreas:function(){
				var _this = this
			axios({
				url: base_url + '/agency/getAreas',
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
					console.log(JSON.stringify(res))
					_this.areas = res.data.data
				}
			})
		}

	},
});
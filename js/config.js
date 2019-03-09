/* const base_url = "http://106.12.215.93/alcochain2";
const photo_src = "http://106.12.215.93"; */
 
/* const base_url = "http://192.168.1.18:8080/alcochain";
const photo_src = "http://192.168.1.18:8080"; */
const version = "1q1q2w1q3";
const base_url = "http://47.107.254.247/alcochain2";
const photo_src = "http://47.107.254.247"; 
const page_size = 10;



function openWin(html) {
	mui.openWindow({
		url: html,
		id: html,
		createNew: true,
		styles: {
			cachemode:"noCache",
 
		}
	});
}
 var sendPost =  function(url,para){

		return axios({
		 	url: base_url + url,
		 	method: 'POST',
		 	params: para,
		 	timeout: 50000,
		 	headers: {
		 		'Content-Type': 'application/x-www-form-urlencoded'
		 	}
		 }) 

 }
 

window.onload=function(){
	var user =  JSON.parse(localStorage.getItem('sys_userInfo')) 
	if(user && user !=null){
		sendPost('/user/getSysUserInfoById',{'id':user.id}).then(function(res){
			user = res.data;
			
			if(user && user.isUse==0){
				alert('您已被封号，请联系管理员')
				localStorage.clear();
				window.location.reload()
			}
		})
	}
	
	
	
}

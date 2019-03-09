var login = new Vue({
  el: '#login',
  data: {
    wx_userInfo: Object,
    loginType: 0,
    phone: '',
    password: '',
    msgCode: '',
    trueCode: ''
  },
  mounted: function() {
    var _this = this;
    mui.plusReady(function() {
    });
  },
  methods: {
    sendMsg: function() {
      console.log(base_url + '/user/sendMsg');
      var _this = this;
      axios({
        url: base_url + '/user/sendMsg',
        method: 'POST',
        params: {
          phone: _this.phone
        },
        timeout: 50000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function(res) {
        _this.trueCode = res.data.data;
      });
    },
    switchLoginType: function(i) {
      this.loginType = i;
      this.password = '';
      this.msgCode = '';
    },
    back: function() {
      plus.webview.open('mine.html');
    },
    login: function() {
      if (this.phone.length <= 0) {
        mui.toast('请输入手机号');
        return false;
      }
      if (this.password.length <= 0 && this.loginType == 0) {
        mui.toast('请输入登录密码');
        return false;
      }
      if (this.msgCode.length <= 0 && this.loginType == 1) {
        if (this.msgCode.length <= 0) {
          mui.toast('请您填写验证码');
          return false;
        }
        if (this.trueCode.length <= 0) {
          mui.toast('验证码已失效');
          return false;
        }
        if (this.trueCode != this.msgCode) {
          mui.toast('验证码错误');
          return false;
        }
      }
      // plus.nativeUI.showWaiting();
      var _this = this;
      axios({
        url: base_url + '/user/login',
        method: 'POST',
        // 请求体重发送的数据
        params: {
          phone: _this.phone,
          password: _this.password,
          msgCode: _this.msgCode,
          loginType: _this.loginType
        },
        timeout: 50000,
        // 设置请求头
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function(res) {
        // 隐藏
        // plus.nativeUI.closeWaiting()
        mui.toast(res.data.msg);
        if (res.data.success) {
          localStorage.setItem('sys_userInfo', JSON.stringify(res.data.data));
          openWin('mine.html');
        }
      });
    },
    wxLogin: function() {
      var auths = null;
      var _this = this;
      document.getElementById('loginByWX').addEventListener('tap', function() {
        if (!$('#checkbox').get(0).checked) {
          mui.toast('请阅读并同意用户协议');
          return false;
        }
        // plus.nativeUI.showWaiting();
        plus.oauth.getServices(
          function(services) {
            auths = services;
            for (var k in auths) {
              console.log(auths[k].id);
            }
            var s;
            for (var i = 0; i < auths.length; i++) {
              if (auths[i].id == 'weixin') {
                s = auths[i];
                break;
              }
            }
            if (!s.authResult) {
              s.login(
                function(e) {
                  s.getUserInfo(
                    function(e) {
                      console.log(
                        '获取用户信息成功：' + JSON.stringify(s.userInfo)
                      );
                      localStorage.setItem(
                        'wx_userInfo',
                        JSON.stringify(s.userInfo)
                      );
                      _this.wx_userInfo = s.userInfo;
                      _this.getSysUserInfo();
                    },
                    function(e) {
                      plus.nativeUI.closeWaiting();
                      console.log(
                        '获取用户信息失败：' + e.message + ' - ' + e.code
                      );
                      mui.toast('获取用户信息失败');
                    }
                  );
                },
                function(e) {
                  plus.nativeUI.closeWaiting();
                  mui.toast('登录认证失败');
                }
              );
            } else {
              plus.nativeUI.closeWaiting();
              //已经登录认证
              mui.toast('登录成功11');
            }
          },
          function(e) {
            plus.nativeUI.closeWaiting();
            console.log('获取登录失败：' + e.message + ' - ' + e.code);
            mui.toast('登录认证失败');
          }
        );
      });
    },

    getSysUserInfo: function() {
      var _this = this;
      debugger;
      axios({
        url: base_url + '/user/getSysUserInfo',
        method: 'POST',
        // 请求体重发送的数据
        params: {
          phone: _this.phone,
          password: _this.password
        },
        timeout: 50000,
        // 设置请求头
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function(res) {
        plus.nativeUI.closeWaiting();
        mui.toast('登陆成功');
        if (
          res.status == '200' &&
          res.data.data.id != null &&
          res.data.data.id.length > 0
        ) {
          localStorage.setItem('sys_userInfo', JSON.stringify(res.data.data));
          //刷新个人信息页面
          /*var index = plus.webview.getWebviewById('index.html');
							var mine = plus.webview.getWebviewById('mine.html');
							if(index){
								 index.reload()
							}else{
								if(mine){
								 mine.reload()
								}
							}*/
          if (localStorage.index == 'true') {
            plus.webview.open(plus.webview.getLaunchWebview().getURL());
          } else {
            plus.webview.open('mine.html');
          }
        } else {
          //openWin('r-1.html')
        }
      });
    }
  }
});

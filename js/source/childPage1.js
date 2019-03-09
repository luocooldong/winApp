var c1 = new Vue({
  el: '#c1',
  data: {
    sys_userInfo: Object,
    address: [],
  },
  mounted: function() {
    this.sys_userInfo = JSON.parse(localStorage.getItem('sys_userInfo'))
    this.getAddress()
  },
  methods: {
    getAddress: function() {
      var _this = this
      axios({
        url: base_url + '/property/getAddressByUser',
        method: 'POST',
        params: {
          id: _this.sys_userInfo.id,
        },
        timeout: 50000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then(function(res) {
        if (res.status == '200') {
          _this.address = res.data.data
        }
      })
    },
  },
})

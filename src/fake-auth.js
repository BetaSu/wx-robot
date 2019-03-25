// mock的登录系统，如果需要将服务提供给其他人使用，请覆写该模块
module.exports = {
  getUserInfo() {
    console.log('登录管理员账户');
    return {
      userMail: 'admin@test.com',
      userName: 'admin',
      displayName: '管理员'
    }
  },
  logout() {
    console.log('退出登录');
  }
}

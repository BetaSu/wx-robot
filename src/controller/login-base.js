const Base = require('./base');
const auth = require('../fake-auth');

module.exports = class extends Base {
  async __before() {
    let userData = await this.session('userData');
    if (think.isEmpty(userData)) {
      const {req, res} = this.ctx;
      const userInfo = await auth.getUserInfo(req, res, false);
      // 需要前端跳转 未登录状态
      if (think.isEmpty(userInfo)) return false;

      const userModel = this.mongo('user');
      userData = await userModel.findUser({userMail: userInfo.userMail});
      if (think.isEmpty(userData)) {
        userData = await userModel.addUser(userInfo);
      }
      await this.session('userData', userData);
    }
    this.ctx.userData = userData;
  }
};

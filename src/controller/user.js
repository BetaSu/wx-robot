const LoginBase = require('./login-base.js');
const codeMap = require('../codeMap');
const auth = require('../fake-auth');

module.exports = class extends LoginBase {
  async __before() {
    const {login} = await LoginBase.prototype.__before.call(this);
    if (!login) {
      const errCode = 901;
      return this.fail(errCode, codeMap[errCode]);
    }
    this.userModel = this.mongo('user');
  }
  indexAction() {
    const {isGet} = this.ctx;
    if (!isGet) return this.fail('只支持get');
    const extraData = {};
    const {task} = this.ctx.authData;
    extraData.task = task;
    return this.success(Object.assign(this.ctx.userData, extraData));
  }
  async setWxAccountAction() {
    const {isPost} = this.ctx;
    if (!isPost) return this.fail('只支持post');
    const wxAccount = this.post('wxAccount');
    if (!wxAccount) {
      const code = 1001;
      return this.fail(code, codeMap[code]);
    }
    const {userData} = this.ctx;
    const status = userData.status > 1 ? userData.status : 1;
    await this.userModel.updateUser(userData, {wxAccount, status});
    this.session('userData', {...userData, wxAccount, status});
    return this.success('设置成功');
  }
  async logoutAction() {
    const {isGet, req, res} = this.ctx;
    if (!isGet) return this.fail('只支持get');
    await this.session(null);
    await auth.logout(req, res);
    this.success('注销成功');
  }

  async searchAction() {
    const {isGet} = this.ctx;
    if (!isGet) return this.fail('只支持get');

    const {analyse} = this.ctx.authData;
    if (!analyse) {
      const errCode = 901;
      return this.fail(errCode, codeMap[errCode]);
    }
    const page = this.get('page') || 1;
    const pageSize = this.get('pageSize') || 10;
    const pageData = await this.userModel
      .field('displayName,userMail,token')
      .order('_id DESC')
      .page(page, pageSize)
      .countSelect({});
    const msgModel = this.model('message');
    for (let i = 0; i < pageData.data.length; i++) {
      const {userMail} = pageData.data[i];
      const count = await msgModel.where({userMail}).count();
      pageData.data[i].messageCount = count;
    }
    this.success(pageData);
  }
}

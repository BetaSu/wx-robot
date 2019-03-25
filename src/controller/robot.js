const fs = require('fs');

const LoginBase = require('./login-base');
const codeMap = require('../codeMap');
const botDefer = require('../bootstrap/worker');
const { sendMsgTo, parseMsg } = require('../robot-utils');

module.exports = class extends LoginBase {
  async __before() {
    const bot = await botDefer;
    this.ctx.bot = bot;
    // 发送消息接口不验证登录
    if (this.ctx.request.url === '/robot/say') return;
    const isLogin = await LoginBase.prototype.__before.call(this);
    // robot相关接口需要登录且是管理员
    const ADMIN = think.config('ADMIN');
    if (isLogin === false || !ADMIN || ADMIN.indexOf(this.ctx.userData.userMail) === -1) {
      const errCode = 901;
      return this.fail(errCode, codeMap[errCode]);
    }
  }
  async indexAction() {
    if (!this.ctx.isGet) return;
    const robotInfo = await this.mongo('robot')
      .where({ profile: think.config('DEFAULT_PROFILE') })
      .find();
    this.ctx.success(robotInfo, '更新状态成功');
  }

  async restartAction() {
    if (!this.ctx.isGet) return;
    await this.ctx.bot.stop();
    await this.ctx.bot.start();
    this.ctx.success(true, '重新登录');
  }

  async detailAction() {
    if (!this.ctx.isGet) return;
    this.success(this.ctx.bot.user, '获取机器人详情数据成功');
  }
  async sayAction() {
    const token = this.post('token');
    const {displayName, userMail, userName} = await this.mongo('user').findUser({token});
    const {to, msg} = parseMsg(this.ctx.bot, {
      msg: this.post('msg'),
      to: this.post('to'),
      displayName,
      userMail,
      userName,
      token
    });
    try {
      await sendMsgTo(this.ctx.bot, to, msg);
      await this.model('message').addMsg({
        displayName,
        userMail,
        userName,
        token,
        to,
        content: msg
      });
      return this.success(`发送消息成功,来自${displayName}`);
    } catch (errCode) {
      return this.fail(errCode, codeMap[errCode]);
    }
  }

  // 注销机器人 post
  async logoutAction() {
    const RobotModel = think.mongo('robot');
    await RobotModel.update(
      {
        status: 'notLogin'
      },
      { profile: this.ctx.bot.extraData.profile }
    );
    await this.ctx.bot.stop();
    try {
      // 清除数据
      fs.unlinkSync(this.ctx.bot.extraData.profileFile)
    } catch (e) {} finally {
      this.success('注销成功')
    }
  }
};

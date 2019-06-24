const LoginBase = require('./login-base');
const codeMap = require('../codeMap');

module.exports = class extends LoginBase {
  async __before() {
    const {login} = await LoginBase.prototype.__before.call(this);
    if (!login) {
      const errCode = 901;
      return this.fail(errCode, codeMap[errCode]);
    }
    this.ctx.state.model = this.mongo('message');
  }
  async indexAction() {
    if (!this.ctx.isGet) return;
    let fromStamp = Date.parse(this.get('from'));
    const toStamp = Date.parse(this.get('to'));
    if (isNaN(fromStamp) || isNaN(toStamp)) {
      return this.fail('时间格式出错');
    }
    if (fromStamp > toStamp || Date.now() < toStamp) {
      return this.fail('时间段有误');
    }
    const model = this.ctx.state.model;
    const data = [];
    while (fromStamp < toStamp) {
      const nextDayStamp = fromStamp + 1000 * 60 * 60 * 24;
      const count = await model.where({date: {$gt: new Date(fromStamp), $lt: new Date(nextDayStamp)}}).count();
      data.push({
        date: new Date(fromStamp).toLocaleDateString(),
        count
      });
      fromStamp = nextDayStamp;
    }
    this.ctx.success(data, '获取概览成功');
  }
  async searchAction() {
    if (!this.ctx.isGet) return;
    const model = this.ctx.state.model;
    const from = this.get('from') || new Date('1960/01/01');
    const to = this.get('to') || new Date();
    const token = this.get('token');
    const userMail = this.get('userMail');
    const displayName = this.get('displayName');

    const page = this.get('page') || 1;
    const pageSize = this.get('pageSize') || 10;

    const sql = {date: {$gt: new Date(from), $lt: new Date(to)}};
    token && (sql.token = token);
    userMail && (sql.userMail = userMail);
    displayName && (sql.displayName = displayName);

    const data = await model
      .field('content,date,displayName,token,userMail,to')
      .where(sql)
      .order('date DESC')
      .page(page, pageSize)
      .countSelect();
    this.success(data);
  }
};

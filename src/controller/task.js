const LoginBase = require('./base.js');
const codeMap = require('../codeMap');

module.exports = class extends LoginBase {
  async __before() {
    const isLogin = await LoginBase.prototype.__before.call(this);
    if (isLogin === false) {
      const errCode = 901;
      return this.fail(errCode, codeMap[errCode]);
    }
    this.ctx.state.model = this.mongo('task');
  }

  async indexAction() {
    // 获取任务列表
    if (this.ctx.isGet) {
      const taskList = await this.ctx.state.model.select();
      return this.success(taskList);
    }
    // 删除任务列表
    if (this.isMethod('DELETE')) {
      const id = this.get('id');
      const result = await this.ctx.state.model.delTask(id)
      return this.success(result);
    }
    // 新建任务
    if (this.ctx.isPost) {
      const data = this.ctx.post();
      const _id = await this.ctx.state.model.saveTask(data);
      this.success({_id});
    }
    // 修改任务
    if (this.isMethod('PUT')) {
      const data = this.ctx.post();
      const result = await this.ctx.state.model.setTask(data);
      if (result) {
        return this.success('修改任务成功');
      }
      this.fail('修改任务失败')
    }
  }
};

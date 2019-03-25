const codeMap = require('../codeMap');

module.exports = class extends think.Logic {
  async sayAction() {
    this.allowMethods = 'post';
    const rules = {
      to: {
        required: true,
        string: true
      },
      msg: {
        required: true,
        string: true
      },
      token: {
        required: true,
        string: true
      }
    }
    if (!this.validate(rules)) {
      return this.fail(1001, 'to,msg,token字段必填');
    }
    const userModel = this.mongo('user');
    const token = this.post('token');
    const {userMail} = await userModel.findUser({token});
    if (!userMail) {
      return this.fail(1002, codeMap[1002]);
    }
  }
};

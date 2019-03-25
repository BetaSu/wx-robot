const defaultConfig = {
  userMail: '',
  userName: '',
  displayName: '',
  content: '',
  to: '',
  token: ''
}

module.exports = class extends think.Mongo {
  async addMsg(data) {
    const curMsg = {...defaultConfig, ...data, date: new Date()};
    await this.add(curMsg)
    return curMsg;
  }
  async findMsg(options) {
    return await this.where(options).find();
  }
};

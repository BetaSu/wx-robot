const {createHash} = require('crypto');

const defaultConfig = {
  userMail: '',
  userName: '',
  displayName: '',
  wxAccount: '',
  status: 0,
  token: null
}

module.exports = class extends think.Mongo {
  async addUser(config = {}) {
    const curDate = Date.now().toString();
    var random = Math.random();
    const token = createHash('sha1').update(curDate + random).digest('hex').slice(0, 15);
    const _config = {...defaultConfig, ...config, token};
    if (!_config.displayName) {
      _config.displayName = _config.userMail.split('@')[0];
    };
    await this.add(_config)
    return _config;
  }
  async updateUser(options, data) {
    return await this.where(options).update(data);
  }
  async findUser(options) {
    return await this.where(options).find();
  }
  async delUser(id) {
    return await this.where({id}).delete();
  }
};


const createProfileName = () => {
  return `rotprofile-${Date.now()}`;
};

const defaultConfig = {
  name: '未初始化的机器人',
  status: 'notLogin',
  profile: createProfileName(),
  config: {},
  owner: '',
  qrcode: ''
}

module.exports = class extends think.Mongo {
  // 主键
  get pk() {
    return 'profile'
  }
  async createRobot(config = {}) {
    const _config = Object.assign({}, defaultConfig, config)
    await this.add(_config)
    return _config
  }
  async getRobotListByProfileList(list = []) {
    const profileList = list.map(profile => this.find({profile}))
    const result = await Promise.all(profileList)
    return result
  }
  async updateByProfile(newData, profile) {
    const id = await this.update(newData, {profile})
    return id
  }
  async getInfoByProfile(profile) {
    const info = await this.where({profile}).find()
    return info
  }
  async setLogoutParamAllRobot() {
    const all = await this.update({status: 'notLogin'}, {status: 'login'})
    return all
  }
};

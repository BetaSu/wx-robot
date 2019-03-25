// 返回对应api调用的配置
module.exports = {
  // 发送消息
  get say() {
    return {
      name: '发送消息 API',
      value: 'say',
      type: 'post',
      url: `${global.location.protocol}//${global.location.host}/robot/say`,
      params: {
        to: {
          name: '目标名称（用户昵称／群名）',
          value: null,
          required: true
        },
        msg: {
          name: '消息内容',
          value: null,
          required: true
        },
        token: {
          name: '你的专属校验码',
          value: null,
          required: true
        }
      }
    }
  }
}

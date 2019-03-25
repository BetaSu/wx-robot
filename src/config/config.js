// default config
module.exports = {
  workers: 1,
  port: 8366,
  // 缓存微信登录信息
  DEFAULT_PROFILE: 'wxrobot-ppp',
  // 报警邮件列表
  WARNING_MAIL_LIST: 'admin@test.com',
  // 管理员权限
  ADMIN: 'admin@test.com',
  // 心跳打点的目标昵称
  HEART_BEAT_TARGET: '文件传输助手',
  // 心跳打点间隔
  HEART_BEAT_INTERVAL: 1000 * 60 * 3
};

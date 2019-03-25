const host = global.location.host
const protocol = global.location.protocol
const domain = `${protocol}//${host}`

export default {
  domain,
  user: `${domain}/user`,
  serchUser: `${domain}/user/search`,
  logout: `${domain}/user/logout`,
  setWxAccount: `${domain}/user/setWxAccount`,
  robotLogin: `${domain}/robot/login`,
  robotLogout: `${domain}/robot/logout`,
  inspect: `${domain}/robot/inspect`,
  robotSay: `${domain}/robot/say`,
  robot: `${domain}/robot`,
  detail: `${domain}/robot/detail`,
  restart: `${domain}/robot/restart`,
  // 定时任务
  task: `${domain}/task`,
  message: `${domain}/message`,
  messageSearch: `${domain}/message/search`
}

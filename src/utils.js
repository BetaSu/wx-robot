const exec = require('child_process').exec;

const execEpr = async expr => {
  try {
    return await exec(expr);
  } catch (e) {
    return e;
  }
}

const restartServer = () => execEpr('npm run start-server');

const mail = async(addr, tle, msg) => {
  const expr = `echo -e "${msg}" | mail -s "${tle}" ${addr}`;
  await execEpr(expr);
}

const warning = async() => {
  let WARNING_MAIL_LIST = think.config('WARNING_MAIL_LIST');
  WARNING_MAIL_LIST && (WARNING_MAIL_LIST = WARNING_MAIL_LIST.split(','));
  WARNING_MAIL_LIST && WARNING_MAIL_LIST.forEach(async addr => {
    const curDate = new Date();
    const msg = `检测时间：${curDate.getFullYear()}-${curDate.getMonth() + 1}-${curDate.getDate()} ${curDate.getHours()}:${curDate.getMinutes()}:${curDate.getSeconds()}`;
    await mail(addr, '微信机器人掉线通知', msg);
  })
}

// 从微信消息中获取微信账号
const getWxAccountFromContent = content => {
  const match = content.match(/alias="([^"]+)"/) || ['', ''];
  return match[1];
}

// 鉴权
const getAuth = (userInfo) => {
  const defaultAuth = {
    login: false,
    sendMsg: false,
    task: false,
    analyse: false,
    handleRobot: false
  }
  if (!userInfo) return defaultAuth;

  // 普通用户可以 登录、发送消息
  defaultAuth.login = true;
  defaultAuth.sendMsg = true;

  const {userMail} = userInfo;
  const AUTH_ADMIN = (think.config('AUTH_ADMIN') || '').split(',');
  const AUTH_TASK = (think.config('AUTH_TASK') || '').split(',');

  // 管理员完全权限
  if (userMail && AUTH_ADMIN.includes(userMail)) {
    Object.assign(defaultAuth).forEach(key => { defaultAuth[key] = true });
  }
  if (userMail && AUTH_TASK.includes(userMail)) {
    defaultAuth.task = true;
  }
  return defaultAuth;
}

module.exports = {
  restartServer,
  mail,
  warning,
  getWxAccountFromContent,
  getAuth
}

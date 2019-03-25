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

module.exports = {
  restartServer,
  mail,
  warning,
  getWxAccountFromContent
}

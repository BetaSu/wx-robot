const RobotModel = think.mongo('robot');
const UserModel = think.mongo('user');
const taskModel = think.mongo('task');
const Wechat = require('wechat4u');
const path = require('path');
const fs = require('fs');
const {heartBeat, initContacts} = require('../robot-utils')
const Task = require('../task');
const {restartServer, warning, getWxAccountFromContent} = require('../utils')

async function startRobot(profile = think.config('DEFAULT_PROFILE')) {
  const task = new Task({
    model: taskModel,
    profile
  });
  // 启动定时任务
  task.run();

  await RobotModel.thenAdd({ profile }, { profile });
  const profileFile = path.join(__dirname, '../../cache', profile + '.json');
  let bot;
  try {
    bot = new Wechat(require(profileFile));
  } catch (e) {
    bot = new Wechat();
  }
  bot.extraData = {
    profileFile,
    profile,
    task
  };

  // 不使用内置的心跳检测,因为没有错误检测机制
  bot.setPollingIntervalGetter(() => 999999999);
  /**
   * 启动机器人
   */

  // 存在登录数据时，可以随时调用restart进行重启
  bot[bot.PROP.uin ? `restart` : 'start']();

  bot.on('uuid', async function(uuid) {
    let qrcode = 'https://login.weixin.qq.com/qrcode/' + uuid;
    qrcode = qrcode.replace('qrcode', 'l');
    await RobotModel.update(
      {
        qrcode,
        status: 'showQrcode'
      },
      { profile }
    );
  });
  bot.on('user-avatar', async function(avatar) {
    await RobotModel.update(
      {
        status: 'showAvatar',
        avatar
      },
      { profile }
    );
  });
  bot.on('login', async function() {
    console.log('登录成功');
    // 保存数据，将数据序列化之后保存到任意位置
    try {
      fs.writeFileSync(bot.extraData.profileFile, JSON.stringify(bot.botData));
    } catch (e) {
      console.warn('写缓存文件出错', e);
    }
    await RobotModel.update(
      {
        status: 'login',
        qrcode: null
      },
      { profile }
    );

    // 心跳检测
    let retryTime = 2;
    setInterval(async() => {
      const sometingWrong = !await heartBeat(bot);
      if (sometingWrong && !retryTime--) {
        warning();
        restartServer();
      }
    }, think.config('HEART_BEAT_INTERVAL') || 1000 * 60 * 3);
    await initContacts(bot);
  });
  bot.on('message', async({MsgType, RecommendInfo: {Content}}) => {
    // 自动通过好友验证 好像请求频繁了 不返还数据了
    if (MsgType === 37) {
      const userData = await UserModel.findUser({wxAccount: getWxAccountFromContent(Content)});
      if (userData && userData.status === 1) {
        // await bot.verifyUser(UserName, Ticket);
      }
    }
  });
  bot.on('logout', async() => {
    await RobotModel.update(
      {
        status: 'notLogin'
      },
      { profile }
    );
    try {
      // 清除数据
      fs.unlinkSync(bot.extraData.profileFile)
    } catch (e) {}
    // await bot.stop();
    console.log('注销成功');
  })
  bot.on('error', async({tips} = {tips: ''}) => {
    console.log('机器人报错: ', tips);
    // const logoutTips = [
    //   '同步失败',
    //   '微信初始化失败'
    // ];
    // logoutTips.includes(tips) && bot.stop();
  })
  return bot;
}

module.exports = startRobot();

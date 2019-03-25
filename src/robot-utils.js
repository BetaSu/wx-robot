let contactsSeq;
let contactsList;
let heatBeatStartDate;

const defer = (exports.defer = () => {
  const data = {};
  const p = new Promise((resolve, reject) => {
    data.resolve = resolve;
    data.reject = reject;
  });
  data.promise = p;
  return data;
});

// 通过昵称发送消息
const sendMsgTo = async(bot, nickName, msg) => {
  const d = defer();
  const contact = getContactByNickName(bot, nickName);
  if (!contact) {
    d.reject(2001);
    return d.promise;
  }
  return bot.sendMsg(msg, contact.UserName);
};

const getContactByNickName = (bot, nickName) => {
  const contacts = bot.contacts;
  if (!contacts) {
    console.warn('请勿同步联系人列表完成前获取联系人');
    return;
  };
  let target;
  Object.values(contacts).some(ctc => {
    const curDisplayName = ctc.getDisplayName(ctc);
    if ('[群] ' + nickName === curDisplayName || nickName === curDisplayName) {
      target = ctc;
      return true;
    }
  })
  return target;
};

const heartBeat = async bot => {
  const target = think.config('HEART_BEAT_TARGET');
  if (!target) return;
  !heatBeatStartDate && (heatBeatStartDate = new Date());
  function getDate() {
    const delta = Date.now() - heatBeatStartDate.getTime();
    let deltaMin = Math.floor(delta / 1000 / 60);
    if (deltaMin < 60) return deltaMin + '分';
    let deltaHour = Math.floor(deltaMin / 60);
    deltaMin = deltaMin % 60;
    if (deltaHour < 24) return `${deltaHour}时${deltaMin}分`;
    const deltaDay = Math.floor(deltaHour / 24);
    deltaHour = deltaHour % 24;
    return `${deltaDay}日${deltaHour}时${deltaMin}分`;
  }
  const msg = '存活:' + getDate();
  try {
    return await sendMsgTo(bot, target, msg);
  } catch (e) {
    return false;
  }
}

const initContacts = async bot => {
  console.warn('尝试获取联系人列表');
  const {BaseResponse, MemberCount, MemberList, Seq} = await bot.getContact(contactsSeq);
  contactsSeq = Seq;
  contactsList = MemberList;
  console.warn(`同步联系人列表完成,共获取${MemberCount}个联系人`);
}

const parseMsg = (bot, {to, msg, displayName, userName, userMail} = {to: '', msg: ''}) => {
  const reg = msg.match(/[^@]*@([^\s]+)\s?.*/);
  if (reg && reg[1]) {
    const target = getContactByNickName(bot, reg[1]);
    if (target) {
      msg = reg[0];
      to = target.NickName;
    }
  }
  const name = displayName || userName || userMail.split('@')[0];
  msg = `${msg} 
via ${name}`;
  return {
    to,
    msg
  }
}

module.exports = {
  sendMsgTo,
  getContactByNickName,
  initContacts,
  heartBeat,
  parseMsg
}

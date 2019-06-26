const schedule = require('node-schedule');
const exec = require('child_process').exec;
const {restartServer} = require('./utils');

const COMMAND_MAP = {
  api: {
    say: {
      route: 'robot/say',
      type: 'post'
    }
  }
};

// 每天凌晨1点重启服务器
const rule = new schedule.RecurrenceRule();
rule.hour = 1;
rule.minute = 0;
schedule.scheduleJob(rule, restartServer);

module.exports = class TaskHandler {
  constructor(options) {
    this.model = options.model;
    this.profile = options.profile;
    this.registerMap = {};
  }
  async run() {
    const data = await this.model.select();
    data.forEach(item => this.registerTask(item));
  }
  registerTask(data) {
    this.unregisterTask(data._id);
    if (data.frequency === 'once') {
      data.taskList.forEach(task => {
        this.registerOnceTask(data.date, task, data._id);
      });
    }
    if (data.frequency === 'everytime') {
      data.taskList.forEach(task => {
        this.registerEverytimeTask(data.week, data.date, task, data._id);
      });
    }
  }
  unregisterTask(_id) {
    const curTask = this.registerMap[_id];
    if (curTask) {
      curTask.cancel();
      delete this.registerMap[_id];
    }
  }
  async registerOnceTask(date, data, _id) {
    date = new Date(date);
    const curDate = new Date();
    // 在当前时间之前的任务不注册
    if (date.getTime() - curDate.getTime() <= 0) return;
    await this.registerCommand({ date, data, _id });
  }
  async registerEverytimeTask(week, date, data, _id) {
    date = new Date(date);
    const rule = new schedule.RecurrenceRule();
    week && (rule.dayOfWeek = week);
    rule.hour = date.getHours();
    rule.minute = date.getMinutes();
    rule.second = date.getSeconds();
    await this.registerCommand({ date: rule, data, _id });
  }
  async registerCommand({ date, data, _id }) {
    const command = COMMAND_MAP[data.type][data.value];
    if (!command) return;
    const task = schedule.scheduleJob(date, () => {
      const host = 'http://127.0.0.1:' + think.config('port') + `/${command.route}`;
      switch (command.type) {
        case 'get':
          console.log('暂时未处理get');
          break;
        case 'post':
          const paramsStr = Object.keys(data.params)
            .map(key => {
              return `${key}=${encodeURI(data.params[key])}`;
            })
            .join('&');
          const execStr = `curl --data "${paramsStr}" ${host}`;
          try {
            exec(execStr, async() => {
              await this.model.markRunningTime(_id, data._id);
            });
          } catch (e) {}
          break;
        default:
          break;
      }
    });
    this.registerMap[data._id] = task;
  }
  async update({ action, _id }) {
    const data = await this.model.getTask(_id);
    switch (action) {
      case 'add':
        if (!data) return;
        this.registerTask(data);
        break;
      case 'set':
        if (!data) return;
        this.registerTask(data);
        break;
      case 'delete':
        this.unregisterTask(_id);
        break;
      default:
        break;
    }
  }
};

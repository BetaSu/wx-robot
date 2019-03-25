async function getTaskInstance() {
  if (getTaskInstance.task) return getTaskInstance.task;
  const botDefer = require('../bootstrap/worker')
  const bot = await botDefer
  getTaskInstance.task = bot.extraData.task;
  return getTaskInstance.task;
}

module.exports = class extends think.Mongo {
  async saveTask(data) {
    const _id = await this.add(data);
    const task = await getTaskInstance();
    task.update({
      action: 'add',
      _id,
      model: this
    });
    return _id;
  }
  async delTask(_id) {
    const result = await this.where({ _id }).delete();
    const task = await getTaskInstance();
    task.update({
      action: 'delete',
      _id,
      model: this
    });
    return result;
  }
  async setTask(data) {
    const _id = data._id
    delete data._id
    const result = await this.where({_id}).update(data);
    if (result) {
      const task = await getTaskInstance();
      task.update({
        action: 'set',
        _id,
        model: this
      });
    }
    return result;
  }
  async getTask(_id) {
    const result = await this.where({_id}).find();
    return result
  }
  async markRunningTime(taskId, itemId) {
    const data = await this.getTask(taskId);
    if (!data) return
    data.taskList.forEach(item => {
      if (item._id === itemId) {
        const runningTime = think.isNumber(item.runningTime) ? item.runningTime++ : 1;
        item.runningTime = runningTime
      }
    })
    const result = await this.where({_id: taskId}).update({taskList: data.taskList});
    return result;
  }
};

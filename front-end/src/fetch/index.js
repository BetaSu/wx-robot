import api from './api'
import axios from 'axios';

axios.interceptors.response.use(({data, status} = {data: {}}) => {
  // 未登录重定向
  if (data.errno === 901) {
    global.location.href = '';
    return;
  }
  return data;
});

export const getInfo = () => axios.get(api.robot);

// 获取机器人详细数据
export const getDetail = () => axios.get(api.detail);

/**
 * 说话
 * @param {Object} params
    * @param {string} to 对话目标
    * @param {string} msg 说话的内容
 */
export const say = (params) => axios.get(api.robotSay, {params});

// 重启机器人
export const restartBot = () => axios.get(api.restart);

// 注销机器人
export const robotLogout = () => axios.get(api.robotLogout).then(_ => true);

// 获取定时任务列表
export const getTask = () => axios.get(api.task);

// 创建定时任务
export const createTask = data => axios.post(api.task, data);

// 删除任务
export const delTask = id => axios.delete(api.task, api.task, {params: {id}});

// 修改任务
export const setTask = data => axios.put(api.task, data);

// 获取用户信息
export const getUserData = data => axios.get(api.user);

// 注销
export const logout = data => axios.get(api.logout);

// 设置微信昵称 搁置 微信不返回数据了
export const setWxAccount = data => axios.post(api.setWxAccount, data);

// 消息概览
export const getMessageOverview = params => axios.get(api.message, {params});

export const searchMessage = params => axios.get(api.messageSearch, {params});

export const searchUser = params => axios.get(api.serchUser, {params});

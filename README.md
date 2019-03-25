基于 wechat4u 、ThinkJs 、Vue 实现的微信机器人

## 简介
```
一个微信机器人通知服务，可以批量、定时发送微信消息，包括前端与后端。
前端架构：VueJs
后端架构：ThinkJs + wechat4u
存储：mongoDB用于数据存储，Redis用于消息发送频率限制的缓存
```
## 安装
```
// 安装后端依赖
npm i --registry=registry.npm.taobao.org;
cd front-end;
// 安装前端依赖
npm i --registry=registry.npm.taobao.org;
```

## 启动服务
```
// 启动后端服务（请确保已安装 mongoDB、Redis）
npm run dev

// 启动前端服务
npm start

// 前端代码编译
npm run compile

// 启动pm2
npm run start-server
```

## 本地访问
  1. 启动服务
  2. 访问后台页面（需管理员权限）`http://localhost:8080/#/d`，根据提示登录微信
  3. 访问前台页面 `http://localhost:8080`，根据提示步骤使用服务

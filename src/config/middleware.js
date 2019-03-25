const path = require('path');
const isDev = think.env === 'development';
const redis = require('redis');
const { redis: {port, host, password} } = think.config('cache');
const db = redis.createClient(port, host, { password });
const ratelimiter = require('think-ratelimiter');

module.exports = [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'resource',
    // enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev
    }
  },
  {
    handle: 'payload',
    options: {
      keepExtensions: true,
      limit: '5mb'
    }
  },
  {
    handle: 'router',
    options: {}
  },
  {
    handle: ratelimiter,
    // 限制say接口调用频率，防止机器人被封
    options: {
      db,
      errorMessage: '请求太频繁',
      headers: {
        remaining: 'X-RateLimit-Remaining',
        reset: 'X-RateLimit-Reset',
        total: 'X-RateLimit-Limit'
      },
      resources: {
        'robot/say': {
          id: ctx => ctx.ip,
          max: 1,
          // ms
          duration: 2000
        }
      }
    }
  },
  'logic',
  'controller'
];

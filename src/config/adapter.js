// const fileCache = require('think-cache-file');
const redisCache = require('think-cache-redis');
const nunjucks = require('think-view-nunjucks');
const fileSession = require('think-session-file');
// const socketio = require('think-websocket-socket.io');
const {Console, File, DateFile} = require('think-logger3');
const path = require('path');
const isDev = think.env === 'development';

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: 'redis',
  common: {
    // millisecond
    timeout: 24 * 60 * 60 * 1000
  },
  redis: {
    handle: redisCache,
    port: 6379,
    host: '127.0.0.1',
    password: ''
  }
};

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mongo',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  mongo: {
    host: '127.0.0.1',
    port: 27017,
    user: '',
    password: '',
    database: 'wxrobot',
    options: {}
  }
};

/**
 * session adapter config
 * @type {Object}
 */
exports.session = {
  type: 'file',
  common: {
    cookie: {
      name: 'thinkjs'
    }
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.ROOT_PATH, 'runtime/session')
  }
};

/**
 * view adapter config
 * @type {Object}
 */
exports.view = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: {
    handle: nunjucks
  }
};

/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  type: isDev ? 'console' : 'dateFile',
  console: {
    handle: Console
  },
  file: {
    handle: File,
    backups: 10, // max chunk number
    absolute: true,
    maxLogSize: 50 * 1024, // 50M
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  },
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  }
};

// exports.websocket = {
//   type: 'socketio',
//   common: {
//     // common config
//   },
//   socketio: {
//     handle: socketio,
//     // 默认所有的域名都允许访问
//     allowOrigin: '127.0.0.1:8080',
//     // 默认 '/socket.io'
//     path: '/socket.io',
//     // 默认无adapter
//     adapter: null,
//     messages: [{
//       open: '/websocket/open',
//       addUser: '/websocket/addUser'
//     }]
//   }
// };

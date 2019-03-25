const path = require('path');
const Application = require('thinkjs');

const instance = new Application({
  ROOT_PATH: __dirname,
  // APP_PATH: path.join(__dirname, 'app'),
  proxy: true,
  env: 'production'
});

instance.run();

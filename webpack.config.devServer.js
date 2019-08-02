const { resolve } = require('path');

const apiPort = ':8000'
const apiHost = 'http://0.0.0.0' + apiPort

const HEADERS = {
  headers: {
    'X-Forwarded-Proto': 'http',
    'X-Nginx-Port': '3000'
  }
}
const routeOptions = {
  target: apiHost,
  // ...HEADERS
}

module.exports = {
  disableHostCheck: true,
  clientLogLevel: "info",
  host: '0.0.0.0',
  port: 3000,
  contentBase: resolve(__dirname, 'dist'),
  publicPath: '/',
  historyApiFallback: true,
  stats: {
    modules: false,
    chunks: false,
    chunckModules: false,
    timings: true,
    warnigns: false,
    colors: true,
  },
}

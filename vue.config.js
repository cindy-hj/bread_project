const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer : {
    proxy : {
      '/api' : {
        target : 'http://127.0.0.1:3000',
        changeOrigin : true,
        logLevel: 'debug'
      }
    }
  }
})
// cors이슈 해결하는 용.. -> 프론트와 백엔드의 서버주소가 다를떄...?
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig(
{
  transpileDependencies: true,
devServer: {
 allowedHosts: [
'ls-app.scalenext.io',
'localhost'
]
  },
}
)

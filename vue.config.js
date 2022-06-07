const IS_PROD = ["production"].includes(process.env.NODE_ENV);
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');
const TerserJsPlugin = require('terser-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports = {
  publicPath: '/',
  lintOnSave: false,
  runtimeCompiler: true,
  productionSourceMap: false,
  devServer: {
    open: true,
    host: "localhost",
    port: '6060',
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
          target: 'https://www.nftyeah.net/',
          ws: true,
          changeOrigin: true,
      }
    },
  },
  pwa: {
    themeColor: '',
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    },
    workboxOptions: {
      runtimeCaching: [{
        urlPattern: new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
        handler: 'cacheFirst',
        options: {
          cacheName: 'google-fonts',
          expiration: {
            maxEntries: 30
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }]
    }
  },
  configureWebpack: config => {
    const plugins = [];
    if (IS_PROD) {
      plugins.push(
        new TerserJsPlugin({
          terserOptions: {
            warnings: false,
            output: {
              comments: false
            },
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log']
            }
          },
          // sourceMap: false,
          parallel: true
        }),
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        }),
        new FileManagerPlugin({
          events: {
            onEnd: {
              archive: [
                { source: './dist', destination: './nft-dapp.zip' }
              ],
              delete: [
                './dist'
              ]
            }
          }
        })
      );
    }
    config.plugins = [...config.plugins, ...plugins];
  }
}

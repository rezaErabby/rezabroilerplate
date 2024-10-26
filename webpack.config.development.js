import { merge } from 'webpack-merge'
import path from 'path'
import { fileURLToPath } from 'url'
import config from './webpack.config.js'

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    devMiddleware: {
      writeToDisk: true
    }
  },
  output: {
    path: path.resolve(__dirname, 'public')
  }
})

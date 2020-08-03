import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
  input: './src/index.js', // 以这个入口打包
  output: {
    format: 'umd', // 模块化的类型 esModule commjs 模块
    name: 'Vue', // 全局变量的名字
    file: 'dist/umd/vue.js',
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    serve({
      open: true,
      port: 3000,
      contentBase: '', // ''以当前目录为基准
      openPage: '/index.html' // 默认打开的文件
    })
  ]
}
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/js/bundle.js',
    format: 'iife'
  },
  sourceMap: true,
  plugins: [
    resolve({
      jsnext: true,
    }),
    commonjs()
  ]
}

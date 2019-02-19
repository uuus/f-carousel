import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import copy from 'rollup-plugin-copy';
import server from 'rollup-plugin-server';
import livereload from 'rollup-plugin-livereload';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/js/bundle.js',
    format: 'iife',
    moduleName: 'f-carousel'
  },
  sourceMap: true,
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(),
    copy({
      'src/index.html':'dist/index.html'
    }),
    server({
      contentBase: './dist/',
      port: 3008,
      open: true,
    }),
    livereload()
  ]
}

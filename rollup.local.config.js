import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import server from 'rollup-plugin-server';
import livereload from 'rollup-plugin-livereload';
import filesize from 'rollup-plugin-filesize';

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
    terser({
      warnings: true,
      mangle: {
        module: true,
      },
    }),
    commonjs(),
    postcss({
      map: true
    }),
    babel({
      exclude: 'node_modules/**',
      presets: [[
        '@babel/preset-env',
        {
          exclude: ['transform-classes'],
          targets: {
            'chrome': 60,
            'safari': 10,
            'android': 4.4,
          },
          debug: true
        }
      ]],
      plugins: [
        ['@babel/plugin-transform-template-literals', {
          'loose': true
        }]
      ],
    }),
    copy({
      'src/index.html':'dist/index.html'
    }),
    filesize({
      showBrotliSize: true,
    }),
    server({
      contentBase: './dist/',
      port: 3008,
      open: true,
    }),
    livereload()
  ]
}

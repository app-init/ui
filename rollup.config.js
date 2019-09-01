import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import json from 'rollup-plugin-json'
import filesize from 'rollup-plugin-filesize'
import url from 'rollup-plugin-url'

import sass from 'rollup-plugin-sass'
import autoprefixer from 'autoprefixer'

import { terser } from 'rollup-plugin-terser'
import { resolve } from 'path'

import pkg from './package.json'

const externals = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})

]
 
const babelConfig = babel({
  babelrc: false,
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env', 
      { 
        modules: false 
      }
    ]
  ],
  plugins:[
    [
      "@babel/plugin-proposal-class-properties", 
      {
        loose: true
      }
    ],
  ],
  exclude: [
    'node_modules/**'
  ],
  runtimeHelpers: true,
})

export default [
  // ES
  {
    input: 'src/index.js',
    output: { 
      // dir: 'es', 
      file: 'es/app-init.js', 
      format: 'es', 
      indent: false, 
      sourcemap: true,
    },
    external: externals,
    plugins: [
      babelConfig,
      nodeResolve(),
      commonjs(),
      globals(),
      builtins(),
      sass({
        output: 'es/index.css', 
        sourcemap: true,
        modules: true,
        plugins: [          
          autoprefixer,
        ],
        options: {
          data: '@import \'./assets/scss/global-variables.scss\';'
        }
      }),
      filesize(),
    ]
  },
  
  // ES for Browsers
  {
    input: 'src/index.js',
    output: { 
      // dir: 'es-production',
      file: 'es/app-init.min.js', 
      format: 'es', 
      indent: false, 
      sourcemap: true,
    },
    external: externals,
    plugins: [
      babelConfig,
      json(),
      nodeResolve(),
      commonjs(),
      globals(),
      builtins(),
      sass({
        output: 'es/index.css', 
        plugins: [
          autoprefixer
        ],
        options: {
          data: '@import \'./assets/scss/global-variables.scss\';'
        }
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      }),
      filesize(),
    ]
  },
]
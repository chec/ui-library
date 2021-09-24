import commonjs from '@rollup/plugin-commonjs';
import scss from 'rollup-plugin-scss';
import vue from 'rollup-plugin-vue';
import svg from 'rollup-plugin-vue-inline-svg';
import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import alias from '@rollup/plugin-alias';
import { visualizer } from 'rollup-plugin-visualizer';
import del from 'rollup-plugin-delete';

import postcss from 'postcss';

// PostCSS plugins
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import assets from 'postcss-assets';

module.exports = {
  input: {
    index: 'src/index.js',
    // Code split components that rely on larger third party packages to facilitate code chunking in consuming libraries
    ChecLineChart: 'src/components/ChecLineChart.vue',
    ChecWysiwyg: 'src/components/ChecWysiwyg.vue',
  },
  output: {
    dir: 'dist',
    format: 'esm',
    exports: 'named',
    sourcemap: true,
  },
  plugins: [
    del({
      targets: 'dist/*',
    }),
    alias({
      entries: [
        { find: '@', replacement: `${__dirname}/src` },
      ],
    }),
    scss({
      output: 'dist/bundle.css',
      sourceMap: true,
      outputStyle: 'compressed',
      processor: () => postcss([
        tailwindcss,
        autoprefixer,
        assets,
      ]),
    }),
    svg(),
    vue({
      css: false,
      preprocessStyles: true,
      template: {
        isProduction: true,
      },
      style: {
        postcssPlugins: [
          tailwindcss,
          autoprefixer,
          assets,
        ],
      },
    }),
    esbuild({
      target: 'es2019',
      minify: true,
    }),
    commonjs(),
    resolve(),
    filesize(),
    visualizer(),
  ],
  external: [/@babel\/runtime/, 'vue'],
};

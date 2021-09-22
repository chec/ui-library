import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-only';
import vue from 'rollup-plugin-vue';
import svg from 'rollup-plugin-vue-inline-svg';
import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import alias from '@rollup/plugin-alias';
import analyzer from 'rollup-plugin-analyzer';

// PostCSS plugins
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import assets from 'postcss-assets';

module.exports = {
  input: {
    index: 'src/index.js',
    ChecLineChart: 'src/components/ChecLineChart.vue',
  },
  output: {
    dir: 'esm',
    format: 'esm',
    exports: 'named',
    sourcemap: true,
  },
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: `${__dirname}/src` },
      ],
    }),
    css(),
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
    analyzer({
      summaryOnly: true,
      limit: 10,
    }),
    filesize(),
  ],
  external: [/@babel\/runtime/, 'vue'],
};

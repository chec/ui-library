<template>
  <Prism
    class="code-example"
    :class="{ 'language-none': language === 'none' ? 'language-none' : '' }"
    :language="language !== 'none' ? language : 'javascript'"
  >
    <slot />
  </Prism>
</template>

<script>
// Base Prism import
import 'prismjs';
// Extra language configuration
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-php';
// Vue component for Prism
import Prism from 'vue-prism-component';

import 'prismjs/themes/prism.css';

export default {
  name: 'CodeComponent',
  components: {
    Prism,
  },
  props: {
    language: {
      type: String,
      default: 'none',
    },
  },
};
</script>

<style lang="scss">
// Basic formatting
code.code-example[class*='language-'],
pre.code-example[class*='language-'] {
  @apply bg-code-block text-white;
}

// Theme
.code-example {
  @apply bg-code-block rounded-md px-5 overflow-auto font-mono bg-gray-600 text-gray-100 w-full;

  pre {
    margin: 0.5em 0;
  }

  code {
    white-space: pre-wrap; // override prism.js tomorrow-theme default
  }

  pre[class*='language-'],
  code[class*='language-'] {
    @apply text-gray-100;
    text-shadow: none;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    line-height: 1.75;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  pre[class*='language-']::selection,
  code[class*='language-']::selection,
  pre[class*='language-']::mozselection,
  code[class*='language-']::mozselection {
    @apply bg-purple-100;
    text-shadow: none;
  }

  @media print {
    pre[class*='language-'],
    code[class*='language-'] {
      text-shadow: none;
    }
  }

  pre[class*='language-'] {
    @apply bg-gray-600;
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
  }

  :not(pre) > code[class*='language-'] {
    padding: 0.1em 0.3em;
    border-radius: 0.3em;
    color: #db4c69;
    background: #f9f2f4;
  }

  /*********************************************************
   * Tokens
   */

  .namespace {
    opacity: 0.7;
  }

  .token.cdata,
  .token.comment,
  .token.doctype,
  .token.prolog {
    @apply text-gray-400;
  }

  .token.punctuation {
    @apply text-blue-300;
  }

  .token.class-name {
    @apply text-orange-300;
  }

  .token.constant,
  .token.deleted,
  .token.number,
  .token.symbol,
  .token.tag {
    @apply text-purple-300 bg-transparent;
  }

  .token.boolean {
    @apply text-red-300;
  }

  .token.boolean {
    @apply text-orange-300;
  }

  .token.attr-name,
  .token.builtin,
  .token.char,
  .token.inserted,
  .token.string {
    @apply text-green-400;
  }

  .token.selector {
    @apply text-red-400;
  }

  .token.operator {
    @apply text-blue-200 bg-transparent;
  }

  .language-css .token.string,
  .style .token.string,
  .token.entity,
  .token.url {
    @apply text-orange-400 bg-transparent;
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword,
  .token.property {
    @apply text-blue-400;
  }

  .token.important,
  .token.regex,
  .token.variable {
    @apply text-orange-300;
  }

  .token.bold,
  .token.important {
    font-weight: bold;
  }

  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }

  .token.function {
    @apply text-purple-300;
  }
}
</style>

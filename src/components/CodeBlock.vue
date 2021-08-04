<template>
  <PrismEditor
    v-model="code"
    class="code-example"
    :class="classNames"
    :highlight="highlighter"
    :line-numbers="lineNumbers"
    :readonly="!editable"
  >
    <!--
      @slot Codeblock content
    -->
    <slot />
  </PrismEditor>
</template>

<script>
// Vue component for Prism
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
// Prism core
import { highlight, languages } from 'prismjs/components/prism-core';
// Used as a basis for langauge packs.
import 'prismjs/components/prism-clike';
// Import supported languages
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-php';

import 'prismjs/themes/prism.css';

export default {
  name: 'CodeComponent',
  components: {
    PrismEditor,
  },
  props: {
    /**
     * The language for syntax highlighting.
     *  Accepts either none, javascript, json, jsx or php.
     */
    language: {
      type: String,
      validate(type) {
        return ['none', 'javascript', 'json', 'jsx', 'php'].includes(type);
      },
      default: 'none',
    },
    /**
     * Display codeblock line numbers.
     */
    lineNumbers: Boolean,
    /**
     * Allow the codeblock to grow or shrink with the content
     */
    grow: Boolean,
    /**
     * Toggles on the editable mode.
     */
    editable: Boolean,
  },
  data() {
    return {
      code: '',
    };
  },
  computed: {
    classNames() {
      const {
        language,
        lineNumbers,
      } = this;

      return {
        'code-example--line-numbered': lineNumbers,
        'code-example--fixed': !this.grow,
        'language-none': language === 'none',
      };
    },
  },
  mounted() {
    // On mount, add the slot data to the data object.
    this.code = this.$slots.default[0].text;
  },
  updated() {
    // On update, add the slot data to the data object.
    this.code = this.$slots.default[0].text;
  },
  methods: {
    highlighter(code) {
      if (this.language === 'none') {
        return highlight(code, languages.markup);
      }
      return highlight(code, languages[this.language]);
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
  @apply bg-code-block rounded-md px-5 py-6 overflow-auto font-mono bg-gray-600 text-gray-100 w-full;

  pre {
    margin: 0.5em 0;
  }

  code {
    white-space: pre-wrap; // override prism.js tomorrow-theme default
  }

  &--line-numbered {
    @apply pl-0;
  }

  &--fixed {
    // Min and max height allowed for the codeblock component.
    min-height: 20rem;
    max-height: 35rem;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      @apply my-2 bg-transparent;
    }

    &::-webkit-scrollbar-thumb {
      @apply bg-blue-300 rounded-full;
    }
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

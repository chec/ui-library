<template>
  <div class="chec-wysiwyg" :class="classNames" @click="giveFocus">
    <div
      v-if="isScrollable"
      class="chec-wysiwyg__label-underlay"
      :class="{ 'chec-wysiwyg__label-underlay--scrolled-to-top': isScrolledToTop }"
    />
    <EditorContent
      ref="input"
      :editor="editor"
      v-bind="sharedInputProps"
      v-on="nonInputListeners"
      @input="handleInput"
    />
    <label
      v-if="label"
      class="chec-wysiwyg__label"
      :data-content="label"
      :for="id"
    >
      {{ label }}
      <span
        v-if="required"
        class="chec-wysiwyg__required-text"
      >
        {{ $t('general.requiredInline') }}
      </span>
    </label>
    <EditorMenuBar v-slot="{ commands, isActive }" :editor="editor">
      <div class="chec-wysiwyg__menubar">
        <button
          type="button"
          :title="$t('wysiwyg.bold')"
          :disabled="disabled"
          class="chec-wysiwyg__menubar--button"
          :class="{ 'chec-wysiwyg__menubar--button-is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <ChecIcon icon="bold" size="base" />
        </button>
        <button
          type="button"
          :title="$t('wysiwyg.italic')"
          class="chec-wysiwyg__menubar--button"
          :class="{ 'chec-wysiwyg__menubar--button-is-active': isActive.italic() }"
          :disabled="disabled"
          @click="commands.italic"
        >
          <ChecIcon icon="italic" size="base" />
        </button>
        <button
          type="button"
          :title="$t('wysiwyg.h1')"
          class="chec-wysiwyg__menubar--button"
          :class="{ 'chec-wysiwyg__menubar--button-is-active': isActive.heading({ level: 1 }) }"
          :disabled="disabled"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </button>
        <button
          type="button"
          :title="$t('wysiwyg.h2')"
          class="chec-wysiwyg__menubar--button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          :disabled="disabled"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </button>
        <button
          type="button"
          :title="$t('wysiwyg.h3')"
          class="chec-wysiwyg__menubar--button"
          :class="{ 'chec-wysiwyg__menubar--button-is-active': isActive.heading({ level: 3 }) }"
          :disabled="disabled"
          @click="commands.heading({ level: 3 })"
        >
          H3
        </button>
        <button
          type="button"
          :title="$t('wysiwyg.bulletlist')"
          class="chec-wysiwyg__menubar--button"
          :class="{ 'menubar__button--is-active': isActive.bullet_list() }"
          :disabled="disabled"
          @click="commands.bullet_list"
        >
          <ChecIcon icon="bullet-list" size="base" />
        </button>
        <button
          type="button"
          :title="$t('wysiwyg.blockquote')"
          class="chec-wysiwyg__menubar--button"
          :class="{ 'chec-wysiwyg__menubar--button-is-active': isActive.blockquote() }"
          :disabled="disabled"
          @click="commands.blockquote"
        >
          <ChecIcon icon="quote" size="base" />
        </button>
      </div>
    </EditorMenuBar>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  Blockquote,
  Bold,
  BulletList,
  Heading,
  Italic,
  ListItem,
  Placeholder,
} from 'tiptap-extensions';
import ChecIcon from '@/components/ChecIcon.vue';
import uniqueId from '@/lib/helpers/createUniqueId';

export default {
  name: 'ChecWysiwyg',
  components: {
    ChecIcon,
    EditorContent,
    EditorMenuBar,
  },
  inheritAttrs: false,
  props: {
    /**
     * The state of the WYSIWYG field. One of "disabled", "error".
     */
    variant: {
      type: String,
      default: '',
    },
    /**
     * Size of the WYSIWYG field.  One of "sm", "md", "lg" or "auto".
     */
    size: {
      type: String,
      default: 'sm',
    },
    /**
     * The value the v-model directive utilizes
     * @see https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
     */
    value: {
      type: [String, Number],
      default: '',
    },
    /**
     * Class to pass to inner input element
     */
    innerInputClass: {
      type: String,
      default: '',
    },
    /**
     * Label for input
     */
    label: {
      type: String,
      default: '',
    },
    /**
     * An optional placeholder which will appear below the label as the current value when the field has no value.
     * Appears like a value in the field, but acts like a traditional placeholder.
     */
    placeholder: String,
    /**
     * Additional input attributes that should be applied to the native input
     */
    additionalInputAttributes: {
      type: Object,
      default: () => ({}),
    },
    /**
     * Allows for toggling of html attribute of "required" in label
     */
    required: Boolean,
    /**
     * The style variant for the WYSIWYG field. One of "light" or "dark"
     */
    styleVariant: {
      type: String,
      default: 'light',
      validator(value) {
        return ['light', 'dark'].includes(value);
      },
    },
  },
  data() {
    const { input, ...nonInputListeners } = this.$listeners;
    return {
      isScrollable: false,
      isScrolledToTop: true,
      hasFocus: false,
      id: uniqueId(this.name || 'chec', 'wysiwyg')(),
      editor: null,
      nonInputListeners,
      trackedValue: this.value,
    };
  },
  computed: {
    disabled() {
      return this.variant === 'disabled';
    },
    sharedInputProps() {
      const {
        additionalInputAttributes,
        value,
        variant,
        id,
        $attrs,
      } = this;
      return {
        ...$attrs,
        ...additionalInputAttributes,
        class: ['chec-wysiwyg__input', this.innerInputClass, {
          'chec-wysiwyg__input--has-placeholder': this.hasPlaceholder,
        }],
        disabled: variant === 'disabled',
        id,
        ref: 'input',
        value,
      };
    },
    classNames() {
      const {
        hasFocus,
        label,
        value,
        styleVariant,
        variant,
        size,
      } = this;
      return {
        'chec-wysiwyg--disabled': variant === 'disabled',
        'chec-wysiwyg--error': variant === 'error',
        'chec-wysiwyg--focussed': hasFocus,
        'chec-wysiwyg--empty': value === '' || value === '<p></p>',
        'chec-wysiwyg--inline-label': label,
        'chec-wysiwyg--modified': label ? !!value : false,
        [`chec-wysiwyg--${styleVariant}`]: styleVariant !== '',
        [`chec-wysiwyg--size-${size}`]: size !== '',
      };
    },
    hasPlaceholder() {
      return typeof this.placeholder === 'string' && this.placeholder.length > 0;
    },
  },
  watch: {
    value(newValue) {
      // Handle external updates of the text value. We do this by tracking the current value of the editor in a data
      // attribute, and then comparing watched changes to the `value` prop to the value we're tracking with the editor.
      // If it changes, then we have an external change that wasn't prompted by changes within the editor.
      this.$nextTick(() => {
        if (newValue !== this.trackedValue) {
          this.editor.setContent(newValue);
        }
      });
    },
    disabled(disabled) {
      this.editor.setOptions({
        editable: !disabled,
      });
    },
    /**
     * Allow placeholder text to be reactive - it has to update the TipTap extension config
     */
    placeholder(placeholder) {
      if (typeof placeholder !== 'string' || placeholder.length === 0) {
        return;
      }

      this.editor.extensions.options.placeholder.emptyNodeText = placeholder;
    },
    isScrollable(scrollable) {
      if (scrollable) {
        this.$refs.input.$el.addEventListener('scroll', this.handleScroll);
      } else {
        this.$refs.input.$el.removeEventListener('scroll', this.handleScroll);
      }
    },
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new BulletList(),
        new Heading({ levels: [1, 2, 3] }),
        new Bold(),
        new Italic(),
        new ListItem(),
        new Placeholder({
          emptyNodeText: this.hasPlaceholder ? this.placeholder : '',
          emptyEditorClass: 'chec-wysiwyg__node--empty',
        }),
      ],
      content: this.value,
      editable: !this.disabled,
      onUpdate: ({ getHTML }) => {
        const value = getHTML();
        this.trackedValue = value;
        this.$emit('input', value);
        this.autoGrow();
      },
      onFocus: () => { this.hasFocus = true; },
      onBlur: () => { this.hasFocus = false; },
    });
    this.autoGrow();
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {
    autoGrow() {
      /**
       * Allows the text area to grow to match the value as the user is typing.
       */
      this.isScrollable = this.$refs.input.$el.scrollHeight > 160;
    },
    handleInput($event) {
      /**
       * Emitted when the `<input>`'s 'input' event bubbles up. The v-model directive uses this to function.
       * @event input
       * @type {$event.target.value}
       */
      this.$emit('input', $event.target.value, $event);
    },
    handleScroll() {
      this.isScrolledToTop = this.$refs.input.$el.scrollTop === 0;
    },
    /**
     * Give focus with a MouseEvent, allowing clicks that miss the editor to still give focus to it.
     *
     * @param {MouseEvent} event
     */
    giveFocus(event) {
      // Get the actual text editor from our ref
      const { childNodes } = this.$refs.input.$el;
      const editorNode = childNodes.length === 1 ? childNodes[0] : this.$refs.input.$el;

      // Don't give focus (with JS) if the click is actually on the text-editor
      if (editorNode.contains(event.target)) {
        return;
      }

      // Don't adjust the focus if the editor already has it
      if (document && document.activeElement && this.$refs.input.$el.contains(document.activeElement)) {
        return;
      }

      this.editor.focus('end');
    },
  },
};
</script>

<style lang="scss">
.chec-wysiwyg {
  @apply relative
    bg-white
    rounded
    border
    border-gray-200
    shadow-sm;

  %filled-transformation {
    transform: translate(0.05rem, -0.5rem) scale(0.8, 0.8);
  }

  &__icon {
    @apply absolute flex ml-4 h-full items-center text-gray-400;
    // Offset for the inputs border:
    left: 1px;
  }

  &__label {
    @apply absolute top-0 left-0 pointer-events-none ml-4 mt-4 leading-tight text-gray-500
      transition-transform duration-150 origin-top-left z-20;
    @extend %filled-transformation;
  }

  &__required-text {
    @apply text-gray-400;
  }

  &__menubar {
    @apply flex bg-gray-600 m-4 mt-2 p-1 rounded text-white;

    width: 232px;

    &--button {
      @apply h-8 w-8 text-xs rounded text-center;

      svg {
        @apply m-auto;
      }
    }

    &--button-is-active {
      @apply bg-gray-500;
    }
  }

  &__input {
    @apply
      leading-tight
      text-sm
      text-gray-600
      w-full
      px-4
      duration-150
      outline-none
      transition
      resize-none
      rounded
      overflow-auto
      h-40
      py-4
      pb-16;

    max-height: 16rem;
    scroll-margin: 50px 0 0 50px;
    scrollbar-color: #d3e0f1 transparent;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
      @apply w-1;
    }

    &::-webkit-scrollbar-track {
      @apply bg-transparent;
    }

    &::-webkit-scrollbar-thumb {
      @apply w-1 bg-gray-300 rounded;
    }

    .chec-wysiwyg--empty & {
      @apply py-4;
    }

    &:not(&--has-placeholder) {
      .chec-wysiwyg--empty:not(.chec-wysiwyg--focussed) & {
        + .chec-wysiwyg__label {
          transform: scale(1, 1);
        }
      }
    }
  }

  // Placeholder styling
  &__node--empty:first-child::before {
    content: attr(data-empty-text);
    @apply pointer-events-none h-0 float-left text-gray-400;
  }

  &:focus,
  &--focussed,
  &:active {
    @apply transition duration-150 border-gray-500 shadow-light-focus;
  }

  &:hover {
    @apply transition duration-150 border-gray-400;
  }

  &--dark {
    @apply bg-gray-600 border-gray-600;

    .chec-wysiwyg__label {
      @apply text-gray-300;
    }

    .chec-wysiwyg__input {
      @apply
        text-white
        border-gray-600
        bg-gray-600;
    }

    &:focus,
    &.chec-wysiwyg--focussed,
    &:active {
      @apply border-gray-400 shadow-dark-focus;
    }

    &:hover {
      @apply border-gray-400;
    }

    .chec-wysiwyg__menubar {
      @apply bg-gray-300 text-gray-500;

      .chec-wysiwyg__menubar--button-is-active {
        @apply text-gray-200;
      }
    }
  }

  &__label-underlay {
    @apply absolute rounded bg-vertical-transparent-gradient h-12 transition-opacity duration-300 z-10;
    // Offset for the inputs border:
    left: 1px;
    top: 1px;
    width: calc(100% - 6px);

    &--scrolled-to-top {
      @apply opacity-0;
    }
  }

  &--disabled {
    @apply opacity-40;

    .chec-wysiwyg__input {
      &:hover,
      &:focus,
      &:active {
        @apply border-gray-300 transition-opacity duration-300 ease-in-out shadow-none;
      }
    }

    .chec-wysiwyg__label {
      @apply transition-opacity duration-300 ease-in-out opacity-50;
    }
  }

  &--error {
    @apply border-red-400;

    &:hover,
    &:focus,
    &:active {
      @apply border-red-300;
    }

    &:focus,
    &.chec-wysiwyg--focussed,
    &:active {
      @apply shadow-error-focus;
    }
  }

  &--modified {
    .chec-wysiwyg__label {
      @apply opacity-100;
    }

    .chec-wysiwyg__input {
      @apply pb-2 pt-6;
    }
  }

  &--inline-label {
    .chec-wysiwyg__input {
      @apply pb-2 pt-6;
    }

    .chec-wysiwyg__input:focus {
      .chec-wysiwyg__label {
        @apply opacity-100;
      }
    }
  }

  &:not(.chec-wysiwyg--disabled) .chec-wysiwyg__input {
    &:focus,
    &:active {
      + .chec-wysiwyg__label {
        @extend %filled-transformation;
      }
    }
  }

  &--size-sm {
    .chec-wysiwyg__input {
      @apply h-40;
    }
  }

  &--size-md {
    .chec-wysiwyg__input {
      @apply h-56;
    }
  }

  &--size-lg {
    .chec-wysiwyg__input {
      @apply h-64;
    }
  }

  &--size-auto {
    .chec-wysiwyg__input {
      @apply h-auto;
    }
  }

  /* stylelint-disable */
  .ProseMirror {
    @apply h-full;
    outline: none;
    ul {
      @apply list-disc;
      padding-left: 20px;
    }
    blockquote {
      @apply border-solid border-gray-400 border-l-2 pl-2;
      p {
        @apply inline;
      }
    }
  }
  /* stylelint-enable */
}
</style>

<template>
  <div class="text-field" :class="{
    'text-field--inline-label': label,
    'text-field--modified': label ? !!value : false,
    'text-field--multiline': multiline,
    }"
  >
    <textarea v-if="multiline"
      v-bind="sharedInputProps"
      @input="handleInput"
      @focus="handleFocus"
    ></textarea>
    <input v-else
      v-bind="sharedInputProps"
      :type="$attrs.type || 'text'"
      @input="handleInput"
      @focus="handleFocus"
    />
    <label
      v-if="label"
      class="text-field__label"
      :class="scrollable"
      :data-content="label"
      :for="id">
      <span class="invisible">{{ label }}</span>
    </label>
    <div class="text-field__right-content" ref="rightContentSlot">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import uniqueId from '@/lib/helpers/createUniqueId';

export default {
  name: 'TextField',
  inheritAttrs: false,
  props: {
    /**
     * The state of the text field. One of "disabled", "error".
     */
    variant: {
      type: String,
      default: '',
    },
    /**
     * The value the v-model directive utilizes
     * @see https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
     */
    value: {
      type: String,
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
    * Display multiline text field
    */
    multiline: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isScrollable: false,
      id: uniqueId(this.name, this.value, 'chec-switch')(),
    };
  },
  mounted() {
    this.autoGrow();
  },
  computed: {
    sharedInputProps() {
      const {
        value,
        classNames,
        variant,
        id,
        label,
        $attrs,
      } = this;

      return {
        ...$attrs,
        'aria-describedby': label,
        placeholder: ' ',
        class: classNames,
        disabled: variant === 'disabled',
        id,
        ref: 'input',
        value,
      };
    },
    classNames() {
      return [{
        'text-field__input--disabled': this.variant === 'disabled',
        'text-field__input--error': this.variant === 'error',
        'text-field__input--empty': this.value === '',
      }, 'text-field__input', this.innerInputClass];
    },
    scrollable() {
      return {
        'text-field__label--scrollable': this.isScrollable,
      };
    },
  },
  watch: {
    value() {
      this.$nextTick(() => {
        this.autoGrow();
      });
    },
  },
  methods: {
    handleInput($event) {
      /**
       * Emitted when the `<input>`'s 'input' event bubbles up. The v-model directive uses this to function.
       * @event input
       * @type {$event.target.value}
       */
      this.autoGrow();
      this.$emit('input', $event.target.value);
    },
    handleFocus($event) {
      $event.target.select();
    },
    autoGrow() {
      if (!this.multiline) {
        return;
      }
      /**
       * Allows the text area to grow to mtch the value as the user is typing.
       */
      this.$refs.input.style.height = '  5rem';
      this.$refs.input.style.height = `${this.$refs.input.scrollHeight + 2}px`;
      this.isScrollable = this.$refs.input.scrollHeight > 160;
    },
  },
};
</script>
<style lang="scss">
.text-field {
  @apply relative;

  &__label {
    @apply absolute top-0 left-0;
    &::before {
      @apply
        relative
        text-gray-500
        inline-block
        origin-top-left
        transition-transform
        duration-150
        pl-5
        py-4
        leading-tight;

      content: attr(data-content);
      backface-visibility: hidden;
      transform: translate3d(0, -.3rem, 0) scale3d(.8, .8, 1);
    }
  }

  &__input {
    @apply
      leading-tight
      text-sm
      text-gray-600
      w-full
      p-4
      bg-white
      rounded
      border
      border-gray-300
      outline-none;

    &::placeholder {
      color: rgba(0, 0, 0, 0);
    }

    &:placeholder-shown {
      + {
        .text-field__label {
          &::before {
            transform: scale3d(1, 1, 1);
          }
        }
      }
    }

    &:focus, &:active {
      @apply border-gray-500;

      &:not(.text-field__input--disabled) + .text-field__label {
        &::before {
          transform: translate3d(0, -.3rem, 0) scale3d(.8, .8, 1);
        }
      }
    }
    &:hover {
      @apply border-gray-400;
    }
    &--disabled {
      @apply opacity-50;

      + .text-field__label {
        &::before {
          @apply transition-opacity duration-300 ease-in-out opacity-50;
        }
      }

      &:hover,
      &:focus,
      &:active {
        @apply border-gray-300 transition-opacity duration-300 ease-in-out opacity-50;
      };
    }

    &--error,
    &:not(.text-field__input--empty):invalid {
      @apply border-red-300;
      &:hover,
      &:focus,
      &:active {
        @apply border-red-200;
      }
    }
  }

  &--modified {
    .text-field__label {
      @apply opacity-100;
    }
    .text-field__input {
      @apply pb-2 pt-6;
    }
  }

  &--inline-label {
    .text-field__input:focus {
      @apply pb-2 pt-6;
      .text-field__label {
        @apply opacity-100;
      }
    }
  }

  &--multiline {
    .text-field__label {
      @apply absolute left-0 top-0  h-10 rounded pointer-events-none;
      margin: 1px;
      &:before {
        top: 3.25rem;
      }
      &--scrollable {
        @apply bg-vertical-transparent-gradient;
        width: calc(100% - 10px);
      }
    }

    .text-field__input {
      @apply resize-none overflow-auto h-20;
      max-height: 10rem;
      scroll-margin: 50px 0 0 50px;
      &::-webkit-scrollbar {
        @apply w-1;
      }
      &::-webkit-scrollbar-track {
        @apply bg-transparent;
      }
      &::-webkit-scrollbar-thumb {
        @apply w-1 bg-gray-300 rounded;
      }
      scrollbar-color: #D3E0F1 transparent;
      scrollbar-width: thin;
    }
  }
}
</style>

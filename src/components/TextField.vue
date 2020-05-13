<template>
  <div class="text-field" :class="{
    'text-field--inline-label': label,
    'text-field--modified': label ? !!value : false,
    'text-field--multiline': multiline,
    }"
  >
    <textarea v-if="multiline"
      class="input"
      ref="multilineinput"
      :value="value"
      :placeholder="placeholder"
      :disabled="this.variant === 'disabled'"
      :class="classNames"
      @input="handleInput"
      @focus="handleFocus"
      :id='$inputId'
    ></textarea>
    <input v-else
      ref="input"
      :name="$attrs.name"
      class="input"
      :type="isPasswordType ? (showPassword ? 'text' : 'password') : $attrs.type"
      :value="value"
      :placeholder="label"
      :disabled="this.variant === 'disabled'"
      :class="[classNames, innerInputClass]"
      :id='$inputId'
      @input="handleInput"
      @focus="handleFocus"
      :aria-describedby="label"
    />
    <label
      v-if="label"
      class="text-field__label"
      :class="scrollable"
      :data-content="label"
      :for="$inputId">
      <span class="invisible">{{ label }}</span>
    </label>
    <a
      v-if="isPasswordType"
      class="text-field__show-password"
      @click="toggleShowPassword"
    >
      {{ showHideText }}
    </a>
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
     * The value used for the inner `<input>`'s placeholder html attribute
     */
    placeholder: {
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
    /**
     * Appended text to 'show/hide' button
     */
    hiddenField: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isScrollable: false,
      showPassword: false,
    };
  },
  created() {
    this.$inputId = uniqueId(this.name, this.value, 'chec-switch')();
  },
  mounted() {
    this.autoGrow();
  },
  computed: {
    classNames() {
      return {
        'opacity-50 input--disabled': this.variant === 'disabled',
        'input--error': this.variant === 'error',
        'input--empty': this.value === '',
      };
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
    isPasswordType() {
      return this.$attrs.type === 'password';
    },
    showHideText() {
      return `${this.showPassword ? 'hide' : 'show'} ${this.hiddenField}`;
    },
  },
  methods: {
    /**
     * Toggles password type with type text to show password
     */
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
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
      if (!this.$refs.multilineinput) {
        return;
      }
      /**
       * Allows the text area to grow to mtch the value as the user is typing.
       */
      this.$refs.multilineinput.style.height = '  5rem';
      this.$refs.multilineinput.style.height = `${this.$refs.multilineinput.scrollHeight + 2}px`;
      this.isScrollable = this.$refs.multilineinput.scrollHeight > 160;
    },
  },
};
</script>
<style lang="scss">
.text-field {
  @apply relative;
  &__label {
    &::before {
      @apply relative text-gray-500 inline-block origin-top-left transition-transform duration-150 left-0 pl-5;
      content: attr(data-content);
      backface-visibility: hidden;
      transform: translate3d(0, -2.8rem, 0) scale3d(.8, .8, 1);
    }
  }

  &__show-password {
    @apply title-xxs text-blue-500 float-right mt-1 cursor-pointer;
  }

  .input {
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
            transform: translate3d(0, -2.3rem, 0) scale3d(1, 1, 1);
          }
        }
      }
    }
    &:focus, &:active {
      @apply border-gray-500;
      + {
        .text-field__label {
          &::before {
            transform: translate3d(0, -2.8rem, 0) scale3d(.8, .8, 1);
          }
        }
      }
    }
    &:hover {
      @apply border-gray-400;
    }
    &--disabled {
      + {
        .text-field__label {
          &::before {
            @apply transition-opacity duration-300 ease-in-out opacity-50;
          }
        }
      }
      &:hover,
      &:focus,
      &:active {
        @apply border-gray-300 transition-opacity duration-300 ease-in-out opacity-50;
      };
    }

    &--error,
    &:not(.input--empty):invalid {
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
    .input {
      @apply pb-2 pt-6;
    }
  }

  &--inline-label {
    .input:focus {
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
    .input {
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

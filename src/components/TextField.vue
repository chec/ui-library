<template>
  <div class="text-field" :class="{
    'text-field--inline-label': label,
    'text-field--modified': label ? !!value : false,
    'text-field--multiline': multiline,
    }"
  >
    <div class="input-wrapper">
      <textarea v-if="multiline"
        :name="$attrs.name"
        class="input"
        ref="multilineinput"
        :value="value"
        :placeholder="placeholder"
        :disabled="this.variant === 'disabled' || $attrs.disabled"
        :class="classNames"
        @input="handleInput"
        @focus="handleFocus"
        :id='$inputId'
      ></textarea>
      <input v-else
        :name="$attrs.name"
        class="input"
        :type="isPasswordType ? (showPassword ? 'text' : 'password') : $attrs.type"
        :value="value"
        :placeholder="label"
        :disabled="this.variant === 'disabled' || $attrs.disabled"
        :class="[classNames, innerInputClass]"
        :id='$inputId'
        @input="handleInput"
        @focus="handleFocus"
        :aria-describedby="label"
      />
      <label
        v-if="label"
        :class="scrollable"
        class="text-field__label"
        :for="$inputId"
      >
        {{ label }}
      </label>
      <div v-if="showPasswordStrength" class="text-field__password-strength" :class="strengthClass" />
    </div>
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
    hiddenFieldName: {
      type: String,
      default: '',
    },
    /**
     * Boolean indicating whether to show password strength indicator
     */
    showPasswordStrength: {
      type: Boolean,
      default: false,
    },
    /**
     * Strength of password from 0-4
     */
    passwordStrengthScore: {
      type: Number,
      default: null,
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
    isPasswordType() {
      return this.$attrs.type === 'password';
    },
    showHideText() {
      return `${this.showPassword ? 'hide' : 'show'} ${this.hiddenFieldName}`;
    },
    /**
     * Contextual highlight classes per strength score
     *
     * @returns {string}
     */
    strengthClass() {
      const score = this.passwordStrengthScore;
      if (!score && score !== 0) {
        return '';
      }
      if (score < 2) {
        return 'text-field__password-strength--invalid';
      }
      if (score < 3) {
        return 'text-field__password-strength--bad';
      }
      if (score < 4) {
        return 'text-field__password-strength--good';
      }
      return 'text-field__password-strength--great';
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
    @apply
      absolute
      flex
      items-center
      pl-4
      left-0
      top-0
      text-gray-500
      h-full
      origin-left
      transition-transform
      duration-150
      text-xs
      cursor-text
      overflow-hidden;
  }

  &__show-password {
    @apply title-xxs text-blue-500 float-right mt-1 cursor-pointer;
  }

  .input-wrapper {
    @apply relative flex flex-col-reverse overflow-hidden rounded border border-gray-300;
    &:hover {
      @apply border-gray-400;
    }
  }

  &__password-strength {
    @apply absolute left-0 w-full h-1 rounded-bl;
    &--invalid {
      @apply bg-red-300 w-1/4;
    }

    &--bad {
      @apply bg-orange-300 w-2/4;
    }

    &--good {
      @apply bg-green-300 w-3/4;
    }

    &--great {
      @apply bg-green-400 w-full rounded-br;
    }
  }

  .input {
    @apply
      leading-tight
      text-sm
      text-gray-600
      w-full
      p-4
      bg-white
      outline-none;

    &:hover {
      @apply border-gray-400;
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0);
    }

    &:placeholder-shown {
      + {
        .text-field__label {
          transform: translate(0) scale(1.5);
        }
      }
    }

    &:not(:placeholder-shown) + .text-field__label {
      transform: translate(0, -0.5rem) scale(1);
    }


    &:enabled {
      &:focus, &:active, {
        @apply border-gray-500;
        + {
          .text-field__label {
            transform: translate(0, -0.5rem) scale(1);
          }
        }
      }
    }

    &--disabled, &:disabled {
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
      @apply left-0 top-0 h-10 rounded pointer-events-none py-6;
      width: calc(100% - 10px);
      &:before {
        top: 3.25rem;
      }
      &--scrollable {
        @apply bg-vertical-transparent-gradient;
      }
    }
    .input {
      @apply resize-none h-20 overflow-y-auto;
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

<template>
  <div class="text-field" :class="{
    'text-field--inline-label': label,
    'text-field--modified': label ? !!value : false,
    }"
  >
    <input
      ref="input"
      class="input"
      :type="$attrs.type || 'text'"
      :value="value"
      :placeholder="label ? (isFocus ? '' : placeholder) : placeholder"
      :disabled="this.variant === 'disabled'"
      :class="[classNames, innerInputClass]"
      :id='$inputId'
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <label v-if="label" class="text-field__label" :for="$inputId">
      {{ label }}
    </label>
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
  },
  created() {
    this.$inputId = uniqueId(this.name, this.value, 'chec-switch')();
  },
  computed: {
    classNames() {
      return {
        'opacity-50 input--disabled': this.variant === 'disabled',
        'input--error': this.variant === 'error',
        'input--empty': this.value === '',
      };
    },
  },
  data() {
    return {
      isFocus: false,
    };
  },
  methods: {
    handleInput($event) {
      /**
       * Emitted when the `<input>`'s 'input' event bubbles up. The v-model directive uses this to function.
       * @event input
       * @type {$event.target.value}
       */
      this.$emit('input', $event.target.value);
    },
    handleFocus($event) {
      this.isFocus = true;
      $event.target.select();
    },
    handleBlur() {
      this.isFocus = false;
    },
  },
};
</script>d
<style lang="scss">
.text-field {
  @apply relative;
  &__label {
    @apply absolute top-0 left-0 w-full pt-2 text-xs text-gray-500 opacity-0;
    padding-left: calc(1rem + 1px);
  }
  .input {
    @apply
      leading-tight
      text-sm
      text-gray-500
      w-full
      p-4
      bg-white
      rounded
      shadow-sm
      border
      outline-none;

    border-color: transparent;

    &:hover {
      @apply border-gray-400;
    }

    &:focus,
    &:active {
      @apply border-gray-500;
      + .text-field__label {
        @apply opacity-75 transition-opacity duration-300 ease-in-out;
      }
    };

    &--disabled {
      &:hover,
      &:focus,
      &:active {
        @apply border-gray-300;
      };
      + .text-field__label {
        @apply transition-opacity duration-300 ease-in-out;
      }
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
}
</style>

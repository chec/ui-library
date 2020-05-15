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
      :data-content="label"
      :for="$inputId">
      <span class="invisible">{{ label }}</span>
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
      $event.target.select();
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
        + {
          .text-field__label {
            &::before {
              transform: translate3d(0, -2.3rem, 0) scale3d(1, 1, 1);
            }
          }
        }
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
}
</style>

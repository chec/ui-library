<template>
  <div class="text-field" :class="classNames">
    <div
      v-if="isScrollable"
      class="text-field__label-underlay"
      :class="{ 'text-field__label-underlay--scrolled-to-top': isScrolledToTop }"
    />
    <textarea
      v-if="multiline"
      v-bind="sharedInputProps"
      v-on="nonInputListeners"
      @input="handleInput"
    />
    <input
      v-else
      v-bind="sharedInputProps"
      :type="$attrs.type || 'text'"
      :style="{ 'padding-right': hasSlot && `${slotWidth}px` }"
      v-on="nonInputListeners"
      @input="handleInput"
    >
    <label
      v-if="label"
      class="text-field__label"
      :data-content="label"
      :for="id"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-field__required-text"
      >
        {{ $t('general.requiredInline') }}
      </span>
    </label>
    <div ref="currency" class="text-field__currency">
      {{ currencySymbol }}
    </div>
    <div v-if="$slots.default" ref="rightContentSlot" class="text-field__right-content">
      <slot />
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
      type: [String, Number],
      default: '',
    },
    /**
     * Class to pass to inner input element
     */
    innerInputClass: {
      type: [String, Array],
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
    multiline: Boolean,
    /**
    * Force label to always be in the minimized position.
    */
    minimizedLabel: Boolean,
    /**
     * An optional placeholder which will appear below the label as the current value when the field has no value.
     * Appears like a value in the field, but acts like a traditional placeholder.
     */
    placeholder: String,
    /**
     * Display text field in currency mode
     */
    currency: Boolean,
    /**
     * Currency symbol for use in currency mode
     */
    currencySymbol: {
      type: String,
      default: '$',
    },
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
     * The style variant for the text Input. One of "light" or "dark"
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
      slotObserver: null,
      id: uniqueId(this.name, this.value, 'chec-switch')(),
      slotWidth: 0,
      hasSlot: false,
      nonInputListeners,
    };
  },
  computed: {
    sharedInputProps() {
      const {
        additionalInputAttributes,
        id,
        required,
        value,
        variant,
        $attrs,
      } = this;

      return {
        ...$attrs,
        ...additionalInputAttributes,
        class: ['text-field__input', this.innerInputClass, {
          'text-field__input--has-placeholder': this.hasPlaceholder,
        }],
        disabled: variant === 'disabled',
        id,
        placeholder: this.hasPlaceholder ? this.placeholder : ' ',
        ref: 'input',
        required,
        value,
      };
    },
    classNames() {
      const {
        currency,
        label,
        multiline,
        value,
        styleVariant,
        variant,
        minimizedLabel,
      } = this;

      const classes = {
        'text-field--color': this.$attrs.type === 'color',
        'text-field--currency': currency,
        'text-field--disabled': variant === 'disabled',
        'text-field--error': variant === 'error',
        'text-field--empty': value === '',
        'text-field--inline-label': label,
        'text-field--labelless': label.length === 0,
        'text-field--multiline': multiline,
        'text-field--minimized-label': minimizedLabel,
        [`text-field--${styleVariant}`]: styleVariant !== '',
      };

      return classes;
    },
    hasPlaceholder() {
      return typeof this.placeholder === 'string' && this.placeholder.length > 0;
    },
  },
  watch: {
    value() {
      this.$nextTick(() => {
        this.autoGrow();
      });
    },
    currencySymbol() {
      this.$nextTick(() => {
        this.adjustCurrencyPadding();
      });
    },
    currency() {
      this.$nextTick(() => {
        this.adjustCurrencyPadding();
      });
    },
    isScrollable(scrollable) {
      if (scrollable) {
        this.$refs.input.addEventListener('scroll', this.handleScroll);
      } else {
        this.$refs.input.removeEventListener('scroll', this.handleScroll);
      }
    },
  },
  mounted() {
    this.autoGrow();
    this.adjustCurrencyPadding();
    if (!this.multiline && this.$slots.default) {
      this.slotObserver = new MutationObserver(this.adjustSlotWidth);

      this.slotObserver.observe(
        this.$refs.rightContentSlot,
        {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true,
        },
      );

      this.adjustSlotWidth();
    }
  },
  methods: {
    handleInput($event) {
      /**
       * Emitted when the `<input>`'s 'input' event bubbles up. The v-model directive uses this to function.
       * @event input
       * @type {$event.target.value}
       */
      this.autoGrow();
      this.$emit('input', $event.target.value, $event);
    },
    adjustSlotWidth() {
      this.hasSlot = this.$refs.rightContentSlot && this.$refs.rightContentSlot.clientWidth > 0;
      this.slotWidth = this.$refs.rightContentSlot && this.$refs.rightContentSlot.scrollWidth;
    },
    /**
     * Allows the input padding to grow to match the width of the currency symbol container.
     */
    adjustCurrencyPadding() {
      if (!this.currency) {
        this.$refs.input.style.removeProperty('padding-left');
        return;
      }
      this.$refs.input.style.paddingLeft = `${this.$refs.currency.offsetWidth}px`;
    },
    autoGrow() {
      if (!this.multiline) {
        return;
      }
      /**
       * Allows the text area to grow to match the value as the user is typing.
       */
      this.$refs.input.style.height = '  5rem';
      this.$refs.input.style.height = `${this.$refs.input.scrollHeight + 2}px`;
      this.isScrollable = this.$refs.input.scrollHeight > 160;
    },
    handleScroll() {
      this.isScrolledToTop = this.$refs.input.scrollTop === 0;
    },
  },
};
</script>

<style lang="scss">
.text-field {
  @apply relative;

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
      transition-transform duration-150 origin-top-left;
    @extend %filled-transformation;
  }

  &__required-text {
    @apply text-gray-400;
  }

  &__input {
    @apply
      leading-tight
      text-sm
      text-gray-600
      w-full
      px-4
      bg-white
      rounded
      border
      border-gray-200
      duration-150
      outline-none
      transition
      shadow-sm
      py-4;

    &::placeholder {
      @apply text-gray-400;
    }

    &:placeholder-shown {
      @apply py-4;
    }

    &:not(&--has-placeholder) {
      &::placeholder {
        @apply text-transparent;
      }

      &:placeholder-shown {
        + .text-field__label {
          transform: scale(1, 1);
        }
      }
    }

    &:focus,
    &:active {
      @apply transition duration-150 border-gray-500 shadow-light-focus;
    }

    &:hover {
      @apply transition duration-150 border-gray-400;
    }
  }

  &--dark {
    .text-field__label {
      @apply text-gray-300;
    }

    .text-field__currency {
      @apply text-white;
    }

    .text-field__input {
      @apply
        text-white
        border-gray-600
        bg-gray-600;

      &:focus,
      &:active {
        @apply border-gray-400 shadow-dark-focus;
      }

      &:hover {
        @apply border-gray-400;
      }
    }
  }

  &__right-content {
    // Alignment & spacing
    @apply absolute flex items-center h-full right-0 top-0 mx-4;
    // Default styles & colours
    @apply cursor-default text-gray-500 caps-xxs;
  }

  &__label-underlay {
    @apply absolute rounded bg-vertical-transparent-gradient h-12 transition-opacity duration-300;
    // Offset for the inputs border:
    left: 1px;
    top: 1px;
    width: calc(100% - 6px);

    &--scrolled-to-top {
      @apply opacity-0;
    }
  }

  &--color {
    .text-field__input {
      // Override height to show color selected
      height: 3.5rem;
    }
  }

  &__currency {
    @apply hidden absolute text-sm text-gray-500 top-0 pl-4 opacity-0 transition-opacity duration-150 leading-snug pt-6;

    .text-field--labelless & {
      @apply pt-4;
    }
  }

  &--disabled {
    .text-field__input {
      @apply opacity-40;

      &:hover,
      &:focus,
      &:active {
        @apply border-gray-300 transition-opacity duration-300 ease-in-out opacity-50;
      }
    }

    .text-field__right-content {
      @apply opacity-50;
    }

    .text-field__label {
      @apply transition-opacity duration-300 ease-in-out opacity-50;
    }
  }

  &--error &__input,
  &:not(.text-field--empty) &__input:invalid {
    @apply border-red-400;

    &:hover,
    &:focus,
    &:active {
      @apply border-red-300;
    }

    &:focus,
    &:active {
      @apply shadow-error-focus;
    }

  }

  &:not(.text-field--empty) {
    .text-field__label {
      @apply opacity-100;
    }

    .text-field__currency {
      @apply opacity-100 transition-opacity duration-150;
    }

    .text-field__input {
      @apply pb-2 pt-6;
    }

    &.text-field--disabled {
      .text-field__currency {
        @apply opacity-50 transition-opacity duration-150;
      }
    }

    &.text-field--labelless {
      .text-field__input {
        @apply py-4;
      }
    }
  }

  &--minimized-label {
    .text-field__label {
      @apply opacity-100;

      @extend %filled-transformation;
    }
  }

  &--inline-label {
    .text-field__input {
      @apply pb-2 pt-6;
    }

    .text-field__input:focus {
      .text-field__label {
        @apply opacity-100;
      }
    }
  }

  &--labelless {
    .text-field__input {
      @apply py-4;
    }
  }

  &--multiline {
    .text-field__input {
      max-height: 10rem;
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

      @apply resize-none overflow-auto h-20;
    }
  }

  &--currency {
    .text-field__currency {
      @apply block;
    }

    .text-field__input {
      @apply pl-6;
    }
  }

  &:not(.text-field--disabled) .text-field__input {
    &:focus,
    &:active {
      + .text-field__label {
        @extend %filled-transformation;
      }

      ~ .text-field__currency {
        @apply opacity-100 transition-opacity duration-150;
      }
    }
  }

  &--minimized-label {
    .text-field__label {
      @apply opacity-100;
      transform: translate(0.05rem, -0.5rem) scale(0.8, 0.8) !important;
    }

    .text-field__currency {
      @apply opacity-100 transition-opacity duration-150;
    }
  }
}
</style>

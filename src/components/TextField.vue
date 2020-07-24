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
      @input="handleInput"
    />
    <input
      v-else
      v-bind="sharedInputProps"
      :type="$attrs.type || 'text'"
      :style="{ 'padding-right': hasSlot && `${slotWidth}px` }"
      @input="handleInput"
    >
    <label
      v-if="label"
      class="text-field__label"
      :data-content="label"
      :for="id"
    >
      {{ label }}
    </label>
    <div v-if="$slots.default" ref="rightContentSlot" class="text-field__right-content">
      <slot />
    </div>
    <a
      v-if="actionLabel"
      class="text-field__action-button"
      @click="onActionClick"
    >
      {{ actionLabel }}
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
    * Display multiline text field
    */
    multiline: {
      type: Boolean,
    },
    /**
     * Text for action button beneath input
     */
    actionLabel: {
      type: String,
      default: '',
    },
    /**
     * Additional input attributes that should be applied to the native input
     */
    additionalInputAttributes: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isScrollable: false,
      isScrolledToTop: true,
      slotObserver: null,
      id: uniqueId(this.name, this.value, 'chec-switch')(),
      slotWidth: 0,
      hasSlot: false,
    };
  },
  computed: {
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
        placeholder: ' ',
        class: ['text-field__input', this.innerInputClass],
        disabled: variant === 'disabled',
        id,
        ref: 'input',
        value,
      };
    },
    classNames() {
      const {
        label,
        multiline,
        value,
        variant,
      } = this;

      return {
        'text-field--disabled': variant === 'disabled',
        'text-field--error': variant === 'error',
        'text-field--empty': value === '',
        'text-field--inline-label': label,
        'text-field--modified': label ? !!value : false,
        'text-field--multiline': multiline,
      };
    },
  },
  watch: {
    value() {
      this.$nextTick(() => {
        this.autoGrow();
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
    onActionClick(e) {
      /**
       * Emitted when action button is clicked
       * @event click
       * @type {e}
       */
      this.$emit('action-click', e, this.value);
    },
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
      this.hasSlot = this.$refs.rightContentSlot.clientWidth > 0;
      this.slotWidth = this.$refs.rightContentSlot.scrollWidth;
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
    transform: translate(-0.2rem, -0.5rem) scale(0.8, 0.8);
  }

  &__action-button {
    @apply caps-xxs text-blue-500 float-right mt-1 cursor-pointer;
  }

  &__label {
    @apply absolute top-0 left-0 pointer-events-none ml-5 mt-4 leading-tight text-gray-500
      transition-transform duration-150 origin-top-left;
    @extend %filled-transformation;
  }

  &__input {
    @apply
      leading-tight
      text-sm
      text-gray-500
      w-full
      px-4
      bg-white
      rounded
      border
      border-gray-300
      outline-none
      pb-2
      pt-6
    ;

    &::placeholder {
      color: rgba(0, 0, 0, 0);
    }

    &:placeholder-shown {
      @apply py-4;

      + .text-field__label {
        transform: scale(1, 1);
      }
    }

    &:focus,
    &:active {
      @apply border-gray-500;
    }

    &:hover {
      @apply border-gray-400;
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
    left: 1px;
    top: 1px;
    width: calc(100% - 6px);

    &--scrolled-to-top {
      @apply opacity-0;
    }
  }

  &--disabled {
    .text-field__input {
      @apply opacity-50;

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
    @apply border-red-300;

    &:hover,
    &:focus,
    &:active {
      @apply border-red-200;
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

  &:not(.text-field--disabled) .text-field__input {
    &:focus,
    &:active {
      + .text-field__label {
        @extend %filled-transformation;
      }
    }
  }
}
</style>

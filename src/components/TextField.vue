<template>
  <div class="text-field" :class="classNames">
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
      :style="{ 'padding-right': hasSlot && `${slotWidth}px` }"
    />
    <label
      v-if="label"
      class="text-field__label"
      :class="scrollable"
      :data-content="label"
      :for="id">
      <span class="invisible">{{ label }}</span>
    </label>
    <div class="text-field__right-content" ref="rightContentSlot" v-if="$slots.default">
      <slot></slot>
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
     * Text for action button beneath input
     */
    actionLabel: {
      type: String,
      default: '',
    },
    /**
     * Additional input attributes that should be applied to the native input
     */
    additionalInputAttributes: Object,
  },
  data() {
    return {
      isScrollable: false,
      slotObserver: null,
      id: uniqueId(this.name, this.value, 'chec-switch')(),
      slotWidth: 0,
      hasSlot: false,
    };
  },
  mounted() {
    this.autoGrow();

    if (!this.multiline) {
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
  computed: {
    sharedInputProps() {
      const {
        additionalInputAttributes,
        value,
        variant,
        id,
        label,
        $attrs,
      } = this;

      return {
        ...$attrs,
        ...additionalInputAttributes,
        'aria-describedby': label,
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
    onActionClick(e) {
      /**
       * Emitted when action button is clicked
       * @event click
       * @type {e}
       */
      this.$emit('actionClick', e, this.value);
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
    handleFocus($event) {
      $event.target.select();
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

  &__action-button {
    @apply caps-xxs text-blue-500 float-right mt-1 cursor-pointer;
  }

  &__label {
    @apply absolute top-0 left-0 h-12 cursor-text;

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
      transform: translate(0, -.3rem) scale(.8, .8);
    }
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
        &::before {
          transform: scale(1, 1);
        }
      }
    }

    &:focus, &:active {
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

  &--disabled {
    .text-field__input {
      @apply opacity-50;

      &:hover,
      &:focus,
      &:active {
        @apply border-gray-300 transition-opacity duration-300 ease-in-out opacity-50;
      };
    }

    .text-field__right-content {
      @apply opacity-50;
    }

    .text-field__label::before {
      @apply transition-opacity duration-300 ease-in-out opacity-50;
    }
  }

  &--error &__input,
  :not(.text-field--empty) &__input:invalid {
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
    .text-field__label {
      @apply absolute left-0 top-0  h-10 rounded pointer-events-none;
      margin: 1px;

      .text-field--scrollable & {
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

  &:not(.text-field--disabled) .text-field__input {
    &:focus, &:active {
      + .text-field__label::before {
        transform: translate(0, -.3rem) scale(.8, .8);
      }
    }
  }
}
</style>

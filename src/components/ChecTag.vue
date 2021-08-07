<template>
  <span class="chec-tag" :class="classObject">
    <slot />

    <button
      v-if="!undismissible"
      type="button"
      class="chec-tag__dismiss"
      :disabled="disabled"
      :title="$t('tag.dismiss')"
      @focus="handleFocus"
      @click="handleDismiss"
    >
      <ChecIcon icon="close" />
    </button>
  </span>
</template>

<script>
import ChecIcon from './ChecIcon';

export default {
  name: 'ChecTag',
  components: {
    ChecIcon,
  },
  props: {
    /**
     * The color of the tag. One of "light-grey", "dark-grey",  or "white". Default is "light-grey".
     */
    color: {
      type: String,
      default: 'light-grey',
      validator(value) {
        return ['light-grey', 'dark-grey', 'white'].includes(value);
      },
    },
    /**
     * Whether the tag is "active", which shows it as highlighted. This is the same as the browser
     * :active pseudo-state.
     */
    active: Boolean,
    /**
     * Whether the tag is disabled
     */
    disabled: Boolean,
    /**
     * If the tag is undismissible, it will not render a small "X" button to trigger a dismiss event
     */
    undismissible: Boolean,
  },
  computed: {
    /**
     * Returns the computed class name for the variant type, e.g. `chec-tag--success`
     *
     * @returns {Object}
     */
    classObject() {
      // To avoid specificity problems in CSS, the disabled state takes priority over others
      return {
        [`chec-tag--${this.color}`]: !this.active,
        'chec-tag--disabled': this.disabled,
        'chec-tag--active': this.active,
      };
    },
  },
  methods: {
    handleDismiss() {
      this.$emit('dismiss');
    },
    /**
     * Emit focus event on dismiss button
     */
    handleFocus() {
      this.$emit('focus');
    },
  },
};
</script>

<style lang="scss">
.chec-tag {
  @apply py-1 px-2 rounded shadow-sm font-bold text-xs border border-white leading-tight;

  .chec-tag__dismiss {
    @apply relative bg-gray-500 text-white;

    top: 2px;
  }

  &--active {
    @extend %active;
  }

  &--disabled {
    @apply opacity-40 bg-white text-gray-500 cursor-not-allowed;

    .chec-tag__dismiss {
      @apply cursor-not-allowed bg-gray-500 text-white ;
    }

    &.chec-tag--dark-grey {
      @apply bg-gray-600 text-white;

      .chec-tag__dismiss {
        @apply text-gray-600;
      }
    }
  }

  &--white {
    @apply bg-white;
  }

  &--dark-grey {
    @apply bg-gray-600 text-white border-gray-600;

    .chec-tag__dismiss {
      @apply bg-white text-gray-600;
    }
  }

  // All colours share the same active, hover/focus, and disabled styles
  &:not(.chec-tag--disabled) {
    &:active {
      @extend %active;
    }

    &:hover,
    &:focus {
      @apply bg-gray-500 text-white border-gray-500;

      .chec-tag__dismiss {
        @apply bg-white text-gray-500;
      }
    }
  }

  &__dismiss {
    @apply ml-1 w-3 h-3 rounded-full;
  }
}

%active {
  @apply bg-gray-400 text-white border-gray-400;

  .chec-tag__dismiss {
    @apply bg-white text-gray-400;
  }
}
</style>

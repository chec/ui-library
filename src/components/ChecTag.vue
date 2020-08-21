<template>
  <span class="tag" :class="classObject">
    <slot />

    <button
      v-if="!hideDismiss"
      type="button"
      class="tag__dismiss"
      :disabled="disabled"
      :title="$t('tag.dismiss')"
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
     * Whether to hide the dismiss tag button
     */
    hideDismiss: Boolean,
  },
  computed: {
    /**
     * Returns the computed class name for the variant type, e.g. `tag--success`
     *
     * @returns {Object}
     */
    classObject() {
      // To avoid specificity problems in CSS, the disabled state takes priority over others
      return {
        [`tag--${this.color}`]: !this.active,
        'tag--disabled': this.disabled,
        'tag--active': this.active,
      };
    },
  },
  methods: {
    handleDismiss() {
      this.$emit('dismiss');
    },
  },
};
</script>

<style lang="scss">

%active {
  @apply bg-gray-500 text-white border-gray-500;

  .tag__dismiss {
    @apply bg-white text-gray-500;
  }
}

.tag {
  @apply py-1 px-3 rounded-full font-bold text-sm border;

  &--active {
    @extend %active;
  }

  &--disabled {
    @apply opacity-40 cursor-not-allowed border-none;

    .tag__dismiss {
      @apply cursor-not-allowed;
    }
  }

  &--light-grey {
    @apply bg-gray-200 text-gray-500 border-gray-200;

    .tag__dismiss {
      @apply bg-gray-500 text-gray-200;
    }
  }

  &--dark-grey {
    @apply bg-gray-600 text-white border-gray-600;

    .tag__dismiss {
      @apply bg-white text-gray-600;
    }
  }

  &--white {
    @apply bg-white text-gray-500 border-gray-200;

    .tag__dismiss {
      @apply bg-gray-500 text-white;
    }
  }

  // All colours share the same active, hover/focus, and disabled styles
  &:not(.tag--disabled) {
    &:active {
      @extend %active;
    }

    &:hover,
    &:focus {
      @apply bg-gray-400 text-white border-gray-400;

      .tag__dismiss {
        @apply bg-white text-gray-400;
      }
    }
  }

  &__dismiss {
    @apply ml-1 w-3 h-3 rounded-full;
  }
}
</style>

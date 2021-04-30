<template>
  <button
    class="chec-tab"
    :class="{
      'chec-tab--active': active,
      // Default the color to light, unless it's round, when the default is dark (for BC)
      'chec-tab--dark': color === 'dark' || (color === '' && round),
      'chec-tab--round': round,
    }"
    :disabled="disabled"
    type="button"
    @click="handleClick"
  >
    <!--
      @slot Text to display within the tab button
      @binding disabled Whether the tab is disabled
      @binding active Whether the tab is active
    -->
    <slot v-bind="{ active, disabled }" />
  </button>
</template>

<script>
export default {
  name: 'ChecTab',
  props: {
    /**
     * If this tab should appear selected (active)
     */
    active: Boolean,
    /**
     * Disables the tab (but not the click handler)
     */
    disabled: Boolean,
    /**
     * Whether the tab should be dark and round, as seen in code block groups
     */
    round: Boolean,
    /**
     * The "style" of the tab. Either "light" or "dark"
     */
    color: {
      type: String,
      validator: (candidate) => ['light', 'dark', ''].includes(candidate),
      default: '',
    },
  },
  methods: {
    handleClick() {
      /**
       * Emitted the tab is clicked
       * @event click
       * @type {$event}
       */
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss">
.chec-tab {
  // Spacing
  @apply border-b-2 px-4 py-3 font-bold font-lato caps-xxs border-white bg-white text-gray-500;

  &:hover:enabled {
    @apply border-gray-300 bg-gray-100 text-gray-600;
  }

  &:disabled {
    @apply opacity-50 cursor-not-allowed;
  }

  &--active,
  &:active {
    &:enabled {
      @apply outline-none border-gray-500 text-gray-600;
    }
  }

  &:focus:enabled {
    @apply outline-none border-gray-400 text-gray-600 bg-gray-200;
  }

  &--dark {
    @apply bg-gray-500 text-gray-300 border-gray-500;

    &:hover:enabled {
      @apply bg-gray-600 border-gray-400 text-white;
    }

    &.chec-tab--active,
    &:active {
      &:enabled {
        @apply bg-gray-500 text-white border-white;
      }
    }

    &:focus:enabled {
      @apply bg-gray-600 text-white border-gray-300;
    }
  }

  &--round {
    @apply rounded-full bg-white text-gray-500 border border-transparent py-2 px-3 box-border;

    &:hover:enabled {
      @apply border-gray-200 text-gray-600;
    }

    &.chec-tab--active,
    &:active {
      &:enabled {
        @apply border-transparent bg-gray-200 text-gray-600;
      }
    }

    &:focus:enabled {
      @apply border-gray-300 text-gray-600;
    }

    &.chec-tab--dark {
      @apply text-gray-300 bg-gray-700;

      &:hover:enabled {
        @apply border-gray-400 text-white;
      }

      &.chec-tab--active,
      &:active {
        &:enabled {
          @apply border-transparent bg-gray-600 text-white;
        }
      }

      &:focus:enabled {
        @apply border-gray-300 text-white;
      }
    }
  }
}
</style>

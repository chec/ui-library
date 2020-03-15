<template>
  <button
    class="tab"
    @click="handleClick"
    :class="{ 'tab--active': active }"
    :disabled="disabled"
  >
    <span class="tab__text">
      <!--
        @slot Text to display within the tab button
        @binding disabled Whether the tab is disabled
        @binding active Whether the tab is active
      -->
      <slot v-bind="{ active, disabled }" />
    </span>
  </button>
</template>

<script>
export default {
  name: 'BaseTab',
  props: {
    /**
     * If this tab should appear selected (active)
     */
    active: {
      type: Boolean,
      default: false,
    },
    /**
     * Disables the tab (but not the click handler)
     */
    disabled: {
      type: Boolean,
      default: false,
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

<style scoped lang="scss">
.tab {
  @apply bg-gray-500 rounded px-4 py-2 cursor-pointer;
  &:hover {
    &:enabled {
      @apply bg-gray-600;
      .tab__text {
        @apply text-white font-bold;
      }
    }
  }
  &:active,
  &:focus {
    @extend .tab--active;
  }
  &:disabled {
    @apply opacity-50 cursor-not-allowed;
  }
  &__text {
    @apply text-white font-bold;
  }
  &--active {
    &:enabled {
      @apply bg-gray-400 outline-none;
      .tab__text {
        @apply text-white;
      }
      &:hover {
        @apply bg-gray-600;
      }
    }
    &:disabled {
      @apply bg-gray-500;
    }
  }
}
</style>

<template>
  <button
    class="chec-tab"
    :class="{
      'chec-tab--active': active,
      'chec-tab--dark': dark,
      'chec-tab--round': round,
    }"
    :disabled="disabled"
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
  &:active,
  &:focus {
    &:enabled {
      @apply outline-none border-gray-500 text-gray-600;
    }
  }

  &--round {
    @apply rounded-full bg-transparent text-white border-0 py-2 px-3;

    &.chec-tab--active,
    &:active,
    &:focus {
      &:enabled {
        @apply bg-gray-600 text-white;
      }
    }
  }
}
</style>

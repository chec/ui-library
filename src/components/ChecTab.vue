<template>
  <button
    class="chec-tab"
    :class="{ 'chec-tab--active': active }"
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
  @apply px-6 py-2 border-b-2 border-gray-300;
  @apply font-bold font-lato text-sm text-gray-400;
  &:hover:enabled {
    @apply text-gray-500 border-gray-400;
  }
  &:disabled {
    @apply opacity-50 cursor-not-allowed;
  }
  &--active, &:active, &:focus {
    &:enabled {
      @apply outline-none text-gray-500 border-gray-500;
    }
  }
}
</style>

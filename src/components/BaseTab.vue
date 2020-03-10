<template>
  <button
    class="tab"
    @click="handleClick"
    :class="{ 'tab--disabled': disabled, 'tab--active': active }"
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

<style lang="scss">
.tab {
  @apply bg-white rounded px-4 py-2 font-lato;
  &:hover {
    @apply bg-gray-200 cursor-not-allowed;
    .tab__text {
      @apply text-gray-500 font-bold;
    }
  }
  &:active,
  &:focus {
    @extend .tab--active;
    &:hover {
      .tab__text {
        @apply text-gray-500;
      }
    }
  }

  &__text {
    @apply text-gray-500 font-bold;
  }

  &--disabled {
    @apply opacity-50;
    &:hover {
      @apply bg-white;
    }
    &:active,
    &:focus {
      @apply bg-white;
      .tab__text {
        @apply text-gray-500;
      }
    }
  }

  &--active {
    @apply bg-gray-400 outline-none;
    .tab__text {
      @apply text-white;
    }
  }
}
</style>

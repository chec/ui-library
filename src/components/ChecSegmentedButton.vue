<template>
  <button
    class="chec-segmented-btn"
    @click="handleClick"
    :class="{ 'chec-segmented-btn--active': active }"
  >
    <span class="chec-segmented-btn__label">
      <!--
        @slot Label to display within the segmented button
        @binding disabled Whether the button is disabled
        @binding active Whether the button is active
      -->
      <slot v-bind="{ active }" />
    </span>
  </button>
</template>

<script>
export default {
  name: 'ChecSegmentedButton',
  props: {
    /**
     * Button is selected (active)
     */
    active: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick() {
      /**
       * Emitted the button is click
       * @event click
       * @type {$event}
       */
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss">
.chec-segmented-btn {
  @apply bg-gray-200 cursor-pointer px-2 py-2;

  &__label {
    @apply text-gray-500
  }
  &--active {
    &:enabled {
      @apply bg-gray-500;
      .chec-segmented-btn__label {
        @apply text-white;
      }
    }
  }
}
</style>

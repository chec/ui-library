<template>
  <div
    :class="`slideout-panel__overlay slideout-panel__overlay--${overlay}`"
    @click="onOverlayDismiss"
  />
</template>

<script>
export default {
  name: 'Overlay',
  props: {
    /**
     * The overlay backdrop when the panel is opened. One of "light" and "dark".
     */
    overlay: {
      type: String,
      default: 'light',
      validator(value) {
        return ['light', 'dark'].includes(value);
      },
    },
  },
  methods: {
    onOverlayDismiss() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
.slideout-panel {
  &__overlay {
    @apply
      fixed
      top-0
      left-0
      w-full
      h-full
      flex
      overflow-scroll
      transition-opacity
      ease-in-out
      duration-300
      bg-white
      bg-opacity-80;

    &--dark {
      @apply bg-gray-400 bg-opacity-75;
    }
  }
}
</style>

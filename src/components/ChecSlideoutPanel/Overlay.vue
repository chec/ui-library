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
    /**
     * Whether to close panel on overlay click. Default is true.
     */
    closeOnOverlayClick: Boolean,
  },
  methods: {
    onOverlayDismiss() {
      if (this.closeOnOverlayClick) {
        this.$emit('close');
      }
    },
  },
};
</script>

<style lang="scss">
.slideout-panel {
  &__overlay {
    @apply fixed top-0 left-0 w-full h-full flex z-50 overflow-scroll transition-opacity ease-in-out duration-300;
    // Special / overlay
    background-color: rgba(255, 255, 255, 0.95);

    &--dark {
      // Special / overlay
      background-color: rgba(65, 85, 108, 0.9);
    }
  }
}
</style>

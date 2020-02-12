<template>
  <span
    class="tag"
    :class="this.classObject"
  >
    <slot />
  </span>
</template>
<style lang="scss">
.tag {
  @apply mr-2 py-1 px-3 bg-primary-blue rounded-full text-xs text-white;

  &--success {
    @apply bg-green-600;
  }

  &--error {
    @apply bg-red-600;
  }

  &--warning {
    @apply bg-orange-600;
  }

  &--info {
    @apply bg-purple-600;
  }
}
</style>
<script>
export default {
  props: {
    /**
     * The style variant for the tag. One of "default", "success", "error", "warning", "info". Default is "default"
     */
    variant: {
      type: String,
      default: 'default',
      validator(value) {
        return ['default', 'success', 'error', 'warning', 'info'].includes(value);
      },
    },
  },
  computed: {
    /**
     * Returns the computed class name for the variant type, e.g. `tag--success`
     *
     * @returns {string}
     */
    classObject() {
      return this.variant === 'default' ? '' : `tag--${this.variant}`;
    },
  },
};
</script>

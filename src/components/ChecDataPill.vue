<template>
  <span class="data-pill" :class="this.classObject">
    <!--
      @slot Text to display within the pill
    -->
    <slot />
  </span>
</template>
<script>
export default {
  props: {
    /**
     * The style variant for the data pill. One of "news", "new", "updated", or empty for the primitive.
     */
    variant: {
      type: String,
      default: '',
      validator(value) {
        return ['', 'news', 'new', 'updated', 'slug'].includes(value);
      },
    },
  },
  computed: {
    /**
     * Returns the computed class name for the variant type, e.g. `data-pill--updated`
     *
     * @returns {string}
     */
    classObject() {
      return this.variant ? `data-pill--${this.variant}` : '';
    },
  },
};
</script>
<style lang="scss">
.data-pill {
  @apply mr-2 py-1 px-2 rounded-full text-xxs font-bold uppercase bg-white text-black border border-black;
  letter-spacing: 1px;

  &--news {
    @apply bg-gray-200 border-gray-200 text-gray-500;
  }

  &--new {
    @apply bg-green-100 border-green-100 text-green-600;
  }

  &--updated {
    @apply bg-orange-100 border-orange-100 text-orange-600;
  }

  &--slug {
    @apply bg-purple-100 border-purple-100 text-purple-600;
  }
}
</style>

<template>
  <nav
    class="vertical-navigation"
    :class="{ 'vertical-navigation--inline': inline}"
  >
    <ul
      class="vertical-navigation__list"
    >
      <!--
        @slot to display individual ChecVerticalNavItem components
      -->
      <slot />
    </ul>
  </nav>
</template>

<script>

export default {
  name: 'ChecVerticalNavigation',
  props: {
    /**
     * If this navigation list should appear inline
     */
    inline: Boolean,
  },
};
</script>

<style lang="scss">
.vertical-navigation {
  @apply rounded-md shadow-sm bg-white px-3 py-3;

  &--inline {
    @apply py-0 px-0 shadow-none bg-transparent rounded-none;
  }

  &__list {
    @apply text-gray-500;
  }
}
</style>

<template>
  <nav class="vertical-navigation">
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
};
</script>

<style lang="scss">
.vertical-navigation {
  @apply rounded-md shadow-sm bg-white px-3 py-3;

  &__list {
    @apply text-gray-500;
  }
}
</style>

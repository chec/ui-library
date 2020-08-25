<template>
  <nav class="vertical-navigation">
    <ul
      class="vertical-navigation__list"
    >
      <!--
        @slot to display individual ChecVerticalNavItem component
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
  @apply rounded shadow-sm w-56 bg-white px-3 py-5;

  &__list {
    @apply text-gray-500;
  }
}
</style>

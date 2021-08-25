<template>
  <li class="vertical-navigation__item">
    <router-link
      class="vertical-navigation__link"
      :to="to"
      :disabled="disabled"
    >
      <slot />
    </router-link>
  </li>
</template>

<script>
export default {
  name: 'ChecVerticalNavItem',
  props: {
    /**
     * Determines the path of the route. Matches the "to" param on `router-link`.
     */
    to: {
      type: [String, Object],
      required: true,
    },
    /**
     * If this navigation item should appear disabled
     */
    disabled: Boolean,
  },
};
</script>

<style lang="scss">
.vertical-navigation {
  &__item {
    @apply border-gray-200 rounded text-sm leading-tight;

    & + & {
      @apply border-t;
    }

    &:active,
    &:focus {
      @apply bg-gray-200 font-bold;
    }

    &:hover {
      @apply bg-gray-100;
    }

    &:disabled {
      @apply opacity-50 cursor-not-allowed;
    }
  }

  &__link {
    @apply block px-2 py-3;
  }

  .router-link-active {
    @apply bg-gray-200 font-bold;
  }
}
</style>

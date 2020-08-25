<template>
  <router-link
    v-slot="{ href, isActive }"
    class="vertical-navigation__item"
    :to="to"
  >
    <li
      :disabled="disabled"
      :class="[currentPath.includes(`${to}`) ? activeClass : '', isActive && 'router-link-active']"
      @keydown.down="selectNext"
      @keydown.up="selectPrev"
    >
      <a :href="href">
        <!--
          @slot Label to display as the navigation item label
        -->
        <slot />
      </a>
    </li>
  </router-link>
</template>

<script>
export default {
  name: 'ChecVerticalNavItem',
  props: {
    /**
     * Determines the path of the route
     */
    to: {
      type: String,
      required: true,
    },
    /**
     * If this navigation item should appear disabled
     */
    disabled: Boolean,
  },
  data() {
    return {
      activeClass: 'active',
    };
  },
  computed: {
    /**
     * Get the current active path
     */
    currentPath() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss">
.vertical-navigation {
  &__item {
    @apply px-2 py-3 border-gray-200 border-b rounded cursor-pointer;

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

  .active {
    @apply bg-gray-200 font-bold;
  }
}
</style>

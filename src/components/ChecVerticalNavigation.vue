<template>
  <nav class="vertical-navigation">
    <ul
      class="vertical-navigation__list"
    >
      <ChecVerticalNavItem
        v-for="{ label, link, active } in options"
        :key="label"
        :disabled="disabled"
        :active="active"
        :link="link"
        @keyup.down="focusNextItem"
        @keyup.up="focusPreviousItem"
        @click="handleClick"
      >
        {{ label }}
      </ChecVerticalNavItem>
    </ul>
  </nav>
</template>

<script>
import ChecVerticalNavItem from './ChecVerticalNavItem';

export default {
  name: 'ChecVerticalNavigation',
  components: {
    ChecVerticalNavItem,
  },
  props: {
    /**
     * The options for the navigation items
     */
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
    /**
     * Disables the navigation item (but not the click handler)
     */
    disabled: Boolean,
  },
  methods: {
    /**
     * Emitted the navigation item is clicked
     * @event click
     * @type {$event}
     */
    handleClick() {
      return this.active;
    },
    isActive(current) {
      return this.active === current;
    },
    // focusNextItem() {

    // },
    // focusPreviousItem() {

    // }
  },
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

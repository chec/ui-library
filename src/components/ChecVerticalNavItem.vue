<template>
  <li
    class="vertical-navigation-item"
    :class="{ 'vertical-navigation-item--active': active }"
    @keyup.down="focusNextItem"
    @keyup.up="focusPreviousItem"
    @click="handleClick"
  >
    <a :href="link">
      <!--
        @slot Label to display as the navigation item label
      -->
      <slot v-bind="{ active, disabled }" />
    </a>
  </li>
</template>

<script>
export default {
  name: 'ChecVerticalNavItem',
  props: {
    /**
     * Determines the link of the navigation item
     */
    link: {
      type: String,
      required: true,
    },
    /**
     * If this navigation item should appear selected (active)
     */
    active: Boolean,
    disabled: Boolean,
  },
  methods: {
    /**
     * Emitted the navigation item is clicked
     * @event click
     * @type {$event}
     */
    handleClick() {
      this.$emit('click');
    },
    // focusNextItem() {

    // },
    // focusPreviousItem() {

    // }
  },
};
</script>

<style lang="scss">
.vertical-navigation-item {
  @apply px-2 py-3 border-gray-200 border-b rounded cursor-pointer;

  &:hover {
    @apply bg-gray-100;
  }

  &:disabled {
    @apply opacity-50 cursor-not-allowed;
  }

  &--active,
  &:active,
  &:focus {
    @apply bg-gray-200 font-bold;
  }
}
</style>

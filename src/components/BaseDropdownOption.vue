<template>
  <div class="dropdown-option" @click="emitOptionsSelectedEvent" @keyup.enter="emitOptionsSelectedEvent" tabindex="0">
    <slot>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'BaseDropdownOption',
  props: {
    /**
     *
     * option's value
     */
    value: {
      type: String,
    },
  },
  methods: {
    emitOptionsSelectedEvent() {
      this.$emit('option-selected', this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
  .dropdown-option {
    @apply font-lato text-sm text-gray-600 px-4 py-3 outline-none cursor-pointer;
    &:hover {
      @apply bg-gray-100;
    }
    &:focus,
    &:active {
      @apply bg-gray-100;
    };
    &:not(:last-child) {
      @apply border-b border-gray-200;
    }
  }
</style>

<template>
  <div class="dropdown-option" @click="$emit('option-selected', optionKey, optionValue)">
    <slot>
      <span>{{optionValue}}</span>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'BaseDropdownOption',
  props: {
    /**
     * The option key
     */
    optionKey: {
      type: String,
    },
    /**
     * The option value
     */
    optionValue: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
  .dropdown-option {
    @apply font-lato text-sm text-gray-600 px-4 py-3;
    &:not(:last-child) {
      @apply border-b border-gray-200;
    }
  }
</style>

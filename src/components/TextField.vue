<template>
  <input
    class="input"
    :value="value"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="[
      disabled && 'opacity-50 input--disabled',
      error && 'input--error'
     ]"
    @input="$emit('input', $event.target.value)"
    />
</template>
<script>
export default {
  name: 'TextField',
  props: ['value', 'disabled', 'error', 'placeholder']
};
</script>
<style lang="scss" scoped>
.input {
  @apply text-base text-gray-500 p-4 bg-gray-200 rounded border border-gray-300 shadow-inner outline-none;
  &:hover {
    @apply border-primary-blue;
  };
  &:focus {
    @apply border-primary-blue;
  };
  &:active {
    @apply border-primary-blue;
  };
  &--disabled {
    &:hover {
      @apply border-gray-300;
    };
    &:focus {
      @apply border-gray-300;
    };
    &:active {
      @apply border-gray-300;
    };
  };
  &--error {
    @apply border-red-300;
    &:hover {
      @apply border-red-200;
    };
    &:focus {
      @apply border-red-200;
    };
    &:active {
      @apply border-red-200;
    };
  };
}
</style>

<template>
  <input :value="value" v-on:input="$emit('input', $event.target.value)" />
</template>
<script>
export default {
  name: 'TextField',
  props: ['value', 'disabled', 'error', 'active', 'autoFocus']
};
</script>

<style lang="scss" scoped>
input {
  @apply text-base text-gray-500 p-4 bg-gray-200 rounded border border-gray-300;
}
</style>

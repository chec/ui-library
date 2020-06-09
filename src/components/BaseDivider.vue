<template>
  <div class="divider">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BaseDivider',
};
</script>

<style lang="scss">
.divider {
  @apply flex items-center text-center caps-xxs text-gray-500;

  &:before, &:after {
    content: '';
    @apply flex-1 border-t border-gray-300;
 }
  &:before {
    @apply mr-8;
  }
  &:after {
    @apply ml-8;
  }
}
</style>

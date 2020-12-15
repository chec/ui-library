<template>
  <div class="divider" :class="{ 'divider--dark': color === 'dark' }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ChecDivider',
  props: {
    color: {
      type: String,
      validator: (candidate) => ['dark', 'light'].includes(candidate),
      default: 'light',
    },
  },
};
</script>

<style lang="scss">
.divider {
  @apply flex items-center text-center caps-xxs text-gray-500;

  &::before,
  &::after {
    content: '';

    @apply flex-1 border-t border-gray-300;
  }

  &::before {
    @apply mr-8;
  }

  &::after {
    @apply ml-8;
  }

  &--dark {
    @apply text-gray-300;

    &::before,
    &::after {
      @apply border-gray-500;
    }
  }
}
</style>

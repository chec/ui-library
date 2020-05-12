<template>
  <header class="chec-header">
    <h2 class="chec-header__title">
      {{ title }}
    </h2>

    <div v-if="label || $slots.default" class="chec-header-inner">
      <label class="chec-header-inner__label" v-if="label">
        {{ label }}
      </label>
      <!--
        @slot - Slot to distribute a <BaseButton> to
      !-->
      <slot />
    </div>
  </header>
</template>
<script>

export default {
  name: 'ChecHeader',
  props: {
    /**
     * heading text
     */
    title: {
      type: String,
      default: '',
    },
    /**
     * label text
     */
    label: {
      type: String,
      default: '',
    },
  },
};
</script>
<style lang="scss">
.chec-header {
  @apply flex justify-between items-center w-full;
  &__title {
    @apply text-2xl;
  }
  &-inner {
    @apply flex items-center;
    &__label {
      @apply title-xs;
      &:not(:last-child) {
        @apply pr-4;
      }
    }
  }
}
</style>

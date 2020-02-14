<template>
  <button
    class="tab"
    :class="{ 'tab--disabled': disabled}"
    :disabled="disabled">
    <slot>
      <span class="tab__text">
        {{ tabText }}
      </span>
    </slot>
  </button>
</template>

<script>
export default {
  name: 'BaseTab',
  props: {
    tabText: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.tab {
  @apply bg-white rounded-sm px-4 py-2 font-lato;
  &:hover {
    @apply bg-gray-200;
  }
  &:active,
  &:focus {
    @apply bg-gray-400 outline-none;
    .tab__text {
      @apply text-white;
    }
  }

  &__text {
    @apply text-gray-500 font-bold;
  }

  &--disabled {
    @apply opacity-50;
    &:hover {
      @apply bg-white;
    }
    &:active,
    &:focus {
      @apply bg-white;
      .tab__text {
        @apply text-gray-500;
      }
    }
  }
}
</style>

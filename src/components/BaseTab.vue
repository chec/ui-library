<template>
  <button
    class="tab"
    :class="{ 'tab--disabled': disabled, 'tab--active': active }"
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
    active: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
  },
};
</script>

<style lang="scss">
.tab {
  @apply bg-white rounded-sm px-4 py-2 font-lato;
  &:hover {
    @extend .tab--hover;
  }
  &:active,
  &:focus {
    @extend .tab--active;
    &:hover {
      .tab__text {
        @apply text-gray-500;
      }
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

  &--active {
    @apply bg-gray-400 outline-none;
    .tab__text {
      @apply text-white;
    }
  }

  &--hover {
    @apply bg-gray-200;
    .tab__text {
      @apply text-gray-500 font-bold;
    }
  }
}
</style>

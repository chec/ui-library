<template>
  <div class="dropdown">
    <div class="dropdown__control">
      <span>
        Dropdown
        <div class="dropdown__down-arrow">
          <SvgDownArrow />
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import SvgDownArrow from '../assets/svgs/down-arrow.svg';

export default {
  name: 'BaseDropdown',
  components: {
    SvgDownArrow,
  },
};
</script>

<style lang="scss" scoped>
  .dropdown {
    @apply w-full;
    &__control {
      @apply w-full bg-white shadow-sm rounded-sm;
      > span {
        @apply flex items-center justify-between w-full font-lato p-4 text-gray-500;
      }
    }
    &__down-arrow {
      @apply flex flex-col justify-center w-4 h-5 fill-current text-gray-600;
    }
  }
</style>

<template>
  <div class="dropdown">
    <div class="dropdown__control"
      :class="{ 'dropdown__control--open': showDropdown}"
      tabindex="0"
      @click="onControlClick"
      @keyup.enter="onControlClick"
      @keyup.down="onControlClick">
      <span>
        Dropdown
        <div class="dropdown__down-arrow">
          <SvgDownArrow />
        </div>
      </span>
    </div>
    <div v-if="showDropdown" class="dropdown__menu">
      <BaseDropdownOption
        v-for="([optionKey, optionValue], i) in options"
        :key="i"
        :optionKey="optionKey"
        :optionValue="optionValue"
        @option-selected="onOptionSelect"
      />
    </div>
  </div>
</template>

<script>
import SvgDownArrow from '../assets/svgs/down-arrow.svg';

import BaseDropdownOption from './BaseDropdownOption.vue';

export default {
  name: 'BaseDropdown',
  components: {
    SvgDownArrow,
    BaseDropdownOption,
  },
  props: {
    /**
     * The options for the dropdown
     */
    options: {
      type: Array,
    },
  },
  data() {
    return {
      showDropdown: false,
    };
  },
  methods: {
    onControlClick() {
      this.showDropdown = !this.showDropdown;
    },
    onOptionSelect(optionKey, optionValue) {
      this.$emit('option-selected', optionKey, optionValue);
    },
  },
};
</script>

<style lang="scss" scoped>
  .dropdown {
    @apply w-full;
    &__control {
      @apply w-full bg-white shadow-sm rounded-sm outline-none transition-all ease-in duration-200 cursor-pointer;
      &:hover {
        @apply border border-gray-400;
      }
      &:focus,
      &:active {
        @apply border border-gray-500;
      };
      > span {
        @apply flex items-center justify-between w-full font-lato p-4 text-sm text-gray-500;
      }
      &--open {
        @apply border border-gray-500;
      }
    }
    &__menu {
      @apply w-full bg-white border border-gray-300 rounded-sm;
    }
    &__option {
      @apply font-lato text-sm text-gray-600 px-4 py-3;
      &:not(:last-child) {
        @apply border-b border-gray-200;
      }
    }
    &__down-arrow {
      @apply flex flex-col justify-center w-5 h-5 fill-current text-gray-600;
    }
  }
</style>

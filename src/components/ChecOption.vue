<template>
  <div
    class="option"
    :class="classNames"
    tabindex="0"
    :role="!showCheckbox && 'button'"
    @click="emitOptionsSelectedEvent"
    @keyup.enter="emitOptionsSelectedEvent"
  >
    <div v-if="loading" class="option__loading-container">
      <ChecLoading />
    </div>
    <template v-else>
      <ChecCheckbox
        v-if="showCheckbox"
        :id="option.value"
        type="checkbox"
        class="mr-3"
        :checked="checked"
        :disabled="option.disabled"
        :indeterminate="indeterminate"
      />
      <slot />
    </template>
  </div>
</template>

<script>
import ChecLoading from './ChecLoading.vue';
import ChecCheckbox from './ChecCheckbox.vue';

export default {
  name: 'ChecOption',
  components: { ChecCheckbox, ChecLoading },
  props: {
    /**
     * Set's the option as a selectable option
     */
    showCheckbox: Boolean,
    /**
     * Indicate the checkbox (if shown) should be checked
     */
    checked: Boolean,
    /**
     * Indicate the checkbox (if shown) should have an indeterminate state
     */
    indeterminate: Boolean,
    /**
     * The option object
     */
    option: {
      type: Object,
      default: () => ({
        value: null,
        disabled: false,
      }),
    },
    /**
     * Whether the option is destructive, i.e. that it deletes something
     */
    destructive: Boolean,
    /**
     * Whether the content should be replaced with a loading indicator
     */
    loading: Boolean,
  },
  computed: {
    level() {
      const { level } = this.option;

      if (!level || typeof level !== 'number') {
        return 0;
      }
      if (level > 3) {
        return 3;
      }
      return level;
    },
    classNames() {
      return [
        {
          'option--disabled': this.option.disabled,
          'option--destructive': this.destructive,
          'option--loading': this.loading,
        },
        `option--level-${this.level}`,
      ];
    },
  },
  methods: {
    emitOptionsSelectedEvent() {
      if (!this.option.disabled) {
        this.$emit('option-selected', this.option);
        // When used in slots, parent components can attach handlers to this
        if (this.$parent) {
          this.$parent.$emit('option-selected', this.option);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.option {
  @apply w-full flex items-center text-sm px-4 py-3 outline-none cursor-pointer bg-white;

  &:hover:not(.option--loading) {
    @apply bg-gray-100;
  }

  &:focus,
  &:active {
    &:not(.option--loading) {
      @apply bg-gray-100;
    }
  }

  &:not(:last-child) {
    @apply border-b border-gray-200;
  }

  &__loading-container {
    @apply relative w-full h-4;
  }

  &--disabled {
    @apply opacity-50 cursor-not-allowed;

    &:hover,
    &:active,
    &:focus {
      @apply bg-white;
    }
  }

  &--loading {
    @apply cursor-default;
  }

  &--destructive {
    @apply text-red-600;
  }

  &--level- {
    &1 {
      @apply pl-8;
    }

    &2 {
      @apply pl-12;
    }

    &3 {
      @apply pl-16;
    }
  }
}
</style>

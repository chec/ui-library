<template>
  <div
    class="chec-switch"
    :class="{
      'chec-switch--toggled' : toggled,
      'chec-switch--disabled': disabled,
    }"
  >
    <label
      v-if="$slots.default && prefixLabel"
      :for="resolvedId"
      class="chec-switch__label chec-switch__label--prefixed"
      @click.prevent="handleToggle"
    >
      <slot />
    </label>
    <div class="chec-switch__container" @click.stop="handleToggle">
      <div class="chec-switch__thumb">
        <input
          :id="resolvedId"
          class="chec-switch__input"
          type="checkbox"
          :disabled="disabled"
          :checked="toggled"
          v-bind="{ name, required }"
        >
      </div>
    </div>
    <label
      v-if="$slots.default && !prefixLabel"
      :for="resolvedId"
      class="chec-switch__label"
      @click.prevent="handleToggle"
    >
      <slot />
    </label>
  </div>
</template>

<script>
import uniqueId from '@/lib/helpers/createUniqueId';

export default {
  name: 'ChecSwitch',
  model: {
    prop: 'toggled',
    event: 'input',
  },
  props: {
    /**
     * Name of the checkbox
     */
    name: {
      type: String,
      default: '',
    },
    /**
     * States whether element is required
     */
    required: Boolean,
    /**
     * Disables the switch
     */
    disabled: Boolean,
    /**
     * Check if checkbox is checked.
     */
    toggled: Boolean,
    /**
     * Whether to prefix the label (rather than display it after the switch)
     */
    prefixLabel: Boolean,
    id: String,
  },
  computed: {
    resolvedId() {
      return this.id || uniqueId(this.name, this.toggled ? '1' : '0', 'chec-switch')();
    },
  },
  methods: {
    handleToggle() {
      if (this.disabled) {
        return;
      }
      this.$emit('input', !this.toggled);
    },
  },
};
</script>

<style scoped lang="scss">
.chec-switch {
  @apply relative w-auto flex items-center cursor-pointer;

  &__container {
    @apply relative flex items-center w-10 h-5 rounded-full bg-gray-300 p-px shadow-inner;
  }

  &__thumb {
    @apply relative w-4 h-4 rounded-full bg-white mx-px cursor-pointer transition-all duration-300 ease-in-out;
  }

  &__label {
    @apply relative pl-2 cursor-pointer caps-xxs;

    &--prefixed {
      @apply pl-0 pr-2;
    }
  }

  &__input {
    left: -999em;
    position: absolute;
  }

  &--toggled {
    .chec-switch__container {
      @apply bg-green-400;
    }

    .chec-switch__thumb {
      transform: translate3d(20px, 0, 0);
    }
  }

  &--disabled {
    @apply cursor-not-allowed;

    .chec-switch__label,
    .chec-switch__thumb {
      @apply cursor-not-allowed;
    }

    &.chec-switch--toggled {
      .chec-switch__container {
        @apply bg-green-200;
      }
    }

    .chec-switch__label {
      @apply text-gray-400;
    }
  }
}
</style>

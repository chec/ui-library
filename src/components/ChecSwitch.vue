<template>
  <div class="chec-switch" :class="{ 'chec-switch--toggled' : toggled }">
    <div class="chec-switch__container" @click.stop="handleToggle">
      <div class="chec-switch__thumb">
        <input
          class="chec-switch__input"
          type="checkbox"
          v-bind="{ id, name, disabled, checked: toggled, required }"
        >
      </div>
    </div>
    <label
      v-if="$slots.default"
      :for="id"
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
     * Used to determine if the switch is toggled
     */
    value: {
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
  },
  computed: {
    id() {
      return uniqueId(this.name, this.value, 'chec-switch')();
    },
  },
  methods: {
    handleToggle() {
      this.$emit('input', !this.toggled);
    },
  },
};
</script>

<style scoped lang="scss">
  .chec-switch {
    @apply relative w-auto flex items-center cursor-pointer;

    &__container {
      @apply relative flex items-center w-10 h-5 rounded-full bg-gray-300 p-px;
    }

    &__thumb {
      @apply relative w-4 h-4 rounded-full bg-white mx-px cursor-pointer transition-all duration-300 ease-in-out;
    }

    &__label {
      @apply relative pl-2 cursor-pointer;
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
  }
</style>

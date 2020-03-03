<template>
  <div class="alert" :class="classObject">
    <div class="alert__content-container">
      <!--
      @slot You many pass child elements as necessary, e.g. tags, icons, images, etc.
      -->
      <span class="alert__text">
        <slot>
        </slot>
      </span>
    </div>
    <button type="button" class="alert__close-icon">
      <SvgCloseIcon @click="onClose" />
    </button>
  </div>
</template>
<script>
import SvgCloseIcon from '../assets/svgs/close-icon.svg';

export default {
  name: 'BaseAlert',
  components: {
    SvgCloseIcon,
  },
  props: {
    /**
     * The style variant for the alert. One of "success", "error", "warning", "info". Default is "info"
     */
    variant: {
      type: String,
      default: 'info',
      validator(value) {
        return ['success', 'error', 'warning', 'info'].includes(value);
      },
    },
  },
  computed: {
    classObject() {
      return `alert--${this.variant || 'success'}`;
    },
  },
  methods: {
    onClose($event) {
      /**
       * Emitted when the 'close' icon is clicked.
       * @event close
       * @type {$event}
       */
      this.$emit('close', $event);
    },
  },
};
</script>
<style lang="scss" scoped>
.alert {
  @apply flex font-lato justify-between items-center bg-gray-200 p-4 w-full;
  &__content-container {
    @apply flex flex-grow items-center;
  }
  &__text {
    @apply flex-grow font-normal text-white text-sm text-center;
  }
  &__close-icon {
    @apply ml-4 p-2 bg-transparent rounded-sm text-white cursor-pointer outline-none;
    > svg {
      @apply h-4 w-4;
    }
  }
  &--success {
    @apply bg-green-500 border border-green-400;
  }
  &--error {
    @apply bg-red-500 border border-red-400;
  }
  &--warning {
    @apply bg-orange-500 border border-orange-400;
  }
  &--info {
    @apply bg-purple-500 border border-purple-400;
  }
}
</style>

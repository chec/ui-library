<template>
  <div class="alert" :class="classObject">
    <div class="alert__content-container">
      <!--
      @slot You many pass child elements as necessary, e.g. tags, icons, images, etc.
      -->
      <slot>
        <p v-if="alertText" class="alert__text">
          {{alertText}}
        </p>
      </slot>
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
     * The text to alert.
     */
    alertText: {
      type: String,
      required: true,
    },
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
      return `alert--${this.variant}`;
    },
  },
  methods: {
    onClose($event) {
      /**
       * Emitted when the 'close' icon is clicked.
       * @event close-alert
       * @type {$event}
       */
      this.$emit('close-alert', $event);
    },
  },
};
</script>
<style lang="scss" scoped>
.alert {
  @apply flex font-lato justify-between items-center bg-gray-200 rounded-md p-4;
  &__content-container {
    @apply flex items-center;
  }
  &__text {
    @apply font-bold text-primary-blue text-sm;
  }
  &__close-icon {
    @apply ml-4 p-2 bg-green-600 rounded-sm text-white cursor-pointer;
    > svg {
      @apply h-4 w-4;
    }
  }
  &--success {
    @apply bg-green-100 border border-green-400;
    .alert__text {
      @apply text-green-600;
    }
    .alert__close-icon {
      @apply bg-green-500;
    }
  }
  &--error {
    @apply bg-red-100 border border-red-400;
    .alert__text {
      @apply text-red-600;
    }
    .alert__close-icon {
      @apply bg-red-500;
    }
  }
  &--warning {
    @apply bg-orange-100 border border-orange-400;
    .alert__text {
      @apply text-orange-600;
    }
    .alert__close-icon {
      @apply bg-orange-500;
    }
  }
  &--info {
    @apply bg-purple-100 border border-purple-400;
    .alert__text {
      @apply text-purple-600;
    }
    .alert__close-icon {
      @apply bg-purple-500;
    }
  }
}
</style>

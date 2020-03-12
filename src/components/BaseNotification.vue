<template>
  <div class="notif" :class="classObject">
    <div class="notif__content-container">
      <!--
      @slot You many pass child elements as necessary, e.g. tags, icons, images, etc.
      -->
      <span class="notif__text">
        <slot>
        </slot>
      </span>
    </div>
    <button type="button" class="notif__close-icon">
      <SvgCloseIcon @click="onClose" />
    </button>
  </div>
</template>
<script>
import SvgCloseIcon from '../assets/svgs/close-icon.svg';

export default {
  name: 'BaseNotification',
  components: {
    SvgCloseIcon,
  },
  props: {
    /**
     * The style variant for the notification. One of "success", "error", "warning", "info". Default is "info"
     */
    variant: {
      type: String,
      default: 'info',
      validator(value) {
        return ['success', 'error', 'warning', 'info'].includes(value);
      },
    },
    /**
     * Whether the notification should automatically disappear after a certain period of time (`hideTime`)
     */
    autoHide: {
      type: Boolean,
      default: true,
    },
    /**
     * The time in milliseconds after which a notification will disappear, if `autoHide` is true
     */
    hideTime: {
      type: Number,
      default: 3000, // milliseconds
    },
  },
  computed: {
    classObject() {
      return `notif--${this.variant}`;
    },
  },
  mounted() {
    if (this.autoHide) {
      this.registerHideTimer();
    }
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
    registerHideTimer($event) {
      window.setTimeout(() => {
        /**
         * Emitted when the notification should be automatically hidden, and the timer expires
         * @event close
         * @type {$event}
         */
        this.$emit('close', $event);
      }, this.hideTime);
    },
  },
};
</script>
<style lang="scss" scoped>
.notif {
  @apply flex justify-between items-start bg-gray-200 rounded-md p-4;
  &__content-container {
    @apply flex items-center;

  }
  &__text {
    @apply font-bold text-primary-blue text-sm;
  }
  &__close-icon {
    @apply ml-4 p-2 bg-green-600 rounded text-white cursor-pointer;
    > svg {
      @apply h-4 w-4;
    }
  }
  &--success {
    @apply bg-green-100 border border-green-400;
    .notif__text {
      @apply text-green-600;
    }
    .notif__close-icon {
      @apply bg-green-500;
    }
  }
  &--error {
    @apply bg-red-100 border border-red-400;
    .notif__text {
      @apply text-red-600;
    }
    .notif__close-icon {
      @apply bg-red-500;
    }
  }
  &--warning {
    @apply bg-orange-100 border border-orange-400;
    .notif__text {
      @apply text-orange-600;
    }
    .notif__close-icon {
      @apply bg-orange-500;
    }
  }
  &--info {
    @apply bg-purple-100 border border-purple-400;
    .notif__text {
      @apply text-purple-600;
    }
    .notif__close-icon {
      @apply bg-purple-500;
    }
  }
}
</style>

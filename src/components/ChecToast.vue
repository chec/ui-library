<template>
  <div class="notif" :class="classObject">
    <div class="notif__content-container">
      <div class="notif__icon">
        <span class="notif__icon-circle">
          <ChecIcon
            :icon="icon"
            class="w-4"
            color="white"
          />
        </span>
      </div>
      <!--
        @slot You many pass child elements as necessary, e.g. tags, icons, images, etc.
      -->
      <span class="notif__text">
        <slot />
      </span>
    </div>
    <button type="button" class="notif__close-icon" @click="onClose">
      <SvgCloseIcon />
    </button>
  </div>
</template>

<script>
import SvgCloseIcon from '../assets/svgs/close-icon.svg';
import ChecIcon from './ChecIcon.vue';

export default {
  name: 'ChecToast',
  components: {
    SvgCloseIcon,
    ChecIcon,
  },
  props: {
    /**
     * The style variant for the notification. One of "success", "error", "warning", "info". Default is "info"
     */
    variant: {
      type: String,
      default: 'success',
      validator(value) {
        return ['success', 'error', 'warning', 'info'].includes(value);
      },
    },
    /**
     * Whether the notification should not automatically disappear after a certain period of time (`hideTime`)
     */
    persist: Boolean,
    /**
     * The time in milliseconds after which a notification will disappear, if `persist` is true
     */
    hideTime: {
      type: Number,
      default: 5000, // milliseconds
    },
  },
  computed: {
    classObject() {
      return `notif--${this.variant}`;
    },
    icon() {
      const icons = {
        success: 'check',
        error: 'close',
        warning: 'exclamation',
        info: 'info',
      };

      return icons[this.variant];
    },
  },
  mounted() {
    if (!this.persist) {
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
  @apply flex justify-between items-start rounded bg-gray-200 shadow-md;
  min-width: 7.25rem;

  &__content-container {
    @apply flex max-w-full py-4;

  }

  &__icon {
    @apply flex items-start px-3;
  }

  &__icon-circle {
    @apply bg-blue-500 p-2 rounded-full;
  }

  &__text {
    @apply text-primary-blue text-left text-sm max-w-full my-auto;
    overflow-wrap: anywhere;

    .button {
      @apply mt-3 -ml-1;
    }
  }

  &__close-icon {
    @apply bg-green-600 rounded text-white outline-none cursor-pointer mr-2 mt-4 p-2;
    transition: all 0.3s ease;

    > svg {
      @apply h-4 w-4;
    }
  }

  &--success {
    @apply bg-green-500;

    .notif__text {
      @apply text-white;
    }

    .notif__icon-circle {
      @apply bg-green-400;
    }

    .notif__close-icon {
      @apply text-white bg-transparent transition-all ease-in-out duration-300;

      &:hover,
      &:active,
      &:focus {
        @apply opacity-50 bg-green-600 outline-none;
      }
    }
  }

  &--error {
    @apply bg-red-500;

    .notif__text {
      @apply text-white;
    }

    .notif__icon-circle {
      @apply bg-red-400;
    }

    .notif__close-icon {
      @apply text-white bg-transparent transition-all ease-in-out duration-300;

      &:hover,
      &:active,
      &:focus {
        @apply opacity-50 bg-red-600 outline-none;
      }
    }
  }

  &--warning {
    @apply bg-orange-500;

    .notif__text {
      @apply text-white;
    }

    .notif__icon-circle {
      @apply bg-orange-400;
    }

    .notif__close-icon {
      @apply text-white bg-transparent transition-all ease-in-out duration-300;

      &:hover,
      &:active,
      &:focus {
        @apply opacity-50 bg-orange-600 outline-none;
      }
    }
  }

  &--info {
    @apply bg-blue-500;

    .notif__text {
      @apply text-white;
    }

    .notif__icon-circle {
      @apply bg-blue-400;
    }

    .notif__close-icon {
      @apply text-white bg-transparent transition-all ease-in-out duration-300;

      &:hover,
      &:active,
      &:focus {
        @apply opacity-50 bg-blue-600 outline-none;
      }
    }
  }
}
</style>

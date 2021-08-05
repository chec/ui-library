<template>
  <transition name="fade">
    <div class="alert" :class="classObject">
      <div class="alert__content-container">
        <!--
          @slot You many pass child elements as necessary, e.g. tags, icons, images, etc.
        -->
        <span class="alert__text">
          <ChecIcon v-if="showIcon" :icon="icon" />
          <slot />
        </span>
      </div>
      <button v-if="!disableClose" type="button" class="alert__close-icon">
        <SvgCloseIcon @click="onClose" />
      </button>
    </div>
  </transition>
</template>

<script>
import ChecIcon from './ChecIcon.vue';
import SvgCloseIcon from '../assets/svgs/close-icon.svg';

export default {
  name: 'ChecAlert',
  components: {
    SvgCloseIcon,
    ChecIcon,
  },
  props: {
    /**
     * The style variant for the alert. One of "success", "error",
     * "warning", "info", "message", "news". Default is "success"
     */
    variant: {
      type: String,
      default: 'success',
      validator(value) {
        return ['success', 'error', 'warning', 'info', 'message', 'news'].includes(value);
      },
    },
    /**
     * Enable Inline version.
     */
    inline: Boolean,
    /**
     * Disable close button.
     */
    disableClose: Boolean,
    /**
     * Show the alert icon.
     */
    showIcon: Boolean,
  },
  computed: {
    classObject() {
      return [`alert--${this.variant}`, {
        'alert--inline': this.inline,
        'alert--icon': this.icon,
      }];
    },
    icon() {
      if (this.variant === 'success') {
        return 'check-square';
      }
      if (this.variant === 'error') {
        return 'close-square';
      }
      if (this.variant === 'warning') {
        return 'exclamation-square';
      }
      if (this.variant === 'info') {
        return 'info-square';
      }
      return 'info-square';
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

<style lang="scss">
@use 'sass:map';

$alert-colors: (
  'success': 'green-500',
  'error': 'red-500',
  'warning': 'orange-500',
  'info': 'blue-500',
  'message': 'gray-600',
  'news': 'purple-500',
);

$alert-inline-colors: (
  'success': (
    'background': 'green',
    'border': 'green-400',
  ),
  'error': (
    'background': 'red',
    'border': 'red-400',
  ),
  'warning': (
    'background': 'orange',
    'border': 'orange-400',
  ),
  'info': (
    'background': 'blue',
    'border': 'blue-500',
  ),
  'message': (
    'background': 'gray',
    'border': 'gray-400',
  ),
  'news': (
    'background': 'purple',
    'border': 'purple-300',
  ),
);

.alert {
  @apply flex font-lato justify-between items-center bg-gray-200 py-4 px-4 w-full  z-20;

  &__content-container {
    @apply flex flex-grow items-center;
  }

  &__text {
    @apply flex-grow font-normal text-white text-sm text-center items-center;

    > svg {
      @apply inline h-4 w-4 relative;
      top: -1px;
    }

    a {
      @apply text-white font-bold;

      &:hover,
      &:focus,
      &:active {
        @apply text-white font-bold underline;
      }
    }
  }

  &__close-icon {
    @apply ml-4 -my-8 p-2 bg-transparent rounded text-white cursor-pointer outline-none;

    > svg {
      @apply h-4 w-4;
    }
  }
  @each $name, $color in $alert-colors {
    &--#{$name} {
      @apply bg-#{$color} border border-#{$color};
    }
  }

  &--inline {
    @apply rounded;

    .alert__close-icon {
      @apply text-gray-600;
    }

    .alert__text {
      @apply text-gray-600 text-left flex items-start leading-normal;

      > svg {
        @apply h-3 w-3 mr-2;

        // "Magic". I'm not sure why .5rem isn't right here, but it looks strange as 0.5rem. Also `items-baseline` is
        // off by 1px too, and margin doesn't fix it. :shrug:
        margin-top: 0.4rem;
      }

      a:not(.button) {
        @apply text-gray-600;

        &:hover,
        &:focus,
        &:active {
          @apply text-gray-600 font-bold;
        }
      }
    }
    @each $name, $color in $alert-inline-colors {
      &.alert--#{$name} {
        @apply bg-#{map.get($color, 'background')}-100 border-#{map.get($color, 'border')};

        .alert__text {
          > svg {
            @apply text-#{map.get($color, 'background')}-500;
          }
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-500 ease-in-out;
}

.fade-enter,
.fade-leave-to {
  @apply opacity-0;
}
</style>

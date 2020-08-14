<template>
  <div class="loading" :class="classObject">
    <svg
      viewBox="0 0 32 32"
      fill="none"
      class="loading__animation"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28C22.6274 28 28 22.6274 28 16C28
        9.37258 22.6274 4 16 4ZM0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366
        24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
        class="loading__spinner-background"
      />
      <ellipse
        rx="14"
        ry="14"
        stroke-width="4"
        stroke-dashoffset="100"
        stroke-dasharray="100"
        transform="translate(16,16)"
        class="loading__animation-spinner"
      />
    </svg>
    <div v-if="message" class="loading__message">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChecLoading',
  props: {
    message: {
      type: String,
      default: '',
    },
    variant: {
      type: String,
      default: 'default',
      validator: function validator(value) {
        return ['dark', 'light', 'default'].includes(value);
      },
    },
    withoutBackground: Boolean,
  },
  computed: {
    classObject() {
      return [
        this.withoutBackground ? 'loading--without-background' : 'loading--with-background',
        this.variant !== 'default' ? `loading--${this.variant}` : '',
      ];
    },
  },
};
</script>

<style scoped lang="scss">
.loading {
  @apply absolute top-0 left-0 w-full h-full z-50 flex justify-center items-center flex-col;
  border-radius: inherit;

  &__animation {
    @apply w-8;
  }

  &__spinner-background {
    @apply text-gray-200 fill-current;
  }

  &__animation-spinner {
    @apply text-gray-500 stroke-current;
    animation: 2.4s linear infinite both a0_do, 2.4s linear infinite both a0_t;
  }

  &__message {
    @apply caps-xs mt-2;
  }

  &--without-background {
    @apply bg-transparent;
  }

  &--with-background {
    background: rgba(255, 255, 255, 0.9);

    &.loading--dark,
    &.loading--light {
      background: rgba(113, 135, 165, 0.9);
    }
  }

  &--dark {
    .loading__spinner-background {
      @apply fill-current text-gray-600;
    }

    .loading__animation-spinner {
      @apply stroke-current text-white;
    }
  }

  &--light {
    .loading__animation-spinner {
      @apply stroke-current text-white;
    }

    .loading__spinner-background {
      @apply fill-current text-gray-500;
    }
  }
}

// Loading animations
@keyframes a0_t {
  0% {
    transform: translate(16px, 16px) rotate(-360deg);
  }

  100% {
    transform: translate(16px, 16px) rotate(0deg);
  }
}

@keyframes a0_do {
  0% {
    animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    stroke-dashoffset: 500;
  }

  25% {
    animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    stroke-dashoffset: 400;
  }

  50% {
    animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    stroke-dashoffset: 300;
  }

  75% {
    animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    stroke-dashoffset: 200;
  }

  100% {
    stroke-dashoffset: 100;
  }
}
</style>

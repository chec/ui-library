<template>
  <div class="chec-file-row" :class="{ 'chec-file-row--error': hasError }">
    <div class="chec-file-row__left">
      <svg
        v-if="loading"
        class="loading-animation"
        viewBox="0 0 17 16"
        fill="none"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8.05029 2C4.73658 2
          2.05029 4.68629 2.05029
          8C2.05029 11.3137 4.73658
          14 8.05029 14C11.364 14
          14.0503 11.3137 14.0503 8C14.0503
          4.68629 11.364 2 8.05029 2ZM0.050293
          8C0.050293 3.58172 3.63202 0 8.05029
          0C12.4686 0 16.0503 3.58172 16.0503
          8C16.0503 12.4183 12.4686 16 8.05029
          16C3.63202 16 0.050293 12.4183 0.050293 8Z"
          fill="#283341"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8.05029 2C4.73658 2 2.05029 4.68629 2.05029
          8H0.050293C0.050293 3.58172 3.63202 0 8.05029 0V2Z"
          fill="white"
        />
      </svg>
      <div v-else class="chec-file-row__icon">
        <ChecIcon
          v-if="hasError"
          icon="close"
        />
        <ChecIcon
          v-else
          icon="check"
        />
      </div>
      <p class="chec-file-row__label">
        {{ file.upload && file.upload.filename || '--' }}
      </p>
    </div>
    <div class="chec-file-row__right">
      <p v-if="!hasError" class="chec-file-row__type">
        {{ file.type }}
      </p>
      <p v-if="!hasError" class="chec-file-row__size">
        {{ size }}MB
      </p>
      <button class="chec-file-row__remove-button" @click="() => $emit('remove-file')">
        <ChecIcon
          icon="close"
        />
      </button>
    </div>
  </div>
</template>

<script>
import ChecIcon from '../ChecIcon';

export default {
  name: 'FileRow',
  components: {
    ChecIcon,
  },
  props: {
    loading: {
      type: Boolean,
    },
    error: {
      type: Boolean,
    },
    file: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    hasError() {
      if (this.error || this.file.status === 'error') {
        return true;
      }
      return false;
    },
    size() {
      return ((this.file.size || 0) / 1000000).toFixed(2);
    },
  },
};
</script>

<style lang="scss">
.chec-file-row {
  @apply flex justify-between w-full p-4 rounded bg-gray-500;

  .loading-animation {
    @apply animate-spin mr-1 h-5 w-5;
  }

  &__left {
    @apply flex items-center;
  }

  &__right {
    @apply flex items-center justify-end;
  }

  &__icon {
    @apply w-5 h-5 p-1 mr-1 text-white;
  }

  &__remove-button {
    @apply w-4 h-4 mr-1 bg-gray-100 text-gray-500 rounded-full;

    &:focus,
    :hover {
      @apply opacity-75 outline-none;
    }
  }

  &__label {
    @apply text-white text-xs;
  }

  &__type {
    @apply text-white text-xxs uppercase mr-1;
    letter-spacing: 1px;
  }

  &__size {
    @apply text-white text-xxs uppercase mr-1;
    letter-spacing: 1px;
  }

  &--error {
    @apply bg-gray-100 border border-gray-300 text-red-600;

    .chec-file-row {
      &__icon {
        @apply text-red-600;
      }

      &__label {
        @apply text-red-600;
      }

      &__remove-button {
        @apply bg-red-500 text-white;
      }
    }
  }
}
</style>

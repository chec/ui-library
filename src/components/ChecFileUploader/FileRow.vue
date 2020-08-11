<template>
  <div class="chec-file-row" :class="{ 'chec-file-row--error': error }">
    <div class="chec-file-row__left">
      <div v-if="loading" class="chec-file-row__loading-icon">
        <ChecLoading />
      </div>
      <div v-else class="chec-file-row__icon">
        <ChecIcon
          v-if="error"
          icon="close"
        />
        <ChecIcon
          v-else
          icon="check"
        />
      </div>
      <p class="chec-file-row__label">
        {{ fileName || '--' }}
      </p>
    </div>
    <div class="chec-file-row__right">
      <p v-if="!error" class="chec-file-row__type">
        {{ mimeType }}
      </p>
      <p v-if="!error" class="chec-file-row__size">
        {{ size }}
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
import filesize from 'filesize';
import ChecIcon from '../ChecIcon';
import ChecLoading from '../ChecLoading';

export default {
  name: 'FileRow',
  components: {
    ChecIcon,
    ChecLoading,
  },
  props: {
    loading: {
      type: Boolean,
    },
    error: {
      type: Boolean,
    },
    fileName: {
      type: String,
      default: '',
    },
    mimeType: {
      type: String,
      default: '',
    },
    fileSize: {
      type: String,
      default: '',
    },
  },
  computed: {
    size() {
      return filesize(this.fileSize);
    },
  },
};
</script>

<style lang="scss">
.chec-file-row {
  @apply flex justify-between w-full p-4 rounded bg-gray-500;

  &__loading-icon {
    @apply relative mr-1 h-5 w-5;
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
    @apply text-white caps-xxs mr-1;
    letter-spacing: 1px;
  }

  &__size {
    @apply text-white caps-xxs mr-1;
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

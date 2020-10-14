<template>
  <div class="chec-file-row" :class="{ 'chec-file-row--error': error }">
    <div class="chec-file-row__left">
      <div v-if="loading && !error" class="chec-file-row__loading-icon">
        <ChecLoading without-background variant="dark" />
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
      <p v-if="!error" class="chec-file-row__label">
        {{ fileName || '--' }}
      </p>
      <p v-else class="chec-file-row__label">
        {{ `${fileName || '' } - ${errorMessage || 'Failed' }` }}
      </p>
    </div>
    <div class="chec-file-row__right">
      <p v-if="loading" class="chec-file-row__progress">
        {{ progressPercent }}
      </p>
      <template v-else>
        <p v-if="!error" class="chec-file-row__type">
          {{ mimeType }}
        </p>
        <p v-if="!error" class="chec-file-row__size">
          {{ size }}
        </p>
      </template>
      <button
        v-if="!loading"
        type="button"
        class="chec-file-row__remove-button"
        :title="$t('fileManager.deleteFile')"
        @click="() => $emit('remove')"
      >
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
    /**
     * The uploading progress percentage
     */
    progress: {
      type: Number,
      default: 0,
    },
    /**
     * Boolean to indicate a loading state
     */
    loading: Boolean,
    /**
     * Boolean to render the error state
     */
    error: Boolean,
    /**
     * Optional error message
     */
    errorMessage: String,
    /**
     * The name of the file
     */
    fileName: {
      type: String,
      default: '',
    },
    /**
     * The file's media type
     */
    mimeType: {
      type: String,
      default: '',
    },
    /**
     * The file's size, rendered as human readable file size string using the npm lib. filesize
     */
    fileSize: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    size() {
      return filesize(this.fileSize);
    },
    progressPercent() {
      return `${(this.progress).toFixed()}%`;
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
    @apply text-white caps-xxs mr-4;
    letter-spacing: 1px;
  }

  &__size,
  &__progress {
    @apply text-white caps-xxs mr-4;
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

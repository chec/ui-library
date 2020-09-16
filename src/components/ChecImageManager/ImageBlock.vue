<template>
  <div
    :style="{ backgroundImage: `url('${thumbnail}')` }"
    class="chec-image-item"
    :class="{ 'chec-image-item--error': error }"
  >
    <div class="chec-image-item__index">
      {{ index + 1 }}
    </div>
    <div v-if="!thumbnail" class="chec-image-item__no-thumbnail">
      <ChecIcon
        icon="chec"
      />
    </div>
    <div v-if="loading && !error" class="chec-image-item__loading-icon">
      <div class="chec-image-item__progress">
        <ChecLoading without-background variant="dark" />
        <p class="chec-image-item__percentage">
          {{ progressPercent }}
        </p>
      </div>
    </div>
    <div v-if="error" class="chec-image-item__label space-y-2">
      <ChecIcon
        size="base"
        icon="exclamation-square"
      />
      <p>{{ `${errorMessage || 'Failed' }` }}</p>
    </div>
    <div
      class="chec-image-item__actions"
      @click="() => $emit('click-image')"
    >
      <div class="chec-image-item__drag">
        <ChecIcon
          icon="drag"
        />
      </div>
      <button class="chec-image-item__remove-button" @click="() => $emit('remove-file')">
        <ChecIcon
          icon="trash"
        />
      </button>
    </div>
  </div>
</template>

<script>
import ChecIcon from '../ChecIcon';
import ChecLoading from '../ChecLoading';

export default {
  name: 'ImageItem',
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
    thumbnail: {
      type: String,
    },
    index: {
      type: Number,
    },
  },
  computed: {
    progressPercent() {
      return `${(this.progress).toFixed()}%`;
    },
  },
};
</script>

<style lang="scss">
.chec-image-item {
  @apply flex relative justify-between p-4 rounded
    bg-white bg-cover shadow-sm;

  &__index {
    @apply w-4 h-4 absolute text-white text-xxs font-bold
      text-center rounded-full bg-overlay-gray z-10;
    left: -0.25rem;
    top: -0.25rem;
  }

  &__loading-icon {
    @apply absolute inset-0 bg-overlay-gray rounded-sm
      flex flex-col items-center content-center justify-center;
  }

  &__no-thumbnail {
    @apply absolute inset-0 flex items-center justify-center text-gray-200;

    svg {
      @apply w-1/2;
    }
  }

  &__percentage {
    @apply mt-16;
  }

  &__actions {
    @apply absolute invisible opacity-0 inset-0 bg-overlay-gray rounded-sm;
  }

  &__icon {
    @apply w-5 h-5 p-1 mr-1 text-white;
  }

  &__drag {
    @apply absolute inset-0 m-auto text-center
      w-4 h-4 text-white cursor-pointer;
  }

  &__remove-button {
    @apply absolute top-0 right-0 w-4 h-4 m-2
      text-white;

    &:focus,
    :hover {
      @apply opacity-75 outline-none;
    }
  }

  &__label {
    @apply flex flex-col items-center content-center justify-center absolute inset-0
      text-white text-xxs font-bold uppercase bg-overlay-white rounded-sm text-gray-400;
  }

  &__progress {
    @apply text-white caps-xxs text-center;
    letter-spacing: 1px;
  }

  &--error {
    @apply bg-gray-100 border border-gray-300 text-red-600;

    .chec-image-item {
      &__icon {
        @apply text-red-600;
      }

      &__label {
        @apply text-red-600;
      }
    }
  }

  &:first-of-type {
    @apply col-span-2 row-span-2;
  }

  &::before {
    @apply inline-block align-top;
    content: '';
    padding-bottom: 100%;
  }

  &:hover {
    .chec-image-item__actions {
      @apply transition-opacity opacity-100 visible duration-300;
    }
  }
}
</style>

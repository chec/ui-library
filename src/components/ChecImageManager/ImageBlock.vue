<template>
  <div
    class="chec-image-item"
    :class="{ 'chec-image-item--error': error, 'chec-image-item--loading': loading && !error }"
  >
    <div class="chec-image-item__index">
      {{ index }}
    </div>
    <div
      class="chec-image-item__thumbnail"
      :class="{ 'chec-image-item__thumbnail--placeholder': !thumbnail }"
    >
      <img v-if="thumbnail" :src="thumbnail">
      <ChecIcon v-else icon="chec" />
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
      @click="handleClick"
    >
      <div v-if="!loading && !error" class="chec-image-item__drag">
        <ChecIcon
          icon="drag"
        />
      </div>
      <template v-if="!loading">
        <ChecButton
          v-if="allOptions.length === 1"
          :title="$t('imageManager.deleteImage')"
          type="button"
          text-only
          variant="small"
          icon="trash"
          class="chec-image-item__action-button"
          @click.stop="handleRemove"
        />
        <ChecOptionsMenu
          v-else
          invert
          class="chec-image-item__action-button"
        >
          <ChecOption
            v-for="{ name, key, destructive } in allOptions"
            :key="key"
            :destructive="destructive"
            @option-selected="(event) => emitOptionClick(key, event)"
          >
            {{ name }}
          </ChecOption>
        </ChecOptionsMenu>
      </template>
    </div>
  </div>
</template>

<script>
import ChecIcon from '../ChecIcon';
import ChecLoading from '../ChecLoading';
import ChecOptionsMenu from '../ChecOptionsMenu';
import ChecOption from '../ChecOption';
import ChecButton from '../ChecButton';

export default {
  name: 'ImageItem',
  components: {
    ChecButton,
    ChecOption,
    ChecOptionsMenu,
    ChecIcon,
    ChecLoading,
  },
  props: {
    /**
     * Boolean to render the error state
     */
    error: Boolean,
    /**
     * Optional error message
     */
    errorMessage: {
      type: String,
      default: null,
    },
    imageOptions: {
      type: Array,
      default: () => [],
    },
    /**
     * The number that this image appears in the order of all image
     */
    index: {
      type: Number,
      required: true,
    },
    /**
     * Boolean to indicate a loading state
     */
    loading: Boolean,
    /**
     * The uploading progress percentage
     */
    progress: {
      type: Number,
      default: 0,
    },
    /**
     * A string that is a valid value for the `src` prop of an image tag
     */
    thumbnail: {
      type: String,
      default: null,
    },
  },
  computed: {
    allOptions() {
      return [
        ...this.imageOptions,
        {
          name: this.$t('imageManager.deleteImage'),
          key: 'remove',
          destructive: true,
        },
      ];
    },
    progressPercent() {
      return `${(this.progress).toFixed()}%`;
    },
  },
  methods: {
    emitOptionClick(option, event) {
      if (option === 'remove') {
        this.handleRemove(event);
        return;
      }
      this.$emit('option-selected', option, event);
    },
    handleClick(event) {
      /**
       * Triggered when this element is clicked
       * @type {Event}
       */
      this.$emit('click', event);
    },
    handleRemove(event) {
      /**
       * Triggered when the user clicks the delete button on this block
       * @type {Event}
       */
      this.$emit('remove', event);
    },
  },
};
</script>

<style lang="scss">
.chec-image-item {
  @apply flex relative justify-between p-4 rounded bg-white shadow-sm;

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

  &__thumbnail {
    @apply absolute inset-0 flex items-center justify-center text-gray-200 bg-cover overflow-hidden;

    img {
      @apply w-full h-full object-contain;
    }

    &--placeholder {
      svg {
        @apply w-1/2;
      }
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
      w-4 h-4 text-white;
  }

  &__action-button {
    @apply absolute top-0 right-0 text-white;

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

    &.sortable-drag .chec-image-item__thumbnail {
      @apply w-1/2;
      height: 50%;
    }
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

  &.sortable-drag {
    @apply transition-none bg-transparent shadow-none;

    .chec-image-item {
      &__actions,
      &__index {
        @apply hidden;
      }

      &__thumbnail {
        @apply opacity-50;
      }
    }
  }

  &.sortable-ghost {
    @apply bg-gray-300 rounded-lg shadow-none;

    .chec-image-item__thumbnail > * {
      @apply hidden;
    }
  }
}
</style>

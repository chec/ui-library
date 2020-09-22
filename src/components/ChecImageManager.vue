<template>
  <div class="chec-image-manager">
    <div class="chec-image-manager__inner">
      <Draggable
        v-if="files.length"
        class="image-rows-container"
        :class="{ 'image-rows-container--dragging': dragging }"
        :value="files"
        @input="reorder"
        @click.stop
        @start="dragging = true"
        @end="dragging = false"
      >
        <ImageBlock
          v-for="(file, index) in files"
          :key="file.upload.uuid"
          :index="index + 1"
          :error="file.status === 'error'"
          :loading="file.upload.progress !== null && file.upload.progress < 100"
          :thumbnail="file.thumb"
          :thing="file.test"
          :progress="file.upload.progress"
          @remove="() => handleRemovingFile(file)"
        />
      </Draggable>
      <ChecButton data-dropzone-clickable @click.stop>
        <ChecIcon class="chec-image-manager__icon" icon="image" size="base" /> {{ $t('imageManager.chooseImages') }}
      </ChecButton>
      <div v-if="footnote" class="chec-image-manager__helper">
        {{ footnote }}
      </div>
      <input class="chec-image-manager__input" type="file" name="file">
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import dropzone from '../mixins/dropzone.js';
import ChecButton from './ChecButton';
import ChecIcon from './ChecIcon';
import ImageBlock from './ChecImageManager/ImageBlock.vue';

export default {
  name: 'ChecImageManager',
  components: {
    ChecButton,
    ChecIcon,
    Draggable,
    ImageBlock,
  },
  mixins: [dropzone],
  props: {
    /**
     * The files that will be rendered as <file-row> components
     */
    files: {
      type: Array,
      default: () => [],
    },
    footnote: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      dragging: false,
    };
  },
  methods: {
    reorder(newFiles) {
      /**
       * Triggered when the user finishes moving an item. Provides the existing files in the new order
       * @type {Event}
       */
      this.$emit('reorder', newFiles);
    },
  },
};
</script>

<style lang="scss">
.chec-image-manager {
  @apply relative flex flex-col w-full h-auto flex rounded shadow-inner bg-gray-gradient flex justify-center;

  &__inner {
    @apply relative border border-dashed border-gray-400 rounded m-2 p-8;
  }

  .button {
    @apply mx-auto;
  }

  &__input {
    display: none;
  }

  &__helper {
    @apply text-gray-400 caps-xxs text-center mt-4;
  }

  &__icon {
    @apply inline relative;
    top: -1px;
  }
}

.image-rows-container {
  @apply grid grid-cols-4 gap-4 mb-4;

  > * {
    cursor: grab;
  }

  &--dragging {
    > * {
      cursor: grabbing;
    }

    .chec-image-item {
      &__actions {
        display: none;
      }

      &__index {
        @apply hidden;
      }
    }
  }
}

.dz-preview {
  @apply hidden;
}
</style>

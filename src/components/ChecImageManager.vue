<template>
  <div class="chec-image-manager">
    <div class="chec-image-manager__inner">
      <Draggable
        v-if="allFiles.length"
        class="image-rows-container"
        :class="classNames"
        :value="allFiles"
        filter=".chec-image-item--loading"
        @input="reorder"
        @click.stop
        @start="dragging = true"
        @end="dragging = false"
      >
        <ImageBlock
          v-for="(file, index) in allFiles"
          :key="file.upload.uuid"
          v-tooltip="file.name"
          :index="index + 1"
          :error="file.status === 'error'"
          :loading="['added', 'queued', 'uploading'].includes(file.status)"
          :thumbnail="file.thumb"
          :progress="file.upload.progress"
          @remove="() => removeFile(file)"
        />
      </Draggable>
      <template v-if="maxFiles === null || maxFiles > allFiles.length">
        <ChecButton
          @click="openDialog"
        >
          <ChecIcon class="chec-image-manager__icon" icon="image" size="base" /> {{ $t('imageManager.chooseImages') }}
        </ChecButton>
        <div v-if="footnote" class="chec-image-manager__helper">
          {{ footnote }}
        </div>
      </template>
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
     * Foot note to be displayed under the button. eg: PNG, JPG, & GIFS accepted.
     */
    footnote: {
      type: String,
      default: null,
    },
    /**
     * Number of columns to be displayed. either 2, 4 or 6.
     */
    columns: {
      type: Number,
      default: 4,
    },
    /**
     * Maximum amount of files accepted.
     */
    maxFiles: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      dragging: false,
    };
  },
  computed: {
    classNames() {
      const {
        dragging,
        columns,
      } = this;

      const classes = {
        [`image-rows-container--column-${columns}`]: columns !== '',
        'image-rows-container--dragging': dragging,
        'image-rows-container--max-files': this.maxFiles !== null && this.maxFiles <= this.allFiles.length,
      };

      return classes;
    },
  },
  methods: {
    /**
     * Set a new sort order for the files
     *
     * @param {array} newFiles
     */
    reorder(newFiles) {
      // Map the files that have been reordered (all files) back to the files in the format they were given in props
      this.handleFilesChange(newFiles
        .map((newFile) => this.files.find((candidate) => candidate.id === newFile.upload.uuid))
        .filter((file) => file !== undefined));
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
  @apply grid grid-cols-2 gap-4 mb-4;

  @media (min-width: 768px) {
    @apply grid-cols-4;
  }

  > * {
    cursor: grab;
  }

  &--max-files {
    @apply mb-0;
  }

  &--column-2 {
    @apply grid-cols-2;
  }

  &--column-6 {
    @apply grid-cols-6;
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

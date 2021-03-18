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
          :image-options="imageOptions"
          :index="index + 1"
          :error="file.status === 'error'"
          :loading="['added', 'queued', 'uploading'].includes(file.status)"
          :thumbnail="file.thumb"
          :progress="file.upload.progress"
          @remove="(event) => removeFile(file, event)"
          @click="(event) => handleClick(file, event)"
          @option-selected="(option, event) => handleOption(file, option, event)"
        />
      </Draggable>
      <template v-if="maxFiles === null || maxFiles > allFiles.length">
        <div class="chec-image-manager__actions space-x-4">
          <ChecButton
            icon="image"
            @click="openDialog"
          >
            {{ $t('imageManager.uploadImages') }}
          </ChecButton>
          <template v-if="availableImageGallery.length > 0">
            <div>{{ $t('imageManager.or') }}</div>
            <ChecButton
              icon="copy"
              @click="showGallery = true"
            >
              {{ linkExistingText || $t('imageManager.chooseExisting') }}
            </ChecButton>
          </template>
        </div>
        <div v-if="footnote" class="chec-image-manager__helper">
          {{ footnote }}
        </div>
      </template>
      <input class="chec-image-manager__input" type="file" name="file">
    </div>
    <GalleryModal
      v-if="showGallery"
      :images="availableImageGallery"
      @close="showGallery = false"
      @choose-images="addImages"
    />
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import dropzone from '../mixins/dropzone.js';
import ChecButton from './ChecButton';
import ImageBlock from './ChecImageManager/ImageBlock.vue';
import GalleryModal from './ChecImageManager/GalleryModal';

export default {
  name: 'ChecImageManager',
  components: {
    GalleryModal,
    ChecButton,
    Draggable,
    ImageBlock,
  },
  mixins: [dropzone],
  props: {
    /**
     * Number of columns to be displayed. either 2, 4 or 6.
     */
    columns: {
      type: Number,
      default: 4,
    },
    /**
     * Foot note to be displayed under the button. eg: PNG, JPG, & GIFS accepted.
     */
    footnote: {
      type: String,
      default: null,
    },
    /**
     * An array of existing images that can be chosen instead of uploading new ones
     */
    imageGallery: {
      type: Array,
      default: () => [],
    },
    /**
     * Extra options that should appear on each image (in an options menu). This should be provided as an array of
     * objects that has a "key", and a "name". Eg. { key: 'edit', name: 'Edit image metadata' }
     */
    imageOptions: {
      type: Array,
      default: () => [],
    },
    /**
     * Text to use in place of "Choose existing" when displaying a button to choose from the provided "image gallery"
     */
    linkExistingText: String,

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
      showGallery: false,
    };
  },
  computed: {
    /**
     * Take the provided list of images and filter out any that are already within the "value" of this field
     */
    availableImageGallery() {
      const existingIds = this.files.map(({ id }) => id);
      return this.imageGallery.filter(({ id }) => !existingIds.includes(id)).map(this.normaliseFile);
    },
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
    addImages(newImages) {
      // Find the actual file object for the images chosen
      const newIds = newImages.map(({ id }) => id);
      const newItems = this.imageGallery.filter((candidate) => newIds.includes(candidate.id));
      this.handleFilesChange(this.files.concat(newItems));
      this.showGallery = false;
    },
    handleClick(...args) {
      this.$emit('click-image', ...args);
    },
    handleOption(...args) {
      this.$emit('option-selected', ...args);
    },
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

  &__actions {
    @apply flex justify-center items-center font-bold;
  }

  &__input {
    @apply hidden;
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

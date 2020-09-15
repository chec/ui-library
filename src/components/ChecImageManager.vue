<template>
  <div class="chec-image-manager">
    <div class="chec-image-manager__inner" data-dropzone-clickable>
      <div v-if="files.length" class="image-rows-container" @click.stop>
        <ImageBlock
          v-for="(file, index) in files"
          :key="file.upload.uuid"
          :index="index"
          :error="file.status === 'error'"
          :loading="file.upload.progress !== null && file.upload.progress < 100"
          :thumbnail="file.thumb"
          :progress="file.upload.progress"
          @remove-file="() => handleRemovingFile(file)"
          @click-image="() => handleClick(file)"
        />
      </div>
      <ChecButton data-dropzone-clickable @click.stop>
        <ChecIcon class="chec-image-manager__icon" icon="image" size="base" /> Choose images(s)
      </ChecButton>
      <div class="chec-image-manager__helper">
        PNG, JPG, & GIFS accepted
      </div>
      <input class="chec-image-manager__input" type="file" name="file">
    </div>
  </div>
</template>

<script>
import Dropzone from 'dropzone';
import ChecButton from './ChecButton';
import ChecIcon from './ChecIcon';
import ImageBlock from './ChecImageManager/ImageBlock.vue';

Dropzone.autoDiscover = false;

export default {
  name: 'ChecImageManager',
  components: {
    ChecButton,
    ChecIcon,
    ImageBlock,
  },
  props: {
    /**
     * The files that will be rendered as <file-row> components
     */
    files: {
      type: Array,
      default: () => [],
    },
    /**
     * The endpoint to upload files to
     */
    endpoint: {
      type: String,
      default: '/',
    },
    /**
     * Accepted File Types, copmma seperated
     */
    fileTypes: {
      type: String,
      default: 'image/*',
    },
  },
  data() {
    return {
      inProgressFiles: [],
    };
  },
  mounted() {
    this.dropzone = new Dropzone(this.$el, {
      acceptedFiles: this.fileTypes,
      url: this.endpoint,
      createImageThumbnails: true,
      clickable: '[data-dropzone-clickable]',
      hiddenInputContainer: this.$el,
    });
    const vm = this;
    this.dropzone.on('complete', (file) => {
      vm.inProgressFiles = [
        ...vm.inProgressFiles,
        file,
      ];
      this.emitFileUploadingComplete(file);
    });
    this.dropzone.on('addedfile', (file) => {
      vm.inProgressFiles = [
        ...vm.inProgressFiles,
        file,
      ];
      this.emitFileAdded(file);
    });
    this.dropzone.on('uploadprogress', (file) => {
      vm.inProgressFiles = [
        ...vm.inProgressFiles,
        file,
      ];
      this.emitFileUploading(file);
    });
  },
  methods: {
    handleRemovingFile(file) {
      /**
       * Emitted when the file has been removed
       *
       * @event remove-file
       * @type {Object}
       */
      this.$emit('remove-file', this.getNonReactiveFileObject(file));
    },
    handleClick(file) {
      this.$emit('handle-click', this.getNonReactiveFileObject(file));
    },
    getNonReactiveFileObject(file) {
      return {
        upload: { ...file.upload },
        name: file.name,
        thumb: file.dataURL,
        size: file.size,
        type: file.type,
        status: file.status,
      };
    },
    emitFileUploading(file) {
      /**
       * Emitted when the file has begun uploading, derived from Dropzone.js' uploadprogress event
       *
       * @event file-uploading
       * @type {Object}
       */
      this.$emit('file-uploading', this.getNonReactiveFileObject(file));
    },
    emitFileAdded(file) {
      /**
       * Emitted when the file has been initially added, derived from Dropzone.js' addedfile event
       * @event file-added
       * @type {$event}
       */
      this.$emit('file-added', this.getNonReactiveFileObject(file));
    },
    emitFileUploadingComplete(file) {
      /**
       * Emitted when the file has completed uploading, derived from Dropzone.js' file-uploading-complete event
       * @event file-uploading-complete
       * @type {$event}
       */
      this.$emit('file-uploading-complete', this.getNonReactiveFileObject(file));
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
    @apply text-gray-400 uppercase text-center mt-4;
  }

  &__icon {
    @apply inline relative;
    top: -1px;
  }
}

.image-rows-container {
  @apply grid grid-cols-4 gap-4 mb-4;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.dz-preview {
  @apply hidden;
}
</style>

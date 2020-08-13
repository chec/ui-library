<template>
  <div class="chec-file-uploader">
    <div class="chec-file-uploader__inner" data-dropzone-clickable>
      <div v-if="files.length" class="file-rows-container space-y-2" @click.stop>
        <FileRow
          v-for="file in files"
          :key="file.upload.uuid"
          :error="file.status === 'error'"
          :loading="file.upload.progress !== null && file.upload.progress < 100"
          :file-name="file.name"
          :file-size="file.size"
          :mime-type="file.type"
          :progress="file.upload.progress"
          @remove-file="() => handleRemovingFile(file)"
        />
      </div>
      <ChecButton data-dropzone-clickable @click.stop>
        Choose file(s)
      </ChecButton>
      <input class="chec-file-uploader__input" type="file" name="file">
    </div>
  </div>
</template>

<script>
import Dropzone from 'dropzone';
import ChecButton from './ChecButton';
import FileRow from './ChecFileUploader/FileRow';

Dropzone.autoDiscover = false;

export default {
  name: 'ChecFileUploader',
  components: {
    ChecButton,
    FileRow,
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
  },
  data() {
    return {
      inProgressFiles: [],
    };
  },
  mounted() {
    this.dropzone = new Dropzone(this.$el, {
      url: this.endpoint,
      createImageThumbnails: false,
      previewsContainer: false,
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
    getNonReactiveFileObject(file) {
      return {
        upload: { ...file.upload }, name: file.name, size: file.size, type: file.type, status: file.status,
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
.chec-file-uploader {
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
}

.file-rows-container {
  @apply w-full flex flex-col mb-2;
}
</style>

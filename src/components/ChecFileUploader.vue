<template>
  <form method="post" enctype="multipart/form-data" class="chec-file-uploader">
    <div class="chec-file-uploader__inner" data-dropzone-clickable>
      <div v-if="files.length" class="file-rows-container space-y-2" @click.stop>
        <FileRow
          v-for="file in files"
          :key="file.upload.uuid"
          :error="file.status === 'error'"
          :loading="['added', 'queued', 'uploading'].includes(file.status)"
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
      <input class="chec-file-uploader__input" type="file">
    </div>
  </form>
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
     * The endpoint to upload files to. This can be provided as a string, or a promise that will resolve a URL given a
     * file object (provided by Dropzone). Note that this file object can be mutated to add a `formData` key.
     */
    endpoint: {
      type: [String, Function],
      default: '/',
    },
  },
  data() {
    return {
      inProgressFiles: [],
    };
  },
  mounted() {
    const { endpoint } = this;
    const vm = this;

    this.dropzone = new Dropzone(this.$el, {
      // Note that this option _can't_ be empty, even if you update the URL dynamically
      url: typeof this.endpoint === 'string' ? this.endpoint : '-',
      createImageThumbnails: false,
      previewsContainer: false,
      clickable: '[data-dropzone-clickable]',
      hiddenInputContainer: this.$el,
      // Allows asynchronous processing of added files for the purpose of "accepting" them as valid files
      accept(file, done) {
        if (typeof endpoint === 'function') {
          endpoint(file)
            .then((url) => {
              if (url && typeof url === 'string') {
                // Note that this is intended usage of the file object in Dropzone.
                // eslint-disable-next-line no-param-reassign
                file.uploadUrl = url;
              }
              done();
            })
            .catch((message) => done(message));
          return;
        }
        done();
      },
    });

    // Update the form data sent with the file - if some has been set on the file object
    this.dropzone.on('sending', (file, _, formData) => {
      if (typeof file.formData === 'object') {
        Object.entries(file.formData).forEach(([key, value]) => {
          formData.set(key, value);
        });
      }
    });

    // Update the URL for an individual file (See https://github.com/enyo/dropzone/wiki/Set-URL-dynamically)
    this.dropzone.on('processing', function processing(file) {
      if (file.uploadUrl) {
        this.options.url = file.uploadUrl;
      }
    });

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
       * @type {Object}
       */
      this.$emit('file-added', this.getNonReactiveFileObject(file));
    },
    emitFileUploadingComplete(file) {
      /**
       * Emitted when the file has completed uploading, derived from Dropzone.js' file-uploading-complete event
       * @event file-uploading-complete
       * @type {Object}
       */
      this.$emit('file-uploading-complete', this.getNonReactiveFileObject(file));
    },
  },
};
</script>

<style lang="scss">
.chec-file-uploader {
  @apply block relative flex flex-col w-full h-auto flex rounded shadow-inner bg-gray-gradient flex justify-center;

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

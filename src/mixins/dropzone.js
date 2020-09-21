import Dropzone from 'dropzone';

Dropzone.autoDiscover = false;

export default {
  props: {
    /**
     * The endpoint to upload files to
     */
    endpoint: {
      type: String,
      default: '/',
    },
    /**
     * Accepted File Types, comma seperated or null
     */
    fileTypes: {
      type: String,
      default: null,
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
      acceptedFiles: this.fileTypes,
      url: typeof this.endpoint === 'string' ? this.endpoint : '-',
      createImageThumbnails: true,
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

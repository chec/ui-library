const Dropzone = typeof window !== 'undefined' ? require('dropzone') : {};

Dropzone.autoDiscover = false;

export default {
  model: {
    prop: 'files',
    event: 'change',
  },
  props: {
    /**
     * Any options that should be given to the dropzone component
     */
    additionalDropzoneOptions: {
      type: Object,
      default: () => {},
    },
    /**
     * The endpoint to upload files to. This can be provided as a string, or a function that returns a promise that will
     * resolve a URL given a file object (provided by Dropzone). Note that this file object can be mutated to add a
     * `formData` key.
     */
    endpoint: {
      type: [String, Function],
      required: true,
    },
    /**
     * The files that already exist in the dropzone that haven't been uploaded in this "session" This is the v-model
     * binding prop.
     */
    files: {
      type: Array,
      default: () => [],
    },
    /**
     * An optional function that takes a file (an item in the given files prop) and returns either a File object or a
     * standard object that matches the File that dropzone generates. The return values must have an `id` property and
     * may provide the following attributes:
     * - `thumb` - a URL to be used for a thumbnail (if applicable)
     * - `name` - The file name to be used
     * - `size` - The size of the file in bytes
     * - `type` - The file mimetype
     * See the documentation for the acceptSuccessfulUpload prop for links to external documentation
     */
    normaliseFile: {
      type: Function,
      default: (file) => file,
    },
    /**
     * An optional function that takes a file object created by dropzone, and returns a promise that will resolve to a
     * file object that will be emitted with the rest of the files as a "change". See the MDN for detail on the
     * argument - a `File`: https://developer.mozilla.org/en-US/docs/Web/API/File, and the "tips" for the additional
     * detail dropzone adds to it: https://www.dropzonejs.com/#tips
     */
    acceptSuccessfulUpload: {
      type: Function,
      default: (file) => Promise.resolve({
        id: file.upload.uuid,
        name: file.name,
        thumb: file.dataURL,
        size: file.size,
        type: file.type,
        status: file.status,
      }),
    },
    /**
     * Accepted File Types, comma separated or null
     */
    fileTypes: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      dropzone: null,
      incompleteFiles: [],
    };
  },
  computed: {
    allFiles() {
      return [
        ...this.files.map((file) => {
          const { id, ...otherAttributes } = this.normaliseFile(file);

          return {
            thumb: '',
            name: '',
            size: null,
            type: '',
            ...otherAttributes,
            status: 'success',
            upload: {
              uuid: id,
              progress: 100,
            },
          };
        }),
        ...this.incompleteFiles,
      ];
    },
  },
  mounted() {
    const { endpoint } = this;

    this.dropzone = new Dropzone(this.$el, {
      chunkSize: 5000000,
      createImageThumbnails: true,

      // Items before this can be overridden by the additional options
      ...this.additionalDropzoneOptions,

      acceptedFiles: this.fileTypes,
      maxFiles: (this.maxFiles) ? this.maxFiles : null,
      hiddenInputContainer: this.$el,
      url: typeof this.endpoint === 'string' ? this.endpoint : '-',
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

    // Bind in-progress updates
    this.dropzone.on('addedfile', this.addIncompleteFile);
    this.dropzone.on('uploadprogress', this.updateIncompleteFile);

    // Handle the completed upload
    this.dropzone.on('complete', async (file) => {
      if (file.status !== 'success') {
        this.updateIncompleteFile(file);
        return;
      }

      try {
        const newFile = await this.acceptSuccessfulUpload(file);
        if (newFile) {
          // Remove the incomplete file...
          this.removeFile(file);
          // ...and trigger a change to update parent state with the new file.
          this.handleFilesChange([
            ...this.files,
            newFile,
          ]);
          return;
        }
      } catch (error) {
        // noop (catch promise rejections)
      }

      this.updateIncompleteFile({
        ...file,
        status: 'error',
      });
    });

    this.dropzone.events.forEach((event) => {
      this.dropzone.on(event, (...args) => {
        /**
         * Emitted when a dropzone event occurs. The event that occurred is the first argument, and the arguments of the
         * dropzone event are given as the rest of the arguments.
         *
         * @type {String}
         */
        this.$emit('dropzone-event', event, ...args);
      });
    });
  },
  methods: {
    findIncompleteFileIndex({ upload: { uuid } }) {
      return this.incompleteFiles.findIndex((candidate) => candidate.upload.uuid === uuid);
    },
    addIncompleteFile(file) {
      // If we have a max amount and have reached it, we dont want to add incomplete files.
      if (this.maxFiles !== null && this.allFiles.length >= this.maxFiles) {
        return;
      }

      this.incompleteFiles.push(file);
    },
    updateIncompleteFile(file) {
      this.incompleteFiles.splice(this.findIncompleteFileIndex(file), 1, file);
    },
    removeFile(file) {
      const incompleteIndex = this.findIncompleteFileIndex(file);
      if (incompleteIndex >= 0) {
        this.incompleteFiles.splice(incompleteIndex, 1);
        return;
      }

      const realIndex = this.files.findIndex((candidate) => {
        // Saved files will have an ID, unsaved files will not
        const fileId = typeof file.id !== 'undefined' ? file.id : file.upload.uuid;
        return candidate.id === fileId;
      });

      // Removes the file from the dropzone instance
      this.dropzone.files.splice(realIndex, 1);

      this.handleFilesChange([
        ...this.files.slice(0, realIndex),
        ...this.files.slice(realIndex + 1),
      ]);
    },
    handleFilesChange(newFiles) {
      /**
       * Emitted when the uploaded files should change. Provides the full list of completed files and existing files
       *
       * @type {Array<Object>}
       */
      this.$emit('change', newFiles);
    },
    openDialog() {
      this.dropzone.hiddenFileInput.click();
    },
  },
};

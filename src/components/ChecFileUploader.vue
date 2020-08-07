<template>
  <div class="chec-file-uploader">
    <div class="chec-file-uploader__inner" data-dropzone-clickable>
      <div v-if="Object.keys(files).length" class="file-rows-container" @click.stop>
        <FileRow
          v-for="(file, key) in files"
          :key="key"
          :loading="file.upload.progress !== null && file.upload.progress < 100"
          :file="file"
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
    endpoint: {
      type: String,
      default: '/',
    },
  },
  data() {
    return {
      files: {},
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
      vm.files[file.upload.uuid] = {
        ...file,
        upload:
          { ...file.upload, progress: null },
        type: file.type,
        size: file.size,
        name: file.name,
      };
      vm.$forceUpdate();
      this.$emit('file-added', vm.files[file.upload.uuid]);
    });
    this.dropzone.on('addedfile', (file) => {
      vm.files[file.upload.uuid] = {
        ...file,
        type: file.type,
        size: file.size,
        name: file.name,
      };
      vm.$forceUpdate();
    });
    this.dropzone.on('uploadprogress', (file) => {
      vm.files[file.upload.uuid] = {
        ...file,
        type: file.type,
        size: file.size,
        name: file.name,
      };
      vm.$forceUpdate();
    });
  },
  methods: {
    handleRemovingFile(file) {
      const files = { ...this.files };
      delete files[file.upload.uuid];
      this.files = { ...files };
      this.$emit('file-removed', file);
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

  .file-rows-container {
    @apply w-full flex flex-col mb-2;

    .chec-file-row {
      @apply mb-2;
    }
  }
}
</style>

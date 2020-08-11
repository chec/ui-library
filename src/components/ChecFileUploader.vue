<template>
  <div class="chec-file-uploader">
    <div class="chec-file-uploader__inner" data-dropzone-clickable>
      <div v-if="files" class="file-rows-container" @click.stop>
        <FileRow
          v-for="file in files"
          :key="file.upload.uuid"
          :loading="file.upload.progress !== null && file.upload.progress < 100"
          :file-name="file.name"
          :file-size="file.size"
          :mime-type="file.type"
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
    files: {
      type: Array,
      default: () => [],
    },
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
      vm.$forceUpdate();
      this.$emit('file-uploading-complete', file);
    });
    this.dropzone.on('addedfile', (file) => {
      vm.inProgressFiles = [
        ...vm.inProgressFiles,
        file,
      ];
      this.$emit('file-added', file);
      vm.$forceUpdate();
    });
    this.dropzone.on('uploadprogress', (file) => {
      vm.inProgressFiles = [
        ...vm.inProgressFiles,
        file,
      ];
      this.$emit('file-uploading', file);
      vm.$forceUpdate();
    });
  },
  methods: {
    handleRemovingFile(file) {
      this.$emit('remove-file', file);
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

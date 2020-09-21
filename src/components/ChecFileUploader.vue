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
import dropzone from '../mixins/dropzone.js';
import ChecButton from './ChecButton';
import FileRow from './ChecFileUploader/FileRow';

export default {
  name: 'ChecFileUploader',
  components: {
    ChecButton,
    FileRow,
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

.dz-preview {
  @apply hidden;
}
</style>

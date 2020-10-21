<template>
  <form method="post" enctype="multipart/form-data" class="chec-file-uploader">
    <div class="chec-file-uploader__inner">
      <div v-if="allFiles.length" class="file-rows-container space-y-2" @click.stop>
        <FileRow
          v-for="file in allFiles"
          :key="file.upload.uuid"
          :error="file.status === 'error'"
          :loading="['added', 'queued', 'uploading'].includes(file.status)"
          :file-name="file.name"
          :file-size="file.size"
          :mime-type="file.type"
          :progress="file.upload.progress"
          @remove="() => removeFile(file)"
        />
      </div>
      <ChecButton @click="openDialog">
        {{ $t('fileManager.chooseFiles') }}
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

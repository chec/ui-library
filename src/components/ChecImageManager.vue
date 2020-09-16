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
import dropzone from '../mixins/dropzone.js';
import ChecButton from './ChecButton';
import ChecIcon from './ChecIcon';
import ImageBlock from './ChecImageManager/ImageBlock.vue';

export default {
  name: 'ChecImageManager',
  components: {
    ChecButton,
    ChecIcon,
    ImageBlock,
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
}

.dz-preview {
  @apply hidden;
}
</style>

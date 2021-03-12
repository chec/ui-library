<template>
  <ChecModal :header="$t('imageManager.selectImages')" @dismiss="$emit('close')">
    <ChecCard inner-class="image-manager-gallery" borders="none" tailwind="p-2">
      <div
        v-for="{ id, name, thumb } in images"
        :key="id"
        class="image-manager-gallery__image"
        :class="{ 'image-manager-gallery__image--active': ticked(id) }"
        @click="toggleImage(id)"
      >
        <div class="image-manager-gallery__radio">
          <ChecIcon
            icon="check"
          />
        </div>
        <img
          class="image-manager-gallery__thumb"
          :src="thumb"
          :alt="name"
        >
      </div>
    </ChecCard>
    <template #toolbar>
      <ChecButton text-only color="primary" @click="$emit('close')">
        {{ $t('general.cancel') }}
      </ChecButton>
      <ChecButton color="green" @click="chooseImages">
        {{ $t('imageManager.select') }}
      </ChecButton>
    </template>
  </ChecModal>
</template>

<script>
import ChecCard from '@/components/ChecCard';
import ChecIcon from '@/components/ChecIcon';
import ChecModal from '@/components/ChecModal';
import ChecButton from '@/components/ChecButton';

export default {
  name: 'GalleryModal',
  components: {
    ChecButton,
    ChecCard,
    ChecIcon,
    ChecModal,
  },
  props: {
    /**
     * The images that can be chosen from - as file objects
     */
    images: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selected: [],
    };
  },
  methods: {
    chooseImages() {
      this.$emit('choose-images', this.images.filter(({ id }) => this.selected.includes(id)));
      this.selected = [];
    },
    toggleImage(id) {
      // Check if the image is selected, and unselect it if so.
      const index = this.selected.findIndex((candidate) => candidate === id);
      if (index >= 0) {
        this.selected.splice(index, 1);
        return;
      }

      this.selected.push(id);
    },
    ticked(id) {
      return this.selected.includes(id);
    },
  },
};
</script>

<style lang="scss">
@import './src/assets/mixins';

.image-manager-gallery {
  @apply grid grid-cols-2 gap-2 bg-white auto-rows-fr;

  @screen sm {
    @apply grid-cols-4;
  }

  &__image {
    @include aspect-ratio(1, 1, false);
    @apply rounded border border-gray-300 relative cursor-pointer;

    &--active {
      @apply border-green-500 border-2;

      .image-manager-gallery__radio {
        @apply bg-green-500;

        > * {
          @apply block;
        }
      }
    }
  }

  &__radio {
    @apply absolute w-4 h-4 rounded-full bg-overlay-gray text-white;

    // Top & left offset is half of the width/height (1rem)
    left: -0.5rem;
    top: -0.5rem;

    // Custom padding for icon size
    padding: 2px;

    > * {
      @apply hidden;
    }
  }

  &__thumb {
    @apply absolute top-0 w-0 w-full h-full object-contain;
  }
}
</style>

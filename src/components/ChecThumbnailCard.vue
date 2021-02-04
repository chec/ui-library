<template>
  <div class="thumbnail-card" :class="classObject">
    <div class="thumbnail-card__content">
      <div v-if="hasHoverContent" class="thumbnail-card__hover-content">
        <slot
          name="hover-content"
        />
      </div>
      <div v-if="thumbnail" class="thumbnail-card__thumbnail">
        <img :src="thumbnail" :alt="altText">
      </div>
      <div v-else class="thumbnail-card__placeholder">
        <ChecIcon class="thumbnail-card__logo" icon="chec" />
      </div>
    </div>
    <div class="thumbnail-card__inner-wrapper" :class="innerClass">
      <!--
        @slot Card content
      -->
      <slot />
    </div>
  </div>
</template>

<script>
import ChecIcon from './ChecIcon';

export default {
  name: 'ChecThumbnailCard',
  components: {
    ChecIcon,
  },
  props: {
    /**
     * Class to pass to inner container
     */
    innerClass: {
      type: String,
      default: '',
    },
    /**
     * allows card to apply the css class '.thumbnail-card--active' on pointer hovers
     */
    hoverable: Boolean,
    /**
     * sets card to active, applying the css class '.thumbnail-card--active' by default
     */
    active: Boolean,
    /**
     * Use dark variation
     */
    darkMode: Boolean,
    /**
     * Image for the thumbnail, if none is provided defaults to logo
     */
    thumbnail: {
      type: String,
      default: null,
    },
    /**
     * Alt text for the thumbnail image
     */
    altText: String,
  },
  computed: {
    /**
     * Returns the computed class name for the variant type, e.g. `thumbnail-card--dark-mode`
     *
     * @returns {string}
     */
    classObject() {
      const {
        darkMode,
        hoverable,
        active,
      } = this;

      return [
        {
          'thumbnail-card--dark-mode': darkMode,
          'thumbnail-card--hoverable': hoverable,
          'thumbnail-card--active': active,
        },
      ];
    },
    /**
     * Whether a hover-content slot was provided by the client
     *
     * @returns {boolean}
     */
    hasHoverContent() {
      return !!this.$slots['hover-content'];
    },
  },
};
</script>

<style lang="scss">
.thumbnail-card {
  @apply relative shadow-sm rounded-lg overflow-hidden flex flex-col h-full;

  &--dark-mode {
    .thumbnail-card__inner-wrapper {
      @apply bg-gray-600 text-white;
    }
  }

  &--hoverable {
    @apply transition duration-200 ease-in-out;

    &:hover {
      @extend .thumbnail-card--active;
    }
  }

  &__placeholder {
    @apply h-64 bg-gray-200 flex justify-items-center justify-center;
  }

  &__logo {
    @apply w-1/4 text-gray-500;
  }

  &__inner-wrapper {
    @apply bg-white py-5 px-4;
  }

  &--active {
    @apply shadow-holo;
  }

  &__content {
    @apply relative;
  }

  &__hover-content {
    @apply absolute hidden flex-col justify-center h-full w-full p-4 text-white;
    // Snowflake colour, or maybe gray-500 with 90% opacity, but whatever
    background: rgba(65, 84, 108, 0.9);

    // Content styling
    p {
      @apply font-bold mb-1;
    }

    ul {
      @apply list-disc;
    }

    li {
      @apply ml-4;
    }
  }

  &:hover,
  &:focus {
    .thumbnail-card__hover-content {
      @apply flex;
    }
  }
}
</style>

<template>
  <div
    class="avatar"
    :class="classObject"
    :style="styleObject"
  >
    <UserIcon
      v-if="!image"
      class="avatar__icon"
    />
  </div>
</template>

<script>
import UserIcon from '@/assets/svgs/user-icon.svg';

export default {
  name: 'ChecAvatar',
  components: {
    UserIcon,
  },
  props: {
    /**
     * The style variant for the avatar.
     One of "sm", "md", "lg". Default is "md"
     */
    variant: {
      type: String,
      validator(value) {
        return ['sm', 'md', 'lg'].includes(value);
      },
    },
    image: {
      type: String,
      default: '',
    },
  },
  computed: {
    /**
     * Returns the computed class name for the variant type, e.g. `avatar--sm`
     *
     * @returns {string}
     */
    classObject() {
      return this.variant ? `avatar--${this.variant}` : '';
    },
    styleObject() {
      return this.image ? `background-image: url('${encodeURI(this.image)}')` : '';
    },
  },
};
</script>

<style lang="scss">
@import './src/assets/mixins';

.avatar {
  @apply relative w-full rounded-full bg-gray-500 bg-no-repeat bg-cover bg-center;
  /* apply aspect-ratio mixin */
  @include aspect-ratio(1, 1);

  /* style fall-back element */
  &__icon {
    @apply absolute inset-0 m-auto;
  }

  &--sm {
    @apply h-8 w-8;
  }

  &--md {
    @apply h-12 w-12;
  }

  &--lg {
    @apply h-20 w-20;
  }
}
</style>

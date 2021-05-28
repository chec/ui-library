<template>
  <header class="chec-header" :class="`chec-header--${variant}`">
    <component :is="actualHeaderTag" class="chec-header__title">
      {{ title }}
    </component>

    <div v-if="label || $slots.default" class="chec-header-inner">
      <label v-if="label" class="chec-header-inner__label">
        {{ label }}
      </label>
      <!--
        @slot - Slot to distribute a <ChecButton> to
        ! -->
      <slot />
    </div>
  </header>
</template>

<script>

export default {
  name: 'ChecHeader',
  props: {
    /**
     * The text to be shown as the header
     */
    title: {
      type: String,
      required: true,
    },
    /**
     * Optional text to be shown as a label, that appears before the optional slot
     */
    label: {
      type: String,
      default: '',
    },
    /**
     * The type of header - either for a "section" or a "card"
     */
    variant: {
      type: String,
      validate: candidate => ['section', 'card'].includes(candidate),
      default: 'section',
    },
    /**
     * The HTML tag to use for the title of the section. Defaults to `h2` for a "section" and `h3` for a "card"
     */
    headerTag: String,
  },
  computed: {
    actualHeaderTag() {
      return this.headerTag || (this.variant === 'section' ? 'h2' : 'h3');
    },
  },
};
</script>

<style lang="scss">
.chec-header {
  @apply flex justify-between items-center w-full;

  &--section &__title {
    @apply text-2xl font-bold text-gray-600;
  }

  &--card &__title {
    @apply caps-xxs font-black py-1 text-gray-600 border-b border-gray-300;
  }

  &-inner {
    @apply flex items-center;

    &__label {
      @apply caps-xs;

      &:not(:last-child) {
        @apply pr-4;
      }
    }
  }
}
</style>

<template>
  <header class="chec-header" :class="`chec-header--${this.variant}`">
    <component :is="actualHeaderTag" class="chec-header__title">
      {{ title }}
    </component>

    <div v-if="label || $slots.default" class="chec-header-inner">
      <label class="chec-header-inner__label" v-if="label">
        {{ label }}
      </label>
      <!--
        @slot - Slot to distribute a <BaseButton> to
      !-->
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
    @apply text-2xl;
  }

  &--card &__title {
    @apply rounded-full tiny-caps bg-gray-200 px-2 py-1 text-gray-500;
  }

  &-inner {
    @apply flex items-center;
    &__label {
      @apply small-caps;
      &:not(:last-child) {
        @apply pr-4;
      }
    }
  }
}
</style>

<template>
  <div
    ref="accordion"
    class="accordion"
    :class="{'accordion--active': isOpen}"
  >
    <div class="accordion__heading">
      <div>
        <div class="accordion__title" v-html="title" />
        <div v-if="subtitle" class="accordion__subtitle" v-html="subtitle" />
      </div>
      <div class="accordion__toggle" @click="isOpen = !isOpen">
        <ChecIcon icon="down" />
      </div>
    </div>
    <div class="accordion__body-container">
      <div class="accordion__body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import ChecIcon from './ChecIcon.vue';

export default {
  name: 'ChecAccordion',
  components: {
    ChecIcon,
  },
  props: {
    /**
    * The accordion's title.
    */
    title: {
      type: String,
      default: '',
    },
    /**
    * The accordion's subtitle.
    */
    subtitle: {
      type: String,
      default: '',
    },
    /**
    * Set the accordion to open on load. Default: False.
    */
    open: Boolean,
  },
  data() {
    return {
      isOpen: this.open,
    };
  },
};
</script>

<style lang="scss">
.accordion {
  @apply rounded bg-gray-100;

  &__heading {
    @apply text-gray-500 flex justify-between items-center p-4;
  }

  &__title {
    @apply font-bold text-sm;
  }

  &__subtitle {
    @apply text-xs mt-2;
  }

  &__toggle {
    @apply rounded p-2 bg-white h-8 w-8 cursor-pointer;

    svg {
      @apply transition-transform duration-200;
    }
  }

  &__body-container {
    @apply max-h-0 overflow-hidden;

    transition: max-height 700ms cubic-bezier(0, 1, 0, 1),
      margin-top 300ms linear 300ms;
  }

  &__body {
    @apply p-4;
  }

  &--active {
    .accordion__body-container {
      @apply max-h-full-px -mt-4;

      transition: max-height 1200ms cubic-bezier(1, 0, 0, 1);
    }

    .accordion__toggle svg {
      @apply transform -rotate-180;
    }
  }
}
</style>

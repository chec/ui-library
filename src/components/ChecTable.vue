<template>
  <div class="chec-table" :class="classNames">
    <div v-if="$slots.prepend" class="chec-table__prepend">
      <div class="chec-table__inner-wrapper">
        <!--
          @slot Search, tags etc.
        -->
        <slot name="prepend" />
      </div>
    </div>
    <table class="chec-table__table" :class="innerClass">
      <!--
        @slot Table content
      -->
      <slot />
    </table>
  </div>
</template>

<script>
export default {
  name: 'ChecTable',
  props: {
    /**
     * Class to pass to table
     */
    innerClass: {
      type: String,
      default: '',
    },
    snug: Boolean,
  },
  computed: {
    classNames() {
      return {
        'chec-table--prepended': !!this.$slots.prepend,
        'chec-table--snug': this.snug,
      };
    },
  },
};
</script>

<style lang="scss">
.chec-table {
  &__prepend {
    @apply relative px-4 rounded-t-md bg-gray-200;
  }

  &__inner-wrapper {
    @apply bg-gray-200 py-4 border-b border-solid border-gray-300;
  }

  &__table {
    @apply relative;
  }

  &--prepended {
    @apply shadow rounded;

    .chec-table__table {
      @apply shadow-none rounded-t-none;
    }
  }

  &--snug {
    th,
    td {
      @apply px-1 py-3;

      &:first-child {
        @apply pl-4;
      }

      &:last-child {
        @apply pr-4;
      }
    }
  }
}
</style>

<template>
  <div
    :class="{'code-example-group--with-logos': hasIcons }"
    class="code-example-group"
  >
    <div class="code-example-group__tabs">
      <ChecTab
        v-for="(tab, index) in tabs"
        :key="index"
        :active="activeBlock === index"
        round
        @click="activeBlock = index"
      >
        {{ tab }}
      </ChecTab>
    </div>
    <ActiveTab :vnode="activeVnode" />
    <div v-if="hasIcons" class="code-example-group__logos">
      <slot name="icons" />
    </div>
  </div>
</template>

<script>
import ChecTab from './ChecTab';

export default {
  name: 'CodeBlockGroup',
  components: {
    ChecTab,
    // Allows us to render a single vnode from the slot programatically.
    ActiveTab: {
      functional: true,
      render: (h, ctx) => ctx.props.vnode,
    },
  },
  data() {
    return {
      activeBlock: 0,
    };
  },
  computed: {
    /**
     * Creates a list of titles based on the slot vnodes
     */
    tabs() {
      return this.$slots.default.filter((slot) => typeof slot.data !== 'undefined')
        .map(slot => slot.data.attrs.title);
    },
    /**
     * Return the vnode based on the selected tab.
     */
    activeVnode() {
      return this.$slots.default.filter((slot) => typeof slot.data !== 'undefined')[this.activeBlock];
    },
    hasIcons() {
      return !!this.$slots.icons;
    },
  },
  watch: {
    activeBlock() {
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss">
.code-example-group {
  @apply relative;

  &__tabs {
    @apply absolute m-2 mt-6 rounded-full overflow-hidden inline-block shadow-sm bg-gray-700 p-1 z-10;

    @media (min-width: 470px) {
      @apply m-6;
    }
  }

  .chec-tab:not(:last-child) {
    @apply mr-1;
  }

  &__logos {
    @apply relative inline-flex justify-end bg-gray-700 rounded-full shadow-sm p-3 float-right mr-6 gap-2;
    top: -80px; // 24px margin plus eyeballed container position
  }

  &__logo {
    @apply w-8 h-8 text-gray-300;

    &:not(:last-child) {
      @apply mr-3;
    }
  }

  .code-example {
    @apply pt-20;
  }

  &--with-logos {
    .code-example {
      @apply pb-24;
    }
  }
}
</style>

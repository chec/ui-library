<template>
  <div class="code-example-group">
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

    <div v-if="showLogos" class="code-example-group__logos">
      <ReactLogo class="code-example-group__logo" />
      <GatsbyLogo class="code-example-group__logo" />
      <NextLogo class="code-example-group__logo" />
      <VueLogo class="code-example-group__logo" />
      <AngularLogo class="code-example-group__logo" />
    </div>
  </div>
</template>

<script>
import AngularLogo from '../assets/svgs/frameworks/angular.svg';
import GatsbyLogo from '../assets/svgs/frameworks/gatsby.svg';
import NextLogo from '../assets/svgs/frameworks/next.svg';
import ReactLogo from '../assets/svgs/frameworks/react.svg';
import VueLogo from '../assets/svgs/frameworks/vue.svg';
import ChecTab from './ChecTab';

export default {
  name: 'CodeBlockGroup',
  components: {
    ChecTab,
    AngularLogo,
    GatsbyLogo,
    NextLogo,
    ReactLogo,
    VueLogo,
    // Allows us to render a single vnode from the slot programatically.
    ActiveTab: {
      functional: true,
      render: (h, ctx) => ctx.props.vnode,
    },
  },
  props: {
    /**
     * If true, five frontend JS framework logos will be rendered in the bottom right corner
     */
    showLogos: Boolean,
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
    @apply absolute m-6 rounded-full overflow-hidden inline-block shadow-sm bg-gray-700 p-1 z-10;
  }

  .chec-tab:not(:last-child) {
    @apply mr-1;
  }

  &__logos {
    @apply relative inline-flex justify-end bg-gray-700 rounded-full shadow-sm p-3 float-right mr-6;
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
}
</style>

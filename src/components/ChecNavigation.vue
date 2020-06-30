<template>
  <nav
    class="chec-navigation"
    :class="navClasses"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
  >
    <ChecLogo class="chec-navigation__logo" />
    <ul class="chec-navigation__links-list">
      <li
        v-for="({ component, bind, label, iconName }, i) in navItems"
        :key="i"
      >
        <component :is="component" v-bind="bind" class="chec-navigation__link">
          <div class="chec-navigation__icon-wrapper">
            <ChecNavIcon
              :icon="iconName"
            />
          </div>
          <span>
            {{
              label
            }}
          </span>
        </component>
      </li>
    </ul>
    <div v-if="$slots.default" class="chec-navigation__bottom-content">
      <slot />
    </div>
  </nav>
</template>

<script>
import ChecLogo from '@/assets/svgs/chec-logo.svg';
import ChecNavIcon from '@/components/ChecNavIcon.vue';

export default {
  name: 'ChecNavigation',
  components: {
    ChecLogo,
    ChecNavIcon,
  },
  props: {
    /**
     * Expands the nav by default
     */
    expanded: Boolean,
    additionalLinks: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      hovered: false,
    };
  },
  computed: {
    navClasses() {
      return {
        'chec-navigation--expanded': this.expanded || this.hovered,
      };
    },
    navItems() {
      if (!this.$router.options) {
        throw new Error('Could not locate vue-router instance from within <ChecNavigation>');
      }
      return this.$router.options.routes
        .filter(route => route.meta && route.meta.navItem)
        .map(({ meta: { navItem: { sort, label, iconName } }, path }) => ({
          path,
          sort,
          label,
          iconName,
        }))
        .concat(this.additionalLinks.filter(link => Boolean(link.href)))
        // Sort the routes by their sort order, if they're provided
        .sort((a, b) => {
          const sortA = a.sort || 100;
          const sortB = b.sort || 100;
          if (sortA < sortB) {
            return -1;
          }
          return sortA > sortB ? 1 : 0;
        })
        .map((route) => ({
          ...route,
          component: route.path ? 'router-link' : 'a',
          bind: route.path
            ? {
              to: route.path,
              'active-class': 'chec-navigation__link--active',
            }
            : {
              href: route.href,
              target: '_blank',
              rel: 'noopener',
            },
        }));
    },
  },
};
</script>

<style lang="scss">
.chec-navigation {
  @apply fixed top-0 left-0 w-20 h-screen shadow-sm p-4 flex
    flex-col transition-all duration-300 ease-in-out overflow-auto;

  &__logo {
    @apply fill-current text-gray-500 w-full h-auto justify-start py-2;
    max-width: 3rem;

    min-height: 3rem;
  }

  &__links-list {
    @apply mt-20 flex-grow;

    li {
      @apply mb-2;
    }
  }

  &__link {
    @apply relative flex items-center justify-between overflow-hidden w-full rounded whitespace-no-wrap;

    span {
      @apply flex-grow w-0 opacity-0 text-sm text-gray-600 duration-100;
    }

    &:hover {
      @apply bg-gray-100;
    }

    &--active {
      @apply bg-gray-200;
    }
  }

  &__icon-wrapper {
    @apply w-12 h-12 p-3 z-10;

    min-width: 3rem;

    > svg {
      @apply w-full h-full;
    }
  }

  &--expanded,
  &:hover {
    width: 15rem;

    .chec-navigation__link {
      span {
        @apply w-auto opacity-100;
      }
    }
  }
}
</style>

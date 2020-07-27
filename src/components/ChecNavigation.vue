<template>
  <nav class="chec-navigation">
    <div
      class="chec-navigation__drawer"
      :class="deepNavClasses"
      @mouseleave="handleCloseDrawer"
    >
      <div class="chec-navigation__section-navigation">
        <header class="chec-navigation__section-title">
          {{ activeSection.label }}
        </header>
        <ul class="chec-navigation__section-links">
          <li
            v-for="{ component, bind, external, label, on } in activeSection.links"
            :key="label"
          >
            <component
              :is="component"
              v-bind="bind"
              class="chec-navigation__section-link"
              v-on="on"
            >
              {{ label }}
              <ChecIcon v-if="external" size="base" icon="link" />
            </component>
          </li>
        </ul>
        <!--
          @slot Detail to display at the bottom of the "drawer" that opens on hover
        -->
        <slot />
      </div>
    </div>
    <div class="chec-navigation__top-navigation">
      <ChecLogo class="chec-navigation__logo" />
      <ul class="chec-navigation__links-list">
        <li
          v-for="section in compiledTree"
          :key="section.icon"
          class="chec-navigation__section"
          :class="section.classes"
          @mouseover="() => handleOpenSection(section)"
        >
          <ChecButton
            :tag-type="section.buttonTag"
            v-bind="section.bind"
            variant="small"
            @touchstart.prevent="() => handleOpenSection(section)"
          >
            <ChecNavIcon :icon="section.icon" />
          </ChecButton>
        </li>
      </ul>
      <div @mouseover="() => handleOpenSection(user)">
        <component
          :is="user.component"
          v-if="user"
          v-bind="user.bind"
        >
          <ChecAvatar
            class="chec-navigation__avatar"
            :image="user.avatar"
          />
        </component>
      </div>
    </div>
  </nav>
</template>

<script>
import ChecAvatar from '@/components/ChecAvatar';
import ChecLogo from '@/assets/svgs/chec-logo.svg';
import ChecNavIcon from '@/components/ChecNavIcon';
import ChecButton from '@/components/ChecButton';
import ChecIcon from '@/components/ChecIcon';

export default {
  name: 'ChecNavigation',
  components: {
    ChecIcon,
    ChecButton,
    ChecAvatar,
    ChecLogo,
    ChecNavIcon,
  },
  props: {
    /**
     * The navigation tree. This should be an array of objects with keys for "label", "icon", and "links". "links" must
     * be an array of objects with links to appear as sub-navigation items.
     */
    tree: {
      type: Array,
      required: true,
    },
    /**
     * A separate section of the "tree" that applies to the user. Also accepts an "avatar" key for an image to show
     */
    userSection: {
      type: Object,
      default: null,
    },
    /**
     * Force the drawer to remain open
     */
    open: Boolean,
    /**
     * Indicates that when the `open` prop is not true that the drawer should _never_ be open. This puts the nav drawer
     * into a "controlled" state, where visibility is entirely controlled through props
     */
    controlled: Boolean,
  },
  data() {
    const compiledTree = this.tree.map(this.parseSection);
    return {
      showDeepNav: false,
      compiledTree,
      activeSection: compiledTree[0],
    };
  },
  computed: {
    deepNavClasses() {
      return {
        'chec-navigation__drawer--open': this.open || (!this.controlled && this.showDeepNav),
      };
    },
    user() {
      return this.userSection && this.parseSection(this.userSection);
    },
  },
  methods: {
    /**
     * Parse the sections of the given tree and add resolved details used to render the tree.
     *
     * @param {Object} section
     * @return {Object}
     */
    parseSection(section) {
      // Run through links within the section
      const compiledLinks = section.links.map((link) => ({
        ...link,
        external: this.isExternal(link),
        ...this.resolveComponentAndBind(link),
      }));

      // Use the first link in the section as the action for clicking the section button
      return {
        ...section,
        links: compiledLinks,
        buttonTag: compiledLinks[0].external ? 'link' : 'route',
        ...this.resolveComponentAndBind(compiledLinks[0]),
        classes: {
          'chec-navigation__section--divided': section.divider,
        },
      };
    },
    /**
     * Determine if the given link object describes an external link
     *
     * @param {Object} candidateLink
     * @returns {Boolean}
     */
    isExternal(candidateLink) {
      if (candidateLink.external !== undefined) {
        return Boolean(candidateLink.external);
      }

      return candidateLink.to && candidateLink.to.match(/^https?:\/\//);
    },
    /**
     * Given an object that represents a link somewhere, resolve the component (a, button, etc) that should be used and
     * any `v-bind` and `v-on` attributes that should be applied
     *
     * @param {Object} link
     * @returns {Object}
     */
    resolveComponentAndBind(link) {
      const { to } = link;

      if (to) {
        if (this.isExternal(link)) {
          return {
            component: 'a',
            bind: { href: to, target: '_blank', rel: 'noopener' },
          };
        }

        return {
          component: 'router-link',
          bind: { to },
        };
      }

      return {
        component: 'button',
        on: { click: link.handle },
      };
    },
    /**
     * Handle tracking state updates when the user prompts a section to open
     *
     * @param {Object} section
     */
    handleOpenSection(section) {
      this.showDeepNav = true;
      this.activeSection = section;
    },
    /**
     * Handle the user prompting the drawer (with sub-navigation) to hide
     */
    handleCloseDrawer() {
      this.showDeepNav = false;
    },
  },
};
</script>

<style lang="scss">
.chec-navigation {
  @apply fixed top-0 left-0 h-screen z-20;

  &__top-navigation {
    @apply absolute shadow-sm p-4 flex flex-col overflow-auto h-full w-20 bg-white;
  }

  &__logo {
    @apply fill-current text-gray-500 w-full h-auto justify-start py-2;
  }

  &__links-list {
    @apply mt-20 flex-grow;
  }

  &__section {
    @apply mb-2 flex items-center;

    svg {
      @apply w-8 h-8 p-1;
    }

    &--divided {
      @apply pt-2 border-t border-gray-300;
    }
  }

  &__drawer {
    @apply absolute pl-20 h-full shadow-md bg-white;
    // Transitions:
    @apply transform transition ease-in-out duration-500 delay-100;
    width: calc(280px + 5rem);

    // stylelint-disable-next-line order/order
    --transform-translate-x: calc(-280px - 1rem);

    &--open {
      // delay-0 here ensures there's no delay when --open is applied (ie. during opening)
      transition-delay: 0ms;
      @apply translate-x-0;
    }
  }

  &__section-navigation {
    @apply pt-8 px-8 pb-4 flex flex-col h-full;
  }

  &__section-title {
    @apply text-gray-600 pb-8 text-lg font-bold border-b border-gray-200;
  }

  &__section-links {
    @apply text-gray-500 my-8 flex-grow;
  }

  &__section-link {
    // leading-9 = 2.25rem line-height. This gives each link desired separation while maximising click area
    @apply flex items-center leading-9;

    svg {
      @apply ml-1;
    }
  }
}
</style>

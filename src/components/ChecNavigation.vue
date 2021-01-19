<template>
  <nav class="chec-navigation" @focusout="handleLoseFocus">
    <a href="#main" class="chec-navigation__skip">
      {{ $t('navigation.skip') }}
    </a>
    <div
      class="chec-navigation__drawer"
      :class="deepNavClasses"
      tabindex="-1"
      @mouseleave="handleCloseDrawer"
    >
      <div class="chec-navigation__section-navigation">
        <header class="chec-navigation__section-title">
          {{ activeSection.label }}
        </header>
        <ul ref="sectionList" class="chec-navigation__section-links">
          <li
            v-for="{ component, bind, external, label, on } in activeSection.links"
            :key="label"
            @keydown.down="focusNextLink"
            @keydown.up="focusPreviousLink"
            @keydown.tab.exact.prevent="focusNextSection"
            @keydown.tab.shift.prevent="focusPreviousSection"
            @keydown.left="focusCurrentSection"
          >
            <component
              :is="component"
              ref="listItem"
              class="chec-navigation__section-link"
              tabindex="-1"
              v-bind="bind"
              v-on="on"
            >
              {{ label }}
              <ChecIcon v-if="external" size="base" icon="link" />
            </component>
          </li>
        </ul>
        <div v-if="user && $slots.default" @mouseenter="handleOpenSection(user)">
          <!--
            @slot Detail to display at the bottom of the "drawer" that opens on hover
          -->
          <slot />
        </div>
      </div>
    </div>
    <div
      class="chec-navigation__top-navigation"
      @keyup.down="focusNextSection"
      @keyup.up="focusPreviousSection"
      @keyup.right="focusList"
    >
      <component
        :is="homeLink ? 'router-link' : 'div'"
        ref="logo"
        v-bind="homeLinkAttrs"
      >
        <ChecLogo class="chec-navigation__logo" />
      </component>
      <ul class="chec-navigation__links-list">
        <li
          v-for="section in compiledTree"
          :key="section.icon"
          class="chec-navigation__section"
          :class="[section.classes, { 'chec-navigation__section--active': section.label === activeLabel }]"
          @mouseover="() => handleOpenSection(section)"
        >
          <ChecButton
            ref="sectionButton"
            :tag-type="section.buttonTag"
            v-bind="section.bind"
            variant="small"
            @touchstart.prevent="() => handleOpenSection(section)"
            @focus.native="() => handleOpenSection(section)"
          >
            <ChecNavIcon :icon="section.icon" />
          </ChecButton>
          <Ping v-if="section.ping" />
        </li>
      </ul>
      <div @mouseover="() => handleOpenSection(user)">
        <component
          :is="user.component"
          v-if="user"
          ref="user"
          v-bind="user.bind"
          @focus.native="() => handleOpenSection(user)"
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
import Ping from './ChecNavigation/Ping.vue';

export default {
  name: 'ChecNavigation',
  components: {
    ChecIcon,
    ChecButton,
    ChecAvatar,
    ChecLogo,
    ChecNavIcon,
    Ping,
  },
  props: {
    /**
     * The label of the section that is currently considered "active"
     */
    activeLabel: {
      type: String,
      default: null,
    },
    /**
     * A path to be used as a "home" link for the navigation.
     */
    homeLink: {
      type: String,
      default: null,
    },
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
      listItemFocus: null,
    };
  },
  computed: {
    deepNavClasses() {
      return {
        'chec-navigation__drawer--open': this.open || (!this.controlled && this.showDeepNav),
      };
    },
    homeLinkAttrs() {
      if (!this.homeLink) {
        return {};
      }

      return {
        to: this.homeLink,
        title: this.$t('navigation.returnToHome'),
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
      this.listItemFocus = null;
    },
    /**
     * Handle the user prompting the drawer (with sub-navigation) to hide
     */
    handleCloseDrawer() {
      this.showDeepNav = false;
    },
    /**
     * Handle an event that triggers a specific list to be focused
     *
     * @param event
     */
    focusList(event) {
      // Special case for ignoring this event when focused on the logo
      if (event.target === this.$refs.logo.$el) {
        return;
      }
      this.listItemFocus = 0;
      this.focusLink(0);
    },
    /**
     * Handle an event that should highlight a link in the navigation, based off the "listItemFocus" state that's stored
     */
    focusLink() {
      this.$nextTick(() => {
        const ref = this.$refs.listItem[this.listItemFocus];

        if (!ref) {
          return;
        }

        if (!ref.focus) {
          ref.$el.focus();
          return;
        }

        ref.focus();
      });
    },
    /**
     * Handle an event that should focus the next link in the active section
     */
    focusNextLink() {
      const linkCount = this.$refs.listItem.length;

      if (this.listItemFocus === linkCount - 1) {
        this.listItemFocus = 0;
      } else {
        this.listItemFocus += 1;
      }

      this.focusLink();
    },
    /**
     * Handle an event that should focus the previous link in the active section
     */
    focusPreviousLink() {
      const linkCount = this.$refs.listItem.length;

      if (this.listItemFocus === 0) {
        this.listItemFocus = linkCount - 1;
      } else {
        this.listItemFocus -= 1;
      }

      this.focusLink();
    },
    /**
     * Handle an event that should focus the next section in the nav
     */
    focusNextSection(event) {
      // Special case for focusing next element when the logo is active
      if (event.target === this.$refs.logo.$el) {
        this.$refs.sectionButton[0].$el.focus();
        return;
      }

      const currentIndex = this.compiledTree.findIndex((section) => section.label === this.activeSection.label);

      // No current section means that we must be on the user section, so we'll just focus the current section - there's
      // no easy way to tell JS to just "tab to the next thing"
      if (currentIndex < 0) {
        this.focusCurrentSection();
        return;
      }

      // If we're already on the last section, the next section to focus will be the user
      if (currentIndex === this.compiledTree.length - 1) {
        if (!this.user) {
          this.focusCurrentSection();
          return;
        }

        this.$refs.user.$el.focus();
        return;
      }

      this.$refs.sectionButton[currentIndex + 1].$el.focus();
    },
    /**
     * Handle an event that should focus the previous section in the nav
     */
    focusPreviousSection() {
      const currentIndex = this.compiledTree.findIndex((section) => section.label === this.activeSection.label);

      // No current section means that we must be on the user section
      if (currentIndex < 0) {
        this.$refs.sectionButton[this.compiledTree.length - 1].$el.focus();
        return;
      }

      if (currentIndex === 0) {
        this.$refs.logo.$el.focus();
        return;
      }

      this.$refs.sectionButton[currentIndex - 1].$el.focus();
    },
    /**
     * Handle an event that should focus the current section in the nav (eg. for taking away focus from links within a
     * section)
     */
    focusCurrentSection() {
      const currentIndex = this.compiledTree.findIndex((section) => section.label === this.activeSection.label);

      if (currentIndex < 0) {
        this.$refs.user.$el.focus();
        return;
      }

      this.$refs.sectionButton[currentIndex].$el.focus();
    },
    /**
     * Handle an event which might cause the nav to lose focus.
     */
    handleLoseFocus(event) {
      // Assert the focus is actually lost from this component
      if (this.$el.contains(event.relatedTarget)) {
        return;
      }

      this.handleCloseDrawer();
    },
  },
};
</script>

<style lang="scss">
.chec-navigation {
  @apply fixed top-0 left-0 h-screen z-20;

  &__skip {
    @apply fixed p-1 bg-white;
    left: -500px;

    &:focus,
    &:active {
      @apply left-0 z-30;
    }
  }

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

    &--active {
      // Apply the an active colour that is slightly different from the active colour defined directly on the button
      .button--color-secondary {
        @apply bg-gray-200;
      }
    }
  }

  &__drawer {
    @apply absolute pl-20 h-full shadow-md bg-white outline-none;
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
    @apply pt-8 px-8 pb-4 flex flex-col h-full outline-none;
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

    &.router-link-exact-active {
      @apply font-bold;
    }
  }
}
</style>

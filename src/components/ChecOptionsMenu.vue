<template>
  <div ref="menu-el" class="options-menu">
    <ChecButton
      slot="reference"
      ref="button-el"
      variant="small"
      v-bind="$attrs"
      @click="toggleMenu"
    >
      <template #icon>
        <ChecIcon icon="more" />
      </template>
    </ChecButton>
    <ChecPopover
      v-show="isOpen"
      ref="popper-el"
      @option-selected="handleSelectOption"
    >
      <!--
        @slot Provide ChecOption instances here
      -->
      <slot />
    </ChecPopover>
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core';
import ChecButton from './ChecButton.vue';
import ChecPopover from './ChecPopover.vue';
import ChecIcon from './ChecIcon.vue';

export default {
  name: 'ChecOptionsMenu',
  components: {
    ChecButton,
    ChecPopover,
    ChecIcon,
  },
  inheritAttrs: false,
  props: {
    /**
     * Whether the menu should initially be open or not
     */
    open: Boolean,
    /**
     *  Describes the preferred placement of the options menu.
     */
    menuPlacement: {
      type: String,
      default: 'bottom',
      validate(placement) {
        return [
          'auto',
          'auto-start',
          'auto-end',
          'top',
          'top-start',
          'top-end',
          'bottom',
          'bottom-start',
          'bottom-end',
          'right',
          'right-start',
          'right-end',
          'left',
          'left-start',
          'left-end'].includes(placement);
      },
    },
  },
  data() {
    return {
      isOpen: this.open,
    };
  },
  watch: {
    isOpen(newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal) {
          this.show();
        } else {
          this.hide();
        }
      }
    },
  },
  created() {
    // add event listener to listen to outside click events
    window.addEventListener('click', this.onOutsideClick);
  },
  mounted() {
    this.$nextTick(() => {
      this.createPopper();
    });
  },
  beforeDestroy() {
    // remove event listeners
    window.removeEventListener('click', this.onOutsideClick);
  },
  methods: {
    /**
     * Show the popper.js
     */
    show() {
      this.$refs['button-el'].$el.setAttribute('data-show', '');
      this.createPopper();
    },
    /**
     * Hide the popper
     */
    hide() {
      this.$refs['popper-el'].$el.removeAttribute('data-show');
      this.destroyPopper();
    },
    /**
     * Create the popper.js instance
     */
    createPopper() {
      this.$popper = createPopper(this.$refs['button-el'].$el, this.$refs['popper-el'].$el, {
        placement: this.menuPlacement,
        modifiers: [
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['top', 'bottom'],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              rootBoundary: 'document',
            },
          },
        ],
      });
    },
    /**
     * Destroys the popper.js instance
     */
    destroyPopper() {
      if (this.$popper) {
        this.$popper.destroy();
        this.$popper = null;
      }
    },
    /**
     * Toggles the menu between open and closed
     */
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    /**
     * A handler bound on the window while the component is mounted that closes the menu when clicked away
     *
     * @param {Event} event
     */
    onOutsideClick(event) {
      if (!this.$refs['menu-el'].contains(event.target) && this.isOpen) {
        this.isOpen = false;
      }
    },
    /**
     * When an option is selected, close the menu
     */
    handleSelectOption() {
      this.isOpen = false;
    },
  },
};
</script>

<style lang="scss">
.options-menu {
  @apply static;

  .popover {
    min-width: 10rem;
  }
}
</style>

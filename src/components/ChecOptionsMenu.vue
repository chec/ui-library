<template>
  <div class="options-menu" ref="menu-el">
    <BaseButton @click="toggleMenu" :class="{'float-right': position === 'right'}">
      <template v-slot:icon>
        <ChecIcon :icon="isOpen ? 'up' : 'down'" />
      </template>
    </BaseButton>
    <BasePopover
      v-if="isOpen"
      :class="{
        'mt-10': position === 'right',
        'right-0': position === 'right',
      }"
      @option-selected="handleSelectOption"
    >
      <!--
        @slot Provide BaseOption instances here
      -->
      <slot />
    </BasePopover>
  </div>
</template>
<script>
import BaseButton from './BaseButton.vue';
import BasePopover from './BasePopover.vue';
import ChecIcon from './ChecIcon.vue';

export default {
  name: 'ChecOptionsMenu',
  components: {
    BaseButton,
    BasePopover,
    ChecIcon,
  },
  props: {
    /**
     * Whether the menu should initially be open or not
     */
    open: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to left or right align the menu button in its container
     */
    position: {
      type: String,
      default: '',
      validate(position) {
        return ['right'].includes(position);
      },
    },
  },
  data() {
    return {
      isOpen: this.open,
    };
  },
  created() {
    // add event listener to listen to outside click events
    window.addEventListener('click', this.onOutsideClick);
  },
  beforeDestroy() {
    // remove event listeners
    window.removeEventListener('click', this.onOutsideClick);
  },
  methods: {
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
<style scoped lang="scss">
.options-menu {
  @apply static;
  .button {
    @apply shadow-none bg-transparent;
  }

  .popover {
    min-width: 10rem;
  }
}
</style>

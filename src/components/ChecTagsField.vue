<template>
  <div class="tags-field">
    <div
      v-if="options.length > 0"
      ref="tagsField"
      class="tags-field__tags-wrapper"
      @click="toggleDropdown"
    >
      <template v-for="(tag, index) in options">
        <ChecTag
          :key="index"
          class="tags-field__tag"
          :active="activeTag"
          @dismiss="handleRemoveTag"
        >
          {{ tag }}
        </ChecTag>
      </template>
    </div>
    <TextField
      v-show="!showDropdown && options.length === 0"
      v-model="newTag"
      :placeholder="placeholder"
      :additional-input-attributes="{ activeInput, maxLength }"
      inner-input-class="tags-field__tags-input"
      @input="emitTagChange"
      @keydown.delete.stop="handleRemoveLastTag"
      @keydown="handleAddNewTag"
      @focus="handleInputFocus"
      @blur="handleInputBlur"
    />
    <div
      v-if="showDropdown"
      ref="dropdown"
      class="tags-field__dropdown"
    >
      <div v-if="showDropdown || options.length" class="tags-field__add-option">
        <TextField
          ref="addOption"
          v-model="newTag"
          :placeholder="placeholder"
          :additional-input-attributes="{ activeInput, maxLength }"
          inner-input-class="tags-field__option-input"
          @input="emitTagChange"
          @keydown.delete.stop="handleRemoveLastTag"
          @keydown="handleAddNewTag"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        />
      </div>
      <ul class="tags-field__options">
        <li
          v-for="(option, index) in options"
          :key="index"
          class="tags-field__option"
        >
          <span class="tags-field__option-text">{{ option }}</span>
          <ChecButton
            color="red"
            text-only
            @click="handleRemoveTag"
          >
            Remove
          </ChecButton>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ChecButton from './ChecButton';
import ChecTag from './ChecTag';
import TextField from './TextField';

export default {
  name: 'ChecTagsField',
  components: {
    ChecButton,
    ChecTag,
    TextField,
  },
  props: {
    /**
     * If the textfield holds a value and loses focus,
     * a tag will be added out of the value
     */
    addOnBlur: Boolean,
    /**
     * Add a tag when listed keys are pressed
     * 13 (return), 188 (comma), 9(tab)
     */
    addOnKeys: {
      type: Array,
      default: () => [
        13, // Return
        188, // Comma ','
        9, // Tab
      ],
    },
    /**
     * Allow same tags to be added more than once
     */
    allowDuplicates: Boolean,
    /**
     * Function to pass before an option is added
     */
    beforeAdding: {
      type: Function,
      default: (tag) => tag,
    },
    /**
     * The maximum amount of characters the input/tags is allowed to have
     */
    maxLength: {
      type: Number,
      default: 20,
    },
    /**
     * The label for the tags field input
     */
    placeholder: {
      type: String,
      default: '',
    },
    optionsList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      newTag: '',
      options: [...this.optionsList],
      activeInput: false,
      activeTag: false,
      showDropdown: false,
    };
  },
  watch: {
    /**
     * Watch for new tags being added
     */
    optionsList() {
      this.options = [...this.optionsList];
    },
  },
  created() {
    // add event listener to listen to outside click events
    window.addEventListener('click', this.onOutsideClick);

    const onEscape = (e) => {
      if (e.key === 'Escape') {
        this.showDropdown = false;
      }
    };
    document.addEventListener('keydown', onEscape);
    this.$once('hook:destroyed', () => {
      document.removeEventListener('keydown', onEscape);
    });
  },
  beforeDestroy() {
    // remove event listeners
    window.removeEventListener('click', this.onOutsideClick);
  },
  methods: {
    /**
     * Add new tags/options
     */
    async handleAddNewTag(e) {
      // Check if tags are to be added with keys determined in key props
      const keyAddTag = e ? this.addOnKeys.indexOf(e.keyCode) !== -1 : true;

      const typeIsNotBlur = e && e.type !== 'blur';

      // If false, do not add new tags with listed keypresses
      if (!keyAddTag && (!this.addOnBlur || typeIsNotBlur)) {
        return;
      }

      // Check to see if there is any callback function being passed
      // before newTag is added other add newTag entered
      const tag = this.beforeAdding ? await this.beforeAdding(this.newTag) : this.newTag;

      // If duplicates are allowed or if tag does not exist yet
      if (tag && (this.allowDuplicates || this.options.indexOf(tag) === -1)) {
        // Add the new tag into the options array
        this.options.push(tag);
        this.newTag = '';
        this.emitTagChange();

        // eslint-disable-next-line no-unused-expressions
        e && e.preventDefault();
      }
    },
    /**
     * Determine is input is active
     */
    handleInputFocus() {
      this.activeInput = true;
    },
    /**
     * If text field is not active, input value is
     * automatically added as a new tag.
     */
    handleInputBlur(e) {
      this.activeInput = false;
      this.handleAddNewTag(e);
    },
    /**
     * Remove tag from options list
     */
    handleRemoveTag(index) {
      this.options.splice(index, 1);
      this.emitTagChange();
    },
    /**
     * Remove last tag with keypress event
     */
    handleRemoveLastTag() {
      if (this.newTag) {
        return;
      }
      this.options.pop();
      this.emitTagChange();
    },
    /**
     * Detect tag/option change/input
     */
    emitTagChange() {
      /**
       * Emitted the tag is changed
       * @event input
       * @type {$event}
       */
      this.$emit('update:tags', this.options);
    },
    /**
     * Toggles visibility of the dropdown
     */
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    /**
     * A handler bound on the window while the component is mounted that closes the dropdown when clicked away
     *
     * @param {Event} event
     */
    onOutsideClick(e) {
      if (!this.showDropdown) {
        return;
      }

      if (this.$refs.tagsField.contains(e.target)
        || this.$refs.dropdown.contains(e.target)
      ) {
        return;
      }

      this.toggleDropdown();
    },
  },
};
</script>

<style lang="scss">
.tags-field {
  @apply w-88;
  min-width: 22.25rem;

  &__tags-wrapper {
    @apply
      w-88
      px-4
      bg-white
      rounded
      border
      border-gray-200
      duration-150
      transition
      shadow-sm
      cursor-pointer
      z-50
      pt-4
      pb-2;
    min-width: 22.25rem; // Specific to design

    &:focus,
    &:active {
      @apply transition duration-150 border-gray-500 shadow-light-focus;
    }

    &:hover {
      @apply transition duration-150 border-gray-400;
    }
  }

  &__tag {
    @apply mr-2 mb-2 inline-block;
  }

  &__dropdown {
    @apply static bg-white items-center rounded-md shadow-md overflow-hidden z-30;
  }

  &__options {
    @apply overflow-y-auto overflow-x-hidden;
    max-height: 20vh;
  }

  &__option {
    @apply flex justify-between w-full items-center text-sm px-4 py-3 outline-none cursor-pointer bg-white;

    &:hover,
    &:focus,
    &:active {
      @apply bg-gray-100;
    }

    .button__content { // Target button span tag
      @apply text-xs font-bold uppercase;
    }
  }

  &__option-input {
    @apply rounded-none border-none shadow-none; // Override TextField style
  }

  &__option-text {
    @apply text-gray-500;
  }

  .button--variant-regular {
    @apply p-0;
  }
}
</style>

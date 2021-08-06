<template>
  <div
    ref="wrapper"
    :class="classNames"
    @focus="tagsFieldFocused = true"
    @click="handleActiveField"
    @blur="handleInputBlur"
  >
    <ul class="tags-field__list-wrapper">
      <li
        v-for="tag in tags"
        ref="list"
        :key="tag.id"
        class="tags-field__tag"
      >
        <ChecTag
          :active="activeTag"
          :disabled="disabled"
          @focused="handleDismissFocused"
          @dismiss="handleRemoveTag(tag)"
        >
          {{ tag }}
        </ChecTag>
      </li>
      <li class="tags-field__input-wrapper">
        <!--
          This section does some auto-grow input magic - where we have an input with a large width, and a
          transparent background
        -->
        <input
          v-show="isInputVisible"
          ref="input"
          v-model="newTag"
          :placeholder="disabled ? '' : placeholder"
          :disabled="disabled"
          :active="activeInput"
          :max-length="maxLength"
          class="tags-field__input"
          @keydown.delete.stop="handleRemoveLastTag"
          @keydown="handleAddNewTag"
          @focus="activeInput = true"
          @blur="handleInputBlur"
        >
        <!-- eslint-disable-next-line vue/no-useless-mustaches -->
        {{ '\xa0' }}
        <span class="tags-field__input-autogrow">
          {{ newTag }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import ChecTag from './ChecTag';

export default {
  name: 'ChecTagsField',
  components: {
    ChecTag,
  },
  model: {
    prop: 'tags',
    event: 'change',
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
     * Ie. Validation rules
     */
    beforeAdding: {
      type: Function,
      default: (tag) => tag,
    },
    /**
     * If this tags field component should appear disabled
     */
    disabled: Boolean,
    /**
     * The maximum amount of characters the input/tags is allowed to have
     */
    maxLength: {
      type: Number,
      default: null,
    },
    /**
     * The label for the tags field input
     */
    placeholder: {
      type: String,
      default: '',
    },
    /**
     * The value the v-model directive utilizes
     * @see https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
     */
    tags: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      newTag: '',
      activeInput: false,
      activeTag: false,
      isInputVisible: true,
      tagsFieldFocused: false,
    };
  },
  computed: {
    classNames() {
      const { disabled, tagsFieldFocused } = this;
      // Bind an active modifier to the tags field element
      return [
        'tags-field',
        {
          'tags-field--active': tagsFieldFocused,
          'tags-field--disabled': disabled,
        },
      ];
    },
    // list() {
    //   return Array.isArray(this.value);
    // },
  },
  created() {
    // Add event listener to listen to outside click events
    window.addEventListener('click', this.onOutsideClick);
    document.addEventListener('keydown', this.onEscape);
  },
  beforeDestroy() {
    // Remove event listeners
    window.removeEventListener('click', this.onOutsideClick);
    document.removeEventListener('keydown', this.onEscape);
  },
  mounted() {
    // If tags field is clicked and is set to focused,
    if (this.tagsFieldFocused) {
      // set input to visible if it wasn't already and
      this.isInputVisible = true;
      // set input to active
      this.activeInput = true;
    }
    // If input is active
    if (this.activeInput) {
      // Defer the focus on the input until
      // the input is mounted
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    }
  },
  methods: {
    /**
     * Add new tags
     */
    async handleAddNewTag($event) {
      // Check if tags are to be added with keys determined in key props
      const keyAddTag = $event ? this.addOnKeys.indexOf($event.keyCode) !== -1 : true;

      // Ensure event type is focusin and not blur
      const typeIsNotBlur = $event && $event.type !== 'blur';

      // If false, do not add new tags with listed keypresses
      if (!keyAddTag && (!this.addOnBlur || typeIsNotBlur)) {
        return;
      }
      // Check to see if there is any callback function being passed
      // before newTag is added or add 'newTag' entered
      const tag = this.beforeAdding ? await this.beforeAdding(this.newTag) : this.newTag;

      // If duplicates are allowed or if tag does not exist yet
      if (tag && (this.allowDuplicates || !this.tags.includes(tag))) {
        // Set newTag back to empty string
        this.newTag = '';
        this.emitTagChange([...this.tags, tag]);

        if ($event) {
          $event.preventDefault();
        }
      }
    },
    /**
     * Determine the visibility of the inner input element
     */
    handleInputVisibility() {
      // Ensure that input is always visible when no tags have been added
      if (!this.tags.length) {
        this.isInputVisible = true;
      }
      // If tags field is blur and tags have length
      if (!this.tagsFieldFocused && this.tags.length) {
        // Set input visibility to false
        this.isInputVisible = false;
      }
    },
    /**
     * Handle input focus
     */
    handleInputFocus() {
      // If input is visible
      if (this.isInputVisible) {
        // Defer focus until input is mounted
        this.$nextTick(() => {
          // then set input to focused
          this.$refs.input.focus();
        });
      }
    },
    /**
     * Handler to detect when input is not active
     */
    handleInputBlur(e) {
      // If text field is not active or is blur,
      this.activeInput = false;
      // input value is automatically added as a new tag.
      this.handleAddNewTag(e);
    },
    handleDismissFocused() {
      this.tagsFieldFocused = true;
      if (this.tagsFieldFocused) {
        this.isInputVisible = true;
      }
    },
    /**
     * Remove tag from tags list
     */
    handleRemoveTag(removedTag) {
      // Remove tag from tags array
      this.emitTagChange(this.tags.filter((candidate) => candidate !== removedTag));
      this.$emit('remove', removedTag);
    },
    /**
     * Remove last tag with keypress event
     */
    handleRemoveLastTag() {
      // If there is a value in newTag, cancel the function
      if (this.newTag) {
        return;
      }
      // Remove the last tag in the array
      const tags = [...this.tags];
      tags.pop();
      this.emitTagChange(tags);
    },
    /**
     * Emits tag/option input event
     */
    emitTagChange(tags) {
      /**
       * Emitted the tag is input
       * @event input
       * @type {$event}
       */
      this.$emit('change', tags);
    },
    /**
     * A click handler to make the input active when field is clicked
     *
     * @param {Event} event
     */
    handleActiveField() {
      this.tagsFieldFocused = true;
      // If tags field focused is true
      if (this.tagsFieldFocused) {
        // Set the element to focused
        this.$refs.wrapper.focus();
        // Set input to visible
        this.isInputVisible = true;
        // Set input to active
        this.activeInput = true;
      }
      // Set focus on input
      this.handleInputFocus();
    },
    /**
     * A handler bound on the window while the component is mounted that closes the dropdown when clicked away
     *
     * @param {Event} e
     */
    onOutsideClick(e) {
      // Prevent running of function if clicks are
      // defected in the tags field element or the input
      if (this.$refs.wrapper.contains(e.target)
        || this.$refs.input.contains(e.target)
      ) {
        return;
      }
      // Set tags field focus to false
      this.tagsFieldFocused = false;
      this.handleInputVisibility();
    },
    /**
     * To handle on escape keydown event
     *
     * @param {Event} e
     */
    onEscape(e) {
      if (e.key === 'Escape') {
        // Blur the tags field element
        this.tagsFieldFocused = false;
        // Set input to not visible
        this.handleInputVisibility();
        // Ensure that if tags field is not focused
        // the input is not active
        if (!this.tagsFieldFocused) {
          this.activeInput = false;
        }
      }
    },
  },
};
</script>

<style lang="scss">
.tags-field {
  @apply
    bg-white
    rounded
    border
    border-gray-200
    duration-150
    transition
    shadow-sm;

  &:focus,
  &:active,
  &--active {
    &:not(.tags-field--disabled) {
      @apply transition duration-150 border-gray-500 shadow-light-focus;
    }
  }

  &:hover {
    &:not(.tags-field--disabled) {
      @apply transition duration-150 border-gray-400;
    }
  }

  &--disabled {
    @apply opacity-50 transition-opacity duration-150 outline-none;
  }

  &:not(&--disabled) {
    @apply cursor-text;
  }

  &__tag,
  &__input-wrapper {
    @apply whitespace-no-wrap pl-2 mt-2;
  }

  &__tag {
    > * {
      @apply block mt-px;
    }
  }

  &__input-wrapper {
    @apply relative;

    input {
      @apply top-0 bg-transparent w-full pl-0;
    }
  }

  &__input-autogrow {
    @apply invisible inline-block;

    // Give a reasonable amount of max-width so the placeholder doesn't look squished up against the edge
    min-width: 6rem;
  }

  &__list-wrapper {
    @apply flex items-center justify-start pl-1 pr-2 pt-1 pb-3 flex-wrap;
  }

  &__input {
    @apply border-none bg-none; // Override input style

    &:focus {
      @apply outline-none;
    }

    &::placeholder {
      @apply text-gray-400;
    }
  }
}
</style>

<template>
  <div
    ref="wrapper"
    :class="classNames"
    role="textbox"
    tabindex="0"
    :tagsList="tagsList"
    :disabled="disabled"
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
          @dismiss="handleRemoveTag"
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
          :placeholder="placeholder"
          :active="activeInput"
          :max-length="maxLength"
          class="tags-field__input"
          @input="emitTagChange"
          @value="tags"
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
     * Tags list for the tags added
     */
    tagsList: {
      type: Array,
      default: () => [],
    },
    /**
     * Controls the width of the tags field. Use one of the tailwind sizes, e.g. 64, 72, 80, 88, 96.
     */
    width: {
      type: String,
      default: '88',
    },
    /**
     * The value the v-model directive utilizes
     * @see https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
     */
    value: {
      type: [Array, String, Number],
      default: '',
    },
  },
  data() {
    return {
      newTag: '',
      tags: Array.isArray(this.value) ? this.value.slice() : (this.value || []),
      activeInput: false,
      activeTag: false,
      isInputVisible: true,
      tagsFieldFocused: false,
    };
  },
  computed: {
    classNames() {
      const { tagsFieldFocused, width } = this;
      // Bind an active modifier to the tags field element
      return [
        'tags-field',
        `w-${width}`,
        `min-w-${width}`,
        {
          'tags-field--active': tagsFieldFocused,
        },
      ];
    },
    // list() {
    //   return Array.isArray(this.value);
    // },
  },
  watch: {
    tagsList() {
      // Handle external updates of the tag value. We do this by tracking the
      // current value of the tags field in a data attribute, and then comparing
      // watched changes of the `value` prop to the value we're tracking with
      // the tags field input. If it changes, then we have an external change
      // that wasn't prompted by changes within the component.
      this.tags = [...this.tagsList];
    },
    value(value) {
      this.tags = value;
    },
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
        // Add the new tag into the tags array
        // and emit tag input
        this.tags.push(tag);
        // Set newTag back to empty string
        this.newTag = '';
        this.emitTagChange();

        // eslint-disable-next-line no-unused-expressions
        $event && $event.preventDefault();
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
    /**
     * Remove tag from tags list
     */
    handleRemoveTag(index) {
      // Remove tag from tags array
      const tag = this.tags.splice(index, 1);
      this.emitTagChange();
      this.$emit('remove', tag);
      return tag;
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
      this.tags.pop();
      this.emitTagChange();
    },
    /**
     * Emits tag/option input event
     */
    emitTagChange() {
      /**
       * Emitted the tag is input
       * @event input
       * @type {$event}
       */
      this.$emit('input', this.tags);
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
    shadow-sm
    cursor-pointer
    z-50;

  &:focus,
  &:active,
  &--active {
    @apply transition duration-150 border-gray-500 shadow-light-focus;
  }

  &:hover {
    @apply transition duration-150 border-gray-400;
  }

  &:disabled {
    @apply opacity-50 transition-opacity duration-150;
  }

  &__tag,
  &__input-wrapper {
    @apply whitespace-no-wrap pl-1 mt-1;
  }

  &__tag {
    > * {
      @apply block mt-px;
    }
  }

  &__input-wrapper {
    @apply relative;

    input {
      @apply absolute top-0 bg-transparent w-48 pl-2;
    }
  }

  &__input-autogrow {
    @apply invisible inline-block;

    // Give a reasonable amount of max-width so the placeholder doesn't look squished up against the edge
    min-width: 6rem;
  }

  &__list-wrapper {
    @apply flex items-center justify-start px-2 pt-2 pb-3 flex-wrap;
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

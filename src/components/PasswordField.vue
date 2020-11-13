<template>
  <div class="password-field">
    <ChecFormField
      :append-label="showHideText"
      @action-click="toggleShowPassword"
    >
      <TextField
        v-bind="{...$attrs, ...textFieldProps}"
        :type="fieldType"
        @input="e => $emit('input', e)"
      />
      <div v-if="showPasswordStrength" class="password-field__strength" :class="strengthClass" />
    </ChecFormField>
  </div>
</template>

<script>
import ChecFormField from './ChecFormField.vue';
import TextField from './TextField.vue';

export default {
  name: 'PasswordField',
  components: {
    ChecFormField,
    TextField,
  },
  inheritAttrs: false,
  props: {
    /**
     * Default boolean value used for show/hide password state, false by default
     */
    initialShowPassword: Boolean,
    /**
     * Boolean indicating whether to show password strength indicator
     */
    showPasswordStrength: Boolean,
    /**
     * Strength of password from 0-4
     */
    passwordStrengthScore: Number,
    /**
     * all props below are passed down to <text-field>
     */
    /**
     * The state of the text field. One of "disabled", "error".
     */
    variant: {
      type: String,
      default: '',
    },
    /**
     * Class to pass to inner input element
     */
    innerInputClass: {
      type: String,
      default: '',
    },
    /**
     * Label for input
     */
    label: {
      type: String,
      default: '',
    },
    /**
     * Additional input attributes that should be applied to the native input
     */
    additionalInputAttributes: {
      type: Object,
      default: () => ({}),
    },
    /**
     * Whether to show the "hide/show password" action button
     */
    hideShowButton: Boolean,
  },
  data() {
    return {
      showPassword: this.initialShowPassword,
    };
  },
  computed: {
    /**
     * @returns {string}
     */
    showHideText() {
      if (this.hideShowButton) {
        return '';
      }
      return `${this.showPassword ? 'hide' : 'show'} password`;
    },
    /**
     * @returns {string}
     */
    fieldType() {
      return this.showPassword ? 'text' : 'password';
    },
    /**
     * Contextual highlight classes per strength score
     *
     * @returns {string}
     */
    strengthClass() {
      const score = this.passwordStrengthScore;
      if (!score) {
        return '';
      }
      if (score < 2) {
        return 'password-field__strength--invalid';
      }
      if (score < 3) {
        return 'password-field__strength--bad';
      }
      if (score < 4) {
        return 'password-field__strength--good';
      }
      return 'password-field__strength--great';
    },
    /**
     * props to be passed to text-field
     */
    textFieldProps() {
      const {
        variant, innerInputClass, label, additionalInputAttributes,
      } = this;
      return {
        variant,
        innerInputClass,
        label,
        additionalInputAttributes,
      };
    },
  },
  methods: {
    /**
     * Toggles password type with type text to show password
     */
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style lang="scss">
.password-field {
  @apply relative;

  &__strength {
    @apply
      absolute
      left-0
      transform
      -translate-y-1
      w-0
      h-1
      bg-transparent
      rounded-bl
      transition-all
      duration-300
      ease-in-out;

    &--invalid {
      @apply bg-red-300 w-1/4;
    }

    &--bad {
      @apply bg-orange-300 w-2/4;
    }

    &--good {
      @apply bg-green-300 w-3/4;
    }

    &--great {
      @apply bg-green-400 w-full rounded-br;
    }
  }
}
</style>

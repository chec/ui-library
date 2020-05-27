
<template>
  <div class="relative">
    <TextField
      class="passworld-field"
      v-bind="{...$attrs, ...$props}"
      :type="fieldType"
      :actionLabel="showHideText"
      @actionClick="toggleShowPassword"
      @input="e => $emit('input', e)"
    />
    <div v-if="showPasswordStrength" class="password-strength" :class="strengthClass" />
  </div>
</template>
<script>
import TextField from './TextField.vue';

export default {
  name: 'PasswordField',
  components: {
    TextField,
  },
  data() {
    return {
      showPassword: this.initialShowPassword,
    };
  },
  props: {
    /**
     * Default boolean value used for show/hide password state, false by default
     */
    initialShowPassword: {
      type: Boolean,
      default: false,
    },
    /**
     * Boolean indicating whether to show password strength indicator
     */
    showPasswordStrength: {
      type: Boolean,
      default: false,
    },
    /**
     * Strength of password from 0-4
     */
    passwordStrengthScore: {
      type: Number,
      default: null,
    },
  },
  computed: {
    /**
     * @returns {string}
     */
    showHideText() {
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
      if (!score && score !== 0) {
        return '';
      }
      if (score < 2) {
        return 'password-strength--invalid';
      }
      if (score < 3) {
        return 'password-strength--bad';
      }
      if (score < 4) {
        return 'password-strength--good';
      }
      return 'password-strength--great';
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
  .password-strength {
    @apply
      absolute
      left-0
      transform
      -translate-y-1
      w-full
      h-1
      bg-transparent
      rounded-bl
      transition
      delay-300
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
</style>

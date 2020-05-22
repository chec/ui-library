<template>
  <TextField
    v-bind="{...$attrs, ...$props}"
    :type="passwordType"
    :actionLabel="showHideText"
    @onActionClick="toggleShowPassword"
  />
</template>
<script>
import TextField from './TextField.vue';

export default {
  name: 'PasswordTextField',
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
  },
  computed: {
    isPasswordType() {
      return this.$attrs.type === 'password';
    },
    showHideText() {
      return `${this.showPassword ? 'hide' : 'show'} password`;
    },
    passwordType() {
      return this.showPassword ? 'text' : 'password';
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

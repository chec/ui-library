<template>
    <div
        class="radio-btn"
        :class="{ 'active' : isChecked, 'disabled' : disabled }"
    >
        <input
            type="radio"
            :id="value"
            :name="name"
            :value="value"
            :checked="isChecked"
            :disabled="disabled"
            class="radio-btn__input"
            @input="handleInput"
        />
        <span class="radio-btn__fill"></span>
        <label :for="value" class="radio-btn__container">
            <div class="radio-btn__content">
                <!--  Custom label slot (bind 'label' string, 'isChecked' boolean, 'disabled' boolean -->
                <slot name="label" v-bind="{ label, isChecked, disabled }">
                <div v-if="label" class="radio-btn__label">{{ label }}</div>
                </slot>
            </div>
        </label>

    </div>
</template>

<script>

export default {
  name: 'RadioButton',
  model: {
    prop: 'selected',
    event: 'input',
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: String,
      default: '',
    },
  },
  computed: {
    isChecked() {
      return this.value === this.selected;
    },
  },
  methods: {
    handleInput() {
      this.$emit('input', this.value);
    },
  },
};

</script>

<style lang="scss">

.radio-btn {
    display: flex;
    font-size: 16px;
    cursor: pointer;
    position: relative;

    &.active {
        background-color: #fff;
    }

    // Hides browser's default radio style
    &__input{
        position: absolute;
        // opacity: 0;
        padding: 10px;
        z-index: 2;
        margin: 0;
        width: 100%;
        height: 100%;

        &:focus {
            outline: none;
        }
    }

    &:hover{
        @apply border-gray-500;
    }

    &:active{
        @apply border-gray-600 bg-gray-300;
    }


    &__container {
        flex: 1;
        display: flex;
        cursor: pointer;
        padding: 10px;
        background: transparent;
    }

    &__content {
        flex: 1;
    }

    &__label {
        @apply flex font-lato text-sm text-gray-600;
    }
}

</style>

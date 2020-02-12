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
        event: 'input'
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
            default: false
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
        }
    },
    methods: {
        handleInput() {
            this.$emit('input', this.value);
        }
    }
}

</script>

<style lang="scss">

.radio-btn {
    display: flex;
    font-size: 16px;

    &.active{
        color: 1px solid red;
    }

    &__input{
        // position: absolute;
        // opacity: 0;
    }

    &__container {
        flex: 1;
        display: flex;
        cursor: pointer;
    }

    &__content {
        flex: 1;
    }

    &__label {
        display: flex;
        font-size: 15px;
    }
}

</style>
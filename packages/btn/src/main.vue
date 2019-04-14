<template>
  <button
      class="el-btn"
      @click="handleClick"
      :disabled="buttonDisabled || loading"
      :autofocus="autofocus"
      :type="nativeType"
      :class="[
        type ? 'el-button--' + type : '',
        buttonSize ? 'el-button--' + buttonSize : '',
        {
            'is-loading': loading,
            'is-disabled': buttonDisabled,
            'is-plain': plain,
            'is-round': round,
            'is-circle': circle,
        }
      ]"
  >
      <i class="el-icon-loading" v-if="loading"></i>
      <i :class="icon" v-if="icon && !loading"></i>
      <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>

<script>
export default {
  name: 'ElBtn',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean
  },
  computed: {
    buttonSize() {
      return this.size;
    },
    buttonDisabled() {
      return this.disabled;
    }
  },
  mounted() {

  },
  methods: {
    handleClick(evt) {
      this.$emit('click', evt);
    }
  }
};
</script>

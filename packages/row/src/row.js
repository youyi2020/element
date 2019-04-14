export default {
  // 组件名称，注意是驼峰命名法，这使得实际使用组件时短横线连接法<el-row>和驼峰法<ElRow>都可以使用
  name: 'ElRow',
  // 自定义属性(该属性不是component必需属性)
  componentName: 'ElRow',
  // 组件的props
  props: {
    tag: { // 组件渲染成html的实际标签，默认是div
      type: String,
      default: 'div'
    },
    gutter: Number, // 该组件的里面的<el-col>组件的间隔
    /* 组件是否是flex布局，将 type 属性赋值为 'flex'，可以启用 flex 布局，
    *  并可通过 justify 属性来指定 start, center, end, space-between, space-around
    *  其中的值来定义子元素的排版方式。
    */
    type: String,
    justify: { // flex布局的justify属性
      type: String,
      default: 'start'
    },
    align: { // flex布局的align属性
      type: String,
      default: 'top'
    }
  },

  computed: {
    // row的左右margin，用于抵消col的padding，后面详细解释，注意是计算属性，这里通过gutter计算出实际margin
    style() {
      const ret = {};

      if (this.gutter) {
        ret.marginLeft = `-${this.gutter / 2}px`;
        ret.marginRight = ret.marginLeft;
      }

      return ret;
    }
  },

  render(h) {
    // 渲染函数
    return h(this.tag, {
      class: [
        'el-row',
        this.justify !== 'start' ? `is-justify-${this.justify}` : '',
        this.align !== 'top' ? `is-align-${this.align}` : '',
        { 'el-row--flex': this.type === 'flex' }
      ],
      style: this.style
    }, this.$slots.default);
  }
};

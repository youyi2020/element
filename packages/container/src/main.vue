<template>
  <section class="el-container" :class="{ 'is-vertical': isVertical }">
    <slot></slot>
  </section>
</template>

<script>
  // componentName 自定义属性，其他组件会用到
  export default {
    name: 'ElContainer',

    componentName: 'ElContainer',

    props: {
      direction: String
    },

    computed: {
      isVertical() {
        console.log(this.$slots.default);
        console.log(this.$slots);
        if (this.direction === 'vertical') {
          return true;
        } else if (this.direction === 'horizontal') {
          return false;
        }
        // this.$slots.default返回了所有没有被包含在具名插槽中的子元素
        // some高阶函数的使用，这里就是要在所有子元素中查看是否存在<el-header>或者<el-footer>,some所遍历的数组只要有一个为true，则整体返回true
        // 而every则是要所有都是true才返回true
        return this.$slots && this.$slots.default
          ? this.$slots.default.some(vnode => {
            // VNode是虚拟dom中的虚拟节点，当组件被编译时，每个<...>就会生成一个虚拟的节点
            const tag = vnode.componentOptions && vnode.componentOptions.tag;
            return tag === 'el-header' || tag === 'el-footer';
          })
          : false;
      }
    }
  };
</script>

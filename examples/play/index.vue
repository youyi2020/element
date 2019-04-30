<template>
  <div style="margin: 20px;">
    <el-button type="success" round>你好</el-button>
    <!--<el-btn size="small" round @click="handleClick">世界</el-btn>-->
    <!--<el-button-group>-->
        <!--<el-button type="success" round>你好</el-button>-->
        <!--<el-button type="success" round>你好</el-button>-->
        <!--<el-button type="success" round>你好</el-button>-->
    <!--</el-button-group>-->
    <el-container>
        <el-header>1</el-header>
        <el-footer>2</el-footer>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        input: 'Hello Element UI!'
      };
    },
    mounted(){

    },
    methods : {
      handleClick(evt){
        console.log('click')
      }
    }
  };
</script>

<style>
    .bg-purple {
        background: #d3dce6;
    }
</style>

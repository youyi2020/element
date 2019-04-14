<template>
  <div style="margin: 20px;">
    <!--<el-button type="success" round>你好</el-button>-->
    <!--<el-btn size="small" round @click="handleClick">世界</el-btn>-->
    <!--<el-button-group>-->
        <!--<el-button type="success" round>你好</el-button>-->
        <!--<el-button type="success" round>你好</el-button>-->
        <!--<el-button type="success" round>你好</el-button>-->
    <!--</el-button-group>-->
    <el-row :gutter="20">
        <el-col :span="6"><div class="grid-content bg-purple">1</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">2</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">3</div></el-col>
        <el-col :span="6"><div class="grid-content bg-purple">4</div></el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        input: 'Hello Element UI!'
      };
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

<template>
  <div>
    testPage
    <el-tag v-permission="['admin']">admin</el-tag>

  <!-- Editor can see this -->
  <el-tag v-permission="['editor']">editor</el-tag>

  <!-- Editor can see this -->
  <el-tag v-permission="['admin','editor']">Both admin or editor can see this</el-tag>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
export default{
  directives: { permission }
}
</script>

<style>

</style>

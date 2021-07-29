<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="普通列表" name="list">
        <el-table
        border
    :data="list"
    stripe
    style="width: 100%">
    <el-table-column
      prop="id"
      label="权限 ID"
      width="180">
    </el-table-column>
    <el-table-column
      prop="authName"
      label="权限名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="pid"
      label="父级权限ID"
      width="200">
    </el-table-column>
  </el-table>
    </el-tab-pane>
    <el-tab-pane label="树状表格" name="tree">
          <el-table
    :data="list"
    style="width: 100%"
    stripe
    height="400"
    row-key="id"
    border
    lazy
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column
      prop="id"
      label="权限 ID"
      width="180">
    </el-table-column>
    <el-table-column
      prop="authName"
      label="权限名称"
      width="180">
    </el-table-column>
    
    <el-table-column
      prop="pid"
      label="父级权限ID"
      width="180">
    </el-table-column>
  </el-table>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list:[],
      activeName:'list'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(){
      let obj = {
        who:'list',
        type:this.activeName
      }
      this.$axios.Rights(obj).then(res => {
        if(res.data.meta.status ===200){
          this.list = res.data.data
        }
      })
    },
    handleClick(){//切换显示状态
      this.init()
    }
  },
}
</script>

<style>

</style>
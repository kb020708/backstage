<template>
  <div>
    <el-card class="box-card">
      <el-table :data="data" border stripe style="width: 100%; margin: 0 auto">
      <el-table-column>
        <!-- eslint-disable-next-line -->
        <template slot-scope="scope" slot="header" >

          <el-button
            type="primary"
            size="small"
            class="pppp"
            @click="dialogFormVisible2 = true"
            >添加用户</el-button
          >

          <el-dialog
            title="添加用户"
            :visible.sync="dialogFormVisible2"
            width="30%"
            @close="close2"
          >
            <el-form :model="form2" :rules="rules" ref="form2">
              <el-form-item
                label="角色名"
                :label-width="formLabelWidth"
                prop="roleName"
              >
                <el-input v-model="form2.roleName" autocomplete="off"></el-input>
              </el-form-item>
                            <el-form-item
                label="角色描述"
                :label-width="formLabelWidth"
                prop="roleDesc"
              >
                <el-input v-model="form2.roleDesc" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible2 = false">取 消</el-button>
              <el-button
                type="primary"
                @click="onSubmite2('form2')"
                >确 定</el-button
              >
            </div>
          </el-dialog>
        </template>
        <el-table-column label="角色名" prop="roleName" width="200">
        </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" width="200">
        </el-table-column>
        <el-table-column label="操作" width="330">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row), (drawer = true)"
              >分配权限</el-button
            >
            <el-button
              size="mini"
              @click="changeMsg(scope.row), (dialogFormVisible = true)"
              >修改信息</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer
      :title="info.roleName"
      :visible.sync="drawer"
      :direction="direction"
    >
      <div class="demo-drawer__content">
        <el-tree
          ref="tree"
          :data="rightList"
          show-checkbox
          node-key="id"
          :default-expanded-keys="needCheck"
          :default-checked-keys="Checked"
          :props="defaultProps"
        >
        </el-tree>
      </div>
      <div class="demo-drawer__footer">
        <el-button type="info" @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="sure()">确定</el-button>
      </div>
    </el-drawer>

    <el-dialog
      title="编辑角色"
      :visible.sync="dialogFormVisible"
      width="30%"
      @close="closeDialog"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item
          label="角色名"
          :label-width="formLabelWidth"
          prop="roleName"
        >
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="(dialogFormVisible = false), onSubmite('form')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [], //角色列表
      rightList: [], //权限列表
      defaultProps: {
        children: "children",
        label: "authName",
      },
      drawer: false,
      direction: "rtl",
      needCheck: [], //需要展开的id集合
      Checked: [], //默认选中id集合
      info: {},
      rightArr: [], //获取分配后的权限
      dialogFormVisible: false,
      form: {
        roleName: "",
        roleDesc: "",
      },
      changeID: "",
      formLabelWidth: "120px",
      rules: {
        roleName: [
          { required: true, message: "角色名不能为空", trigger: "blur" },
        ],
      },
      dialogFormVisible2: false,
      form2: {
        roleName: "",
        roleDesc: "",
      },
    };
  },
  mounted() {
    this.init();
    this.getRights();
  },
  methods: {
    changeMsg(v) {
      this.form.roleName = v.roleName;
      this.form.roleDesc = v.roleDesc;
      this.changeID = v.id;
    },
    onSubmite(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.id = this.changeID;
          this.form.who = "change";
          this.$axios.roles(this.form).then((res) => {
            if (res.data.meta.status === 200) {
              this.$message({
                type: "success",
                message: "更新成功",
              });
              this.init();
              this.$refs[form].resetFields(); //重置表单
            }
          });
        }
      });
    },
    sure() {
      this.rightArr = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys(),
      ];
      let rids = this.rightArr.join(",");
      let roleId = this.info.id;
      let obj = {
        roleId,
        rids,
        who: "author",
      };
      this.$axios.Rights(obj).then((value) => {
        console.log(value);
        if (value.data.meta.status === 200) {
          this.drawer = false;
          this.init();
        }
      });
    },
    handleEdit(row) {
      this.needCheck = [];
      this.Checked = [];
      this.info = row;
      this.findId(row);
      this.getRights();
    },
    handleDelete(row) {
      //删除角色
      let obj = {
        id:'',
        who:"delete"
      }
      obj.id = row.id
      this.$axios.roles(obj).then(res =>{
        if(res.data.meta.status === 200){
          this.$message({
            type:"success",
            message:res.data.meta.msg
          })
          this.init()
        }
      })

    },
    init() {
      //角色列表
      let obj = {
        who: "list",
      };
      this.$axios.roles(obj).then((value) => {
        this.data = value.data.data;
      });
    },
    getRights() {
      let obj = {
        who: "list",
        type: "tree",
      };
      this.$axios.Rights(obj).then((res) => {
        this.rightList = res.data.data;
      });
    },
    findId(v) {
      this.needCheck.push(v.id);
      if (v.children) {
        v.children.forEach((ele) => {
          this.findId(ele);
        });
      } else {
        this.Checked.push(v.id);
      }
    },

    closeDialog() {
      this.$refs["form"].resetFields(); //重置表单
    },
    close2(){
      this.$refs["form2"].resetFields();
    },
    onSubmite2(form) {
      this.$refs[form].validate(valid =>{
        if(valid){
          this.form2.who = "add"
          this.$axios.roles(this.form2).then(res => {
            if(res.data.meta.status===201){
              this.$message({
                type: "success",
                message: res.data.meta.msg,
              });
              this.dialogFormVisible2 = false
              this.init()
              this.$refs["form2"].resetFields();
            }
          })
        }
      })
    },
  },
};
</script>

<style>
.demo-drawer__footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.pppp{
  float: right;
  margin-right: 100px;
}
.el-card{
  overflow: auto;
}
</style>
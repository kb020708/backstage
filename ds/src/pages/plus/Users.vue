<template>
  <div class="users">
    <el-table
      :data="userList.users"
      stripe
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column>
        <!-- eslint-disable-next-line -->
        <template slot-scope="scope" slot="header">
          <el-input
            v-model="search"
            @input="srch"
            size="mini"
            style="width: 150px;padding-right: 50px;"
            placeholder="请输入用户名搜索"
          />
          <el-button
            type="primary"
            size="small"
            @click="dialogFormVisible = true"
            >添加用户</el-button
          >

          <el-dialog
            title="添加用户"
            :visible.sync="dialogFormVisible"
            width="30%"
            @close="closeDialog"
          >
            <el-form :model="form" :rules="rules" ref="form">
              <el-form-item
                label="用户名"
                :label-width="formLabelWidth"
                prop="username"
              >
                <el-input v-model="form.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="密码"
                :label-width="formLabelWidth"
                prop="password"
              >
                <el-input v-model="form.password" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="邮箱"
                prop="email"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="手机号"
                prop="mobile"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.mobile" autocomplete="off"></el-input>
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
        </template>
        <el-table-column prop="role_name" label="角色" width="150">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="150">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="180">
        </el-table-column>
        <el-table-column
          prop="create_time"
          :formatter="timestampToTime"
          label="注册时间"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="185">
        </el-table-column>
        <el-table-column label="权限" width="186">
          <template slot-scope="scope">
            <el-switch
              @change="mode(scope.row.id, scope.row.mg_state)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          > -->

            <el-dropdown trigger="click" @command="handleCommand">
              <el-button
                type="primary"
                size="mini"
                @click="changeRole(scope.$index, scope.row)"
              >
                分配角色<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="[scope.row.id, v]"
                  v-for="(v, k) in role"
                  :key="k"
                  >{{ v.roleName }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      hide-on-single-page
      :current-page="userList.pagenum"
      :page-sizes="[5, 10]"
      :page-size="Number(obj.pagesize)"
      layout="total, sizes, prev, pager, next, jumper"
      :total="Number(userList.total)"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      obj: {
        pagenum: 1,
        pagesize: 5,
      },
      search: "",
      role: [],
      dialogFormVisible: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: "",
        // who: "addUser",
      },
      formLabelWidth: "120px",
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    // this.$axios.Users({ params: this.obj, who: "list" }).then((value) => {
    //   this.userList = value.data.data;
    // });
    this.init(this.obj);
  },
  methods: {
    init({ pagenum, pagesize }) {
      let obj = {
        pagenum,
        pagesize,
        who: "list",
      };
      this.$axios.Users(obj).then((value) => {
        // console.log(value);
        this.userList = value.data.data;
      });
    },
    handleEdit(index, row) {
      // console.log(index, row);
    },
    handleDelete(id) {
      // console.log(id);
      let obj = {
        who: "deleteUser",
        id,
      };
      this.$axios.Users(obj).then((res) => {
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.init(this.obj);
          this.$message({
            message: "删除成功",
            type: "success",
          });
        }
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.obj.pagesize = val;
      this.obj.who = "list";
      // console.log(this.obj);

      // console.log(this.obj);
      this.init(this.obj);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.obj.pagenum = val;
      this.obj.who = "list";
      // console.log(this.obj);

      this.init(this.obj);
    },
    timestampToTime(row, column) {
      var date = new Date(row.create_time * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h = date.getHours() + ":";
      var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    mode(id, v) {
      this.$axios.modeStatus(id, v).then((value) => {
        // console.log(value);
      });
    },
    srch(v) {
      // console.log(v);
      // console.log(this.userList.users.user);
      if (!v == "") {
        for (let j = 0; j < this.userList.users.length; j++) {
          if (this.userList.users[j].username == v) {
            // console.log(j);
            // console.log(this.userList.users[j].id);
            this.$axios.searchUser(this.userList.users[j].id).then((value) => {
              // console.log(value);
              if (value.data.meta.status === 200) {
                // console.log(this.userList);
                let id = value.data.data.id;
                let arr = this.userList.users.filter((item) => item.id == id);
                // console.log(this.userList.users,arr);
                this.userList.total = 1;
                this.userList.users = arr;
              }
            });
          }
        }
      } else {
        this.$axios.Users({ params: this.obj, who: "list" }).then((value) => {
          // console.log(value);
          this.userList = value.data.data;
          // console.log(this.userList.users);
        });
      }
    },
    handleCommand([k, command]) {
      // console.log(k,command.id);
      let obj = {
        who: "fp",
        id: k,
        rid: command.id,
      };
      this.$axios.Users(obj).then((value) => {
        // console.log(value);
        this.init(this.obj);
      });
    },
    changeRole(v, k) {
      // console.log(k);
      this.$axios.roles({ who: "list" }).then((value) => {
        // console.log(value);
        this.role = value.data.data;
      });
    },
    onSubmite(formData) {
      this.$refs[formData].validate((valid) => {
        if (valid) {

          // console.log(this.$axios.Users)
          this.form.who="addUser"
          this.$axios.Users(this.form).then((res) => {
            console.log(res);
            if (res.data.meta.status === 201) {
              this.$message({
                message: "添加成功",
                type: "success",
              });
              this.init(this.obj);
              this.$refs[formData].resetFields(); //重置表单
            }
          });
        } else {
          this.$message.error("请重新输入");
          this.dialogFormVisible = true;
        }
      });
    },
    closeDialog() {
      this.$refs["form"].resetFields(); //重置表单
    },
  },
};
</script>

<style>
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
table div {
  text-align: center;
}
.users {
  overflow: auto;
}
.el-pagination {
  text-align: center;
  margin-top: 20px;
}


</style>
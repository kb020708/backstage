<template>
  <div>
    <el-card class="box-card">
      <el-alert
        title="参数添加说明"
        type="warning"
        show-icon
        description="只能在第三级分类上添加参数，点击添加在当前选中分类上添加动态/静态参数。注意：添加动态参数值需要填写值的选项，以逗号分隔。
        如：“49吋4K超薄曲面 人工智能 , 55吋4K观影曲面 30核HDR”"
        style="margin-bottom: 30px"
      >
      </el-alert>
      <el-cascader
        v-model="selected"
        :options="options"
        :show-all-levels="false"
        :props="props"
        @change="getcheck"
      ></el-cascader>
      <el-button
        type="primary"
        style="float: right; margin-right: 130px"
        @click="dialogFormVisible = true"
      >
        添加参数
      </el-button>

      <el-dialog
        title="添加参数"
        :visible.sync="dialogFormVisible"
        width="40%"
        @close="close()"
      >
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item
            label="参数名称"
            :label-width="formLabelWidth"
            prop="attr_name"
          >
            <el-input v-model="form.attr_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="参数值"
            :label-width="formLabelWidth"
            prop="attr_vals"
          >
            <el-input
              v-model="form.attr_vals"
              autocomplete="off"
              type="textarea"
              :rows="4"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close()">取 消</el-button>
          <el-button type="primary" @click="sure('form')">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
    <el-card>
      <el-tabs
        tab-position="left"
        style="height: 360px"
        @tab-click="handleclick"
        v-model="activeName"
      >
        <el-tab-pane label="动态参数" name="many">
          <el-table :data="many" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-card class="box-card2">
                  <div slot="header">
                    <span>{{ scope.row.attr_name }}</span>
                  </div>
                  <div
                    v-for="o in toarr(scope.row.attr_vals)"
                    :key="o"
                    class="text item"
                  >
                    {{ o }}
                  </div>
                </el-card>
              </template>
            </el-table-column>
            <el-table-column label="ID" prop="attr_id"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
                <el-dialog
                  title="编辑参数"
                  :visible.sync="dialogFormVisible2"
                  width="40%"
                  @close="close2()"
                >
                  <el-form :model="form2" :rules="rules2" ref="form2">
                    <el-form-item
                      label="参数名称"
                      :label-width="formLabelWidth"
                      prop="attr_name"
                    >
                      <el-input
                        v-model="form2.attr_name"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="参数值"
                      :label-width="formLabelWidth"
                      prop="attr_vals"
                    >
                      <el-input
                        v-model="form2.attr_vals"
                        autocomplete="off"
                        type="textarea"
                        :rows="4"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="close2()">取 消</el-button>
                    <el-button type="primary" @click="submit(scope.row)"
                      >确 定</el-button
                    >
                  </div>
                </el-dialog>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态参数" name="only">
          <el-table :data="only" style="width: 100%">
            <el-table-column label="ID" prop="attr_id"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="参数" prop="attr_vals"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
                <el-dialog
                  title="编辑参数"
                  :visible.sync="dialogFormVisible2"
                  width="40%"
                  @close="close2()"
                >
                  <el-form :model="form2" :rules="rules2" ref="form2">
                    <el-form-item
                      label="参数名称"
                      :label-width="formLabelWidth"
                      prop="attr_name"
                    >
                      <el-input
                        v-model="form2.attr_name"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="参数值"
                      :label-width="formLabelWidth"
                      prop="attr_vals"
                    >
                      <el-input
                        v-model="form2.attr_vals"
                        autocomplete="off"
                        type="textarea"
                        :rows="4"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="close2()">取 消</el-button>
                    <el-button type="primary" @click="submit(scope.row)"
                      >确 定</el-button
                    >
                  </div>
                </el-dialog>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      obj: {
        who: "list",
      },
      options: [],
      selected: [1, 3, 6],
      props: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      activeName: "many",
      only: [],
      many: [],
      dialogFormVisible: false,
      form: {
        attr_name: "",
        attr_vals: "",
      },
      formLabelWidth: "190px",
      rules: {
        attr_name: [
          { required: true, message: "参数名称不能为空", trigger: "blur" },
        ],
      },
      dialogFormVisible2: false,
      form2: {
        attr_name: "",
        attr_vals: "",
      },
      formLabelWidth: "190px",
      rules2: {
        attr_name: [
          { required: true, message: "新参数名不能为空", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.afteraxios();
  },
  methods: {
    init() {
      this.obj.who = "list";
      this.$axios.Cate(this.obj).then((res) => {
        this.options = res.data.data;
      });
    },
    getcheck(v) {
      //级联选择
      this.viewselect();
    },
    handleclick(v) {
      //选项卡
      this.viewselect();
    },
    viewselect() {
      let id = this.selected[2] ? this.selected[2] : this.selected[1];
      let obj = {
        id,
        sel: this.activeName,
        who: "attr",
      };

      this.$axios.Cate(obj).then((res) => {
        if (res.data.meta.status === 200) {
          if (this.activeName === "only") {
            this.only = res.data.data;
          } else {
            this.many = res.data.data;
          }
        }
      });
    },

    handleEdit(v) {
      //编辑
      this.form2.attr_name = v.attr_name;
      this.form2.attr_vals = v.attr_vals;
      this.dialogFormVisible2 = true;
    },
    submit(v) {
      //提交编辑后的参数
      this.form2.id = v.cat_id;
      this.form2.attr_id = v.attr_id;
      this.form2.attr_sel = this.activeName;
      this.form2.who = "editAttr";
      this.$axios.Cate(this.form2).then((res) => {
        if (res.data.meta.status === 200) {
          this.dialogFormVisible2 = false;
          this.$message({
            type: "success",
            message: "更新成功",
          });
          this.afteraxios();
        }
      });
    },
    handleDelete(v) {
      //删除
      let obj = {
        who: "delete",
        id: v.cat_id,
        attr_id: v.attr_id,
      };
      this.$axios.Cate(obj).then((res) => {
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.afteraxios();
        }
      });
    },
    afteraxios() {
      this.init();
      this.viewselect();
    },
    toarr(v) {
      return v.split(",");
    },
    sure(formdata) {
      this.$refs[formdata].validate((valid) => {
        if (valid) {
          let id = this.selected[2];
          this.form.who = "add";
          this.form.id = id;
          this.form.attr_sel = this.activeName;
          this.$axios.Cate(this.form).then((res) => {
            if (res.data.meta.status === 201) {
              this.dialogFormVisible = false;
              this.$message({
                message: "创建成功",
                type: "success",
              });
              this.$refs["form"].resetFields(); //重置表单
              this.afteraxios();
            }
          });
        }
      });
    },
    close() {
      this.dialogFormVisible = false;
      this.$refs["form"].resetFields();
    },
    close2() {
      this.dialogFormVisible2 = false;
      this.$refs["form2"].resetFields();
    },
  },
};
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card2 {
  width: 480px;
}
</style>
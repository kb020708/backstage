<template>
  <div>
    <el-card class="box-card">
      <el-table
        :data="cateList"
        style="width: 100%"
        row-key="cat_id"
        border
        lazy
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column>
          <!-- eslint-disable-next-line -->
          <template slot-scope="scope" slot="header">
            <el-button
              type="primary"
              size="small"
              style="float: right; margin-right: 280px"
              @click="drawer = true"
            >
              添加分类
            </el-button>
            <el-drawer
              title="添加分类"
              :visible.sync="drawer"
              direction="rtl"
              @close="resetForm"
            >
              <el-alert
                type="warning"
                description="如果要添加1级分类，则父分类Id应该设置为  `0`"
                show-icon
              >
              </el-alert>
              <el-form
                label-position="right"
                label-width="120px"
                :model="formLabelAlign"
                style="margin-top: 100px"
                :rules="srules"
                ref="formLabelAlign"
              >
                <el-form-item label="父级分类ID" prop="cat_pid">
                  <el-input
                    v-model="formLabelAlign.cat_pid"
                    style="width: 250px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="分类层级" prop="cat_level"  >
                  <el-input
                    v-model="formLabelAlign.cat_level"
                    style="width: 250px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="cat_name">
                  <el-input
                    v-model="formLabelAlign.cat_name"
                    style="width: 250px"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm()"
                    >立即创建</el-button
                  >
                  <el-button @click="resetForm()">重置</el-button>
                </el-form-item>
              </el-form>
            </el-drawer>
          </template>
          <el-table-column prop="cat_name" label="分类名称" width="180">
          </el-table-column>
          <el-table-column prop="cat_id" label="分类ID" width="180">
          </el-table-column>
          <el-table-column prop="cat_level" label="分类层级" width="180" :formatter="level">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="" size="mini" @click="edit(scope.row)">
                编辑
              </el-button>
              <el-button type="danger" size="mini" @click="delet(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[2, 5]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <el-dialog
        title="编辑分类名称"
        :visible.sync="dialogFormVisible"
        width="35%"
      >
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item
            label="名称"
            :label-width="formLabelWidth"
            prop="cat_name"
          >
            <el-input v-model="form.cat_name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="esc()">取 消</el-button>
          <el-button
            type="primary"
            @click="(dialogFormVisible = false), submit()"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      obj: {
        pagenum: 1,
        pagesize: 2,
      },
      total: 1,
      cateList: [],
      currentPage: 1,
      dialogFormVisible: false,
      form: {
        cat_name: "",
      },
      formLabelWidth: "120px",
      rules: {
        cat_name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
      },
      drawer: false,
      formLabelAlign: {
        cat_name: "",
        cat_pid: "",
        cat_level: "",
      },
      srules: {
        cat_pid: [{ required: true, message: "父ID不能为空", trigger: "blur" }],
        cat_name: [
          { required: true, message: "分类名不能为空", trigger: "blur" },
        ],
        cat_level: [
          { required: true, message: "分类层级不能为空", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.obj.who = "list";
      this.$axios.Cate(this.obj).then((res) => {
        this.cateList = res.data.data.result;
        this.total = res.data.data.total;
      });
    },
    edit(v) {
      //编辑
      this.form.cat_name = v.cat_name;
      this.form.id = v.cat_id;
      this.dialogFormVisible = true;
    },
    delet(v) {
      //删除
      let obj = {
        id: v.cat_id,
        who: "deleteClass",
      };
      this.$axios.Cate(obj).then((res) => {
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.init();
        }
      });
    },
    handleSizeChange(v) {
      this.obj.pagesize = v;
      this.init();
    },
    handleCurrentChange(v) {
      this.obj.pagenum = v;
      this.init();
    },
    submit() {
      console.log(this.form);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.who = "edit";
          this.$axios.Cate(this.form).then((res) => {
            console.log(res);
            if (res.data.meta.status === 200) {
              this.init();
              this.$refs["form"].resetFields();
            }
          });
        }
      });
    },
    esc() {
      this.dialogFormVisible = false;
      this.$refs["form"].resetFields();
    },
    submitForm() {
      this.$refs["formLabelAlign"].validate((valid) => {
        if (valid) {
          this.formLabelAlign.who = "addClass";
          this.$axios.Cate(this.formLabelAlign).then((res) => {
            if (res.data.meta.status === 201) {
              this.$message({
                type: "success",
                message: "添加成功",
              });
              this.init();
              this.drawer = false;
              this.$refs["formLabelAlign"].resetFields();
            }
          });
        }
      });
    },
    resetForm() {
      this.$refs["formLabelAlign"].resetFields();
    },
    level(v,k){
      if(v.cat_level===0){
        return "第一级"
      }else if(v.cat_level===1){
        return "第二级"
      }else {
        return "第三级"
      }
    }
  },
};
</script>

<style>
</style>
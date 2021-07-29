<template>
  <div>
    <el-table :data="goodsList" style="width: 100%">
      <el-table-column>
        <!-- eslint-disable-next-line -->
        <template slot-scope="scope" slot="header">
          <el-button
            type="primary"
            size="small"
            style="float: right; margin-right: 280px"
            @click="add(), init2()"
          >
            添加分类
          </el-button>
          <el-drawer
            :title="what"
            :visible.sync="drawer"
            direction="rtl"
            @close="resetForm"
          >
            <el-form
              label-position="right"
              label-width="120px"
              :model="form"
              style="margin-top: 100px"
              :rules="rules"
              ref="form"
            >
              <el-form-item label="商品名" prop="goods_name">
                <el-input
                  v-model="form.goods_name"
                  style="width: 250px"
                ></el-input>
              </el-form-item>
              <el-form-item label="分类" prop="goods_cat">
                <el-cascader
                  :options="options"
                  :props="setProps"
                  v-model="form.goods_cat"
                  style="width: 250px"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="价格" prop="goods_price">
                <el-input
                  v-model="form.goods_price"
                  style="width: 250px"
                ></el-input>
              </el-form-item>
              <el-form-item label="数量" prop="goods_number">
                <el-input
                  v-model="form.goods_number"
                  style="width: 250px"
                ></el-input>
              </el-form-item>
              <el-form-item label="重量" prop="goods_weight">
                <el-input
                  v-model="form.goods_weight"
                  style="width: 250px"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品介绍" prop="goods_introduce">
                <el-input
                  v-model="form.goods_introduce"
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
        <el-table-column prop="goods_name" label="商品名" width="250">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="100">
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="100">
        </el-table-column>
        <el-table-column prop="goods_weight" label="重量" width="100">
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="添加时间"
          :formatter="timestampToTime"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="upd_time"
          label="更新时间"
          :formatter="timestampToTime"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="is_promote"
          label="是否热销"
          :formatter="promote"
          width="120"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="edit(scope.row), init2()"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" @click="delet(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="obj.pagenum"
      :page-sizes="[5, 10, 20]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      obj: {
        pagenum: 1,
        pagesize: 5,
      },
      goodsList: [],
      total: 1,
      drawer: false,
      form: {
        goods_name: "",
        goods_number: "",
        goods_cat: [],
        goods_price: "",
        goods_weight: "",
        goods_introduce: "",
      },
      setProps: {
        label: "cat_name",
        expandTrigger: "hover",
        value: "cat_id",
      },
      rules: {
        goods_name: [
          { required: true, message: "商品名不能为空", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "商品数量不能为空", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "商品分类不能为空", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "商品价格不能为空", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "商品重量不能为空", trigger: "blur" },
        ],
      },
      options: [],
      what: "添加商品",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      (this.obj.who = "list"),
        this.$axios.Goods(this.obj).then((res) => {
          this.goodsList = res.data.data.goods;
          this.total = res.data.data.total;
        });
    },
    init2() {
      let obj = {
        who: "list",
      };
      this.$axios.Cate(obj).then((res) => {
        this.options = res.data.data;
      });
    },
    promote(v, k) {
      return v.is_promote ? "热销" : "非热销";
    },
    submitForm() {
      //提交表单
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.what == "添加商品") {
            this.form.goods_cat = this.form.goods_cat.toString();
            this.form.who = "add";
          } else {
            this.form.id = this.form.goods_id;
            this.form.goods_cat = this.form.goods_cat.toString();
            this.form.who = "edit";
          }
          this.$axios.Goods(this.form).then((res) => {
            console.log(res);
            let msg = res.data.meta.msg;
            if (res.data.meta.status === 201 ||res.data.meta.status === 200) {
              this.$message({
                type: "success",
                message: msg,
              });
              this.init();
              this.drawer = false;
              this.$refs["form"].resetFields(); //重置表单
            }
          });
        }
      });
    },
    resetForm() {
      //关闭表单
      this.$refs["form"].resetFields(); //重置表单
    },
    add() {
      //新增
      this.what = "添加商品";
      this.drawer = true;
    },
    edit(v) {
      //编辑
      this.what = "编辑商品";
      this.form = v;
      this.drawer = true;
    },
    delet(v){//删除
      let obj = {
        id : v.goods_id,
        who :"delete"
      }
      this.$axios.Goods(obj).then(res => {
        console.log(res);
        if(res.data.meta.status===200){
          let message = res.data.meta.msg
          this.$message({
            type:"success",
            message,
          })
          this.init()
        }
      })
    },
    handleSizeChange(v) {
      //每页个数变化
      this.obj.pagesize = v;
      this.init();
    },
    handleCurrentChange(v) {
      //页码变化
      this.obj.pagenum = v;
      this.init();
    },

    timestampToTime(row, column) {
      let time = row.add_time ? row.add_time : row.upd_time;
      var date = new Date(time * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
  },
};
</script>

<style>
</style>
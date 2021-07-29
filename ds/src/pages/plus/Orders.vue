<template>
  <div>
    <el-table :data="list" stripe style="width: 100%" border>
      <el-table-column prop="user_id" label="用户 ID" width="80">
      </el-table-column>
      <el-table-column
        prop="pay_status"
        label="支付状态"
        width="100"
        :formatter="tostatus"
      >
      </el-table-column>
      <el-table-column
        prop="order_pay"
        label="支付方式"
        width="100"
        :formatter="topay"
      >
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="100">
      </el-table-column>
      <el-table-column prop="order_fapiao_title" label="个人/公司" width="120">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        width="180"
        :formatter="timestampToTime"
      >
      </el-table-column>
      <el-table-column
        prop="update_time"
        label="更新时间"
        width="180"
        :formatter="timestampToTime"
      >
      </el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="lookAdd(scope.row)">
            查看物流
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="changeadr(scope.row), (dialogFormVisible = true)"
            >修改地址</el-button
          >
          <el-button type="primary" size="mini" @click="changeStat(scope.row)"
            >修改状态</el-button
          >
        </template>
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
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form">
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-cascader
            v-model="form.consignee_addr"
            :options="options"
            @change="handleChange"
          ></el-cascader>
          <el-input
            type="textarea"
            placeholder="请输入镇/街道"
            v-model="form.textarea"
            maxlength="30"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="物流信息" :visible.sync="dialogVisible" width="30%">
      <span>{{ text }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-drawer
      title="修改订单状态"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      @close="cancelForm"
    >
      <div class="demo-drawer__content">
        <el-form :model="form" ref="form2">
          <el-form-item
            label="发货状态"
            :label-width="formLabelWidth2"
            prop="is_send"
          >
            <el-input
              v-model="form2.is_send"
              autocomplete="off"
              style="width: 250px"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="支付状态(0 未付款、1 已付款)"
            :label-width="formLabelWidth2"
            prop="pay_status"
          >
            <el-input
              v-model="form2.pay_status"
              autocomplete="off"
              style="width: 250px"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="支付方式(0 未支付,1 支付宝,2 微信,3 银行卡)"
            :label-width="formLabelWidth2"
            prop="order_pay"
          >
            <el-input
              v-model="form2.order_pay"
              autocomplete="off"
              style="width: 250px"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="订单价格"
            :label-width="formLabelWidth2"
            prop="order_price"
          >
            <el-input
              v-model="form2.order_price"
              autocomplete="off"
              style="width: 250px"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer" style="text-align: center">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="submit()">确定</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import citydata from "../../assets/js/citydata";
export default {
  data() {
    return {
      obj: {
        pagenum: 1,
        pagesize: 5,
      },
      list: [],
      total: 1,
      dialogFormVisible: false,
      form: {
        consignee_addr: "",
        textarea: "",
      },
      options: [],
      formLabelWidth: "130px",
      formLabelWidth2: "180px",
      dialogVisible: false,
      text: "暂无物流信息",
      dialog: false,
      form2: {
        is_send: "",
        order_pay: "",
        order_price: "",
        pay_status: "",
      },
    };
  },
  mounted() {
    this.init();
    this.options = citydata;
  },
  methods: {
    init() {
      //渲染列表
      this.obj.who = "list";
      this.$axios.Orders(this.obj).then((res) => {
        if (res.data.meta.status === 200) {
          this.list = res.data.data.goods;
          this.total = res.data.data.total;
        }
      });
    },
    handleChange(v) {
      //地址联动变化
      console.log(v);
    },
    handleSizeChange(v) {
      //每页个数改变
      this.obj.pagesize = v;
      this.init();
    },
    handleCurrentChange(v) {
      //页码改变
      this.obj.pagenum = v;
      this.init();
    },
    lookAdd(v) {
      console.log(v);
      this.dialogVisible = true;
      let obj = {
        id: v.order_id,
        who: "addr",
      };
    },
    cancelForm() {
      this.$refs["form2"].resetFields();
    },
    changeadr(v) {
      //修改地址
      console.log(v);
    },
    changeStat(v) {
      //修改订单状态
      this.form2.is_send = v.is_send;
      this.form2.order_pay = v.order_pay;
      this.form2.order_price = v.order_price;
      this.form2.pay_status = v.pay_status;
      this.form2.id = v.order_id;
      this.dialog = true;
    },
    delet(v) {
      //删除
      console.log(v);
    },
    submit() {
      this.form2.who = "stat";
      this.$axios.Orders(this.form2).then((res) => {});
      this.dialog = false;
    },
    tostatus(v, k) {
      //付款与否
      let { status } = v;
      return status == 0 ? "未付款" : "已付款";
    },
    topay(v, k) {
      //支付方式
      let { order_pay } = v;
      switch (order_pay) {
        case "0":
          return "未支付";
          break;

        case "1":
          return "支付宝";
          break;

        case "2":
          return "微信";
          break;

        case "3":
          return "银行卡";
          break;

        default:
          break;
      }
    },
    timestampToTime(v, k) {
      //转换时间戳为日期格式
      let time = v.create_time ? v.create_time : v.update_time;
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
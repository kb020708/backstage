<template>
  <div class="login">
    <el-card>
    <h2>xxx后台管理系统</h2>

    <el-form
      :label-position="labelPosition"
      label-width="80px"
      :model="formLabelAlign"
      size="small "
    >
      <el-form-item label="账号">
        <el-input v-model="formLabelAlign.name" placeholder="账号" clearable ></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formLabelAlign.region" placeholder="密码"  type="password" clearable show-password></el-input>
      </el-form-item>

      <el-button type="primary" size="small" @click="login()" class="loginBtn"
        >登录</el-button
      >
    </el-form>
    </el-card>
  </div>
</template>

<script>
// import {mapMutations} from 'vuex'
export default {
  data() {
    return {
      labelPosition: "right",
      formLabelAlign: {
        name: "",
        region: '',
      },
    };
  },
  mounted() {
  },
  methods: {
    // ...mapMutations(["setUser"]),
    login() {
      var obj = {
        username: this.formLabelAlign.name,
        password: this.formLabelAlign.region,
      };
      this.$axios.Login(obj).then(value => {
        console.log(value);
        if (value.data.meta.status === 200) {
          this.$message({
            message: "成功登录",
            type: "success",
          });
          let token = value.data.data.token;
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("user",JSON.stringify(value.data.data))
          // this.setUser(value.data.data)
          this.$router.push("/main");
        }else{
             this.$message.error(value.data.meta.msg);
        }
      });
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
h2 {
  margin: 30px auto;
  color: #333;
  font-weight: 500;
}
form > div > div {
  width: 220px;
}
form {
  padding-bottom: 30px;
}
.login {
  width: 400px;
  position: relative;
  left: 50%;
  top: 45%;
  margin: 200px 0 0 -200px;
  text-align: center;
border: 3px solid;
border-image: -webkit-linear-gradient( rgb(94, 28, 28), blue) 30 30;
border-image: -moz-linear-gradient( red, blue) 30 30;
border-image: linear-gradient( rgb(142, 247, 255), rgb(216, 250, 191)) 30 30;
}
.loginBtn {
  width: 240px;
}
</style>
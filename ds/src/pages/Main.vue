<template>
  <div class="m">
    <!-- <div class="topNav">欢迎来到管理系统!</div> -->

    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
    >
      <el-dropdown class="header" placement="top-end" @command="exit">
        <el-avatar
          :size="50"
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        ></el-avatar>
        <el-dropdown-menu slot="dropdown" class="dropd">
          <el-dropdown-item icon="el-icon-circle-close" command="a"
            >退出登录</el-dropdown-item
          >
          <el-dropdown-item icon="el-icon-user">{{
            usermsg.username
          }}</el-dropdown-item>
          <el-dropdown-item icon="el-icon-message">{{
            usermsg.email
          }}</el-dropdown-item>
          <el-dropdown-item icon="el-icon-mobile-phone">{{
            usermsg.mobile
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>
    <div class="box">
      <div class="left">
        <el-menu
          :default-active="activeIndex2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu v-for="(v, k) in arr" :key="k" :index="String(k)">
            <template slot="title">
              <i :class="icon[k]"></i>
              <span slot="title">{{ arr[k].authName }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                :index="String(k) + '-' + String(j)"
                v-for="(i, j) in arr[k].children"
                :key="j"
                @click="test(i)"
              >
                <i :class="icon2[k][j]"></i>
                {{ arr[k].children[j].authName }}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
      <div class="right">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-tag
              v-for="(v, k) in tags"
              :key="k"
              closable
              :type="tagType[k]"
              @click="go(v, k)"
              @close="close(v, k)"
              class="tag"
            >
              {{ v.authName }}
            </el-tag>
          </div>

          <router-view class="content"></router-view>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState } from "vuex";
export default {
  // computed: {
  //   ...mapState(["info"]),
  // },
  data() {
    return {
      isCollapse: false,
      activeIndex2: "0-0",
      arr: [],
      icon: [
        "el-icon-user",
        "el-icon-s-order",
        "el-icon-s-shop",
        "el-icon-s-claim",
        "el-icon-s-data",
      ],
      icon2: [
        ["el-icon-s-custom"],
        ["el-icon-user", "el-icon-s-flag"],
        ["el-icon-goods", "el-icon-question", "el-icon-document"],
        ["el-icon-tickets"],
        ["el-icon-notebook-1"],
      ],
      tags: [],
      tagType: [],
      usermsg: {},
    };
  },
  mounted() {
    this.usermsg = this.$store.state;
    let token = sessionStorage.getItem("token");
    this.$axios.Nav().then((value) => {
      this.arr = value.data.data;
      this.tags.push(value.data.data[0].children[0]);
      this.tagType.push("");
    });
    this.$router.push("/main/users");
  },
  created() {
    if (sessionStorage.getItem("user")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("user"))
        )
      );
    }
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("user", JSON.stringify(this.$store.state));
    });
  },

  methods: {
    exit(v) {
      if (v=='a') {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        this.$router.push("/");
      }
    },
    handleOpen(key, keyPath) {
      //   console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      //   console.log(key, keyPath);
    },

    test(i) {
      // console.log(i);
      if (!this.tags.includes(i)) {
        this.tags.push(i);

        for (let j = 0; j < this.tagType.length; j++) {
          if (this.tagType[j] === "") {
            this.tagType.splice(j, 1, "info");
          }
        }

        this.tagType.push("");
      } else {
        for (let j = 0; j < this.tagType.length; j++) {
          if (this.tagType[j] === "") {
            this.tagType.splice(j, 1, "info");
          }
        }
        for (let j = 0; j < this.tags.length; j++) {
          if (this.tags[j].authName === i.authName) {
            this.tagType[j] = "";
          }
        }
      }
      // console.log(this.tagType);
      this.$router.push(i.path);
    },
    go(v, i) {
      // console.log(v,i);
      // console.log(this.arr);
      this.$router.push(v.path);
      for (let j = 0; j < this.tagType.length; j++) {
        if (this.tagType[j] === "") {
          this.tagType.splice(j, 1, "info");
        }
      }
      // console.log(this.tagType);
      this.tagType[i] = "";

      for (let i = 0; i < this.arr.length; i++) {
        for (let m = 0; m < this.arr[i].children.length; m++) {
          if (this.arr[i].children[m].authName === v.authName)
            // console.log(this.arr[i].children[m]);
            // console.log(i,m);
            this.activeIndex2 = i + "-" + m;
          // console.log(this.activeIndex2);
        }
      }
    },
    close(v, j) {
      if (this.tags.length > 1) {
        for (let i = 0; i < this.tags.length; i++) {
          if (this.tags[i] === v) {
            this.tags.splice(i, 1);
            if (this.tagType[i] === "") {
              this.tagType.splice(i - 1, 1, "");
              this.tagType.splice(i, 1);
              this.$router.push(this.tags[i - 1].path);
            } else {
              this.tagType.splice(i, 1);
            }
          }
        }
      }else{
        this.$message.error('最少打开一个标签')
      }
    },
  },
};
</script>

<style>
.topNav {
  width: 100%;
  height: 50px;
  line-height: 50px;
  color: #fefefe;
  font-size: 16px;
  text-indent: 100px;
  background: #0ba1e7;
}
.el-menu-demo,
.el-menu-demo li,
.el-menu-demo div {
  height: 10vh !important;
  line-height: 10vh !important;
}
.box {
  display: flex;
  height: 89vh;
}

.left {
  flex: 1;
  height: 89vh;
}
.left > ul {
  height: 89vh;
}
.right {
  flex: 6;
}
.tag {
  cursor: pointer;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.content {
  height: 73vh;
  overflow: auto;
}
.el-menu-demo .header {
  padding-right: 14vw;
  display: flex;
  padding-top: 1.5vh;
}
.header span {
  margin-left: auto;
}
html .dropd {
  margin-right: 5vw;
  margin-top: -1.5vh !important;
}

html {
  overflow-y: scroll;
}

:root {
  overflow-y: auto;
  overflow-x: hidden;
}

:root body {
  position: absolute;
}

body {
  width: 100vw;
  overflow: hidden;
}
</style>
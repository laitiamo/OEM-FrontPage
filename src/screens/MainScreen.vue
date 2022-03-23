<template>
  <el-container class="main-container">
    <el-header>
      <el-menu
        :default-active="$route.path"
        v-if="windowWidth >= 720"
        class="el-menu-demo"
        background-color="#001d3d"
        text-color="#fff"
        active-text-color="#fff"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-button
          class="menu-button"
          @click="submenuTrigger"
          type="text"
          :icon="CollapseIcon"
          v-if="windowWidth >= 720"
        ></el-button>
        <span class="logo-text">在线学习系统</span>
        <el-menu-item
          :index="$route.path"
          @click="loginOutHander"
          style="float: right"
        >
          <i class="el-icon-switch-button" />退出登陆</el-menu-item
        >
        <el-menu-item
          @click="loginExam"
          style="float: right;margin-right: 50px;"
        >
          <i class="el-icon-s-management" />进入考试端</el-menu-item
        >
      </el-menu>
      <el-menu
        :default-active="$route.path"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#001d3d"
        text-color="#fff"
        active-text-color="#fff"
        @select="handleSelect"
        v-if="windowWidth < 720"
      >
        <el-button
          title="移动端标题栏"
          class="menu-button"
          @click="submenuTrigger"
          type="text"
          :icon="CollapseIcon"
        ></el-button>
        <el-submenu style="float: right" index="8">
          <template slot="title">你好，{{ role }}</template>
          <el-menu-item
            style="text-align: center"
            index="8-1"
            @click="loginOutHander"
            ><i class="el-icon-switch-button" />退出登陆</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="auto" v-if="windowWidth >= 720">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo left-menu"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
          :router="true"
        >
          <el-menu-item index="/oem/home">
            <i class="el-icon-house"></i>
            <span slot="title" class="menu-title">系统主页</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title" class="menu-title">功能菜单</span>
            </template>
            <template v-if="roleId === 3">
              <el-menu-item index="/oem/video">课程视频</el-menu-item>
              <el-menu-item index="/oem/upload">提交作业</el-menu-item>
              <el-menu-item index="/oem/mine">作业记录</el-menu-item>
            </template>
            <template v-if="roleId !== 3">
              <el-menu-item index="/oem/subject">新增章节</el-menu-item>
              <el-menu-item index="/oem/source">上传附件</el-menu-item>
              <el-menu-item index="/oem/workform">发布作业</el-menu-item>
              <el-menu-item index="/oem/review">批阅作业</el-menu-item>
              <el-menu-item index="/oem/query-sign">查看签到情况</el-menu-item>
              <el-menu-item index="/oem/query-stu">管理学生作业</el-menu-item>
            </template>
          </el-submenu>
          <template v-if="roleId == 1 || roleId == 2">
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-user"></i>
                <span slot="title" class="menu-title">用户管理</span>
              </template>
              <el-menu-item index="/oem/manage-stu">学生管理</el-menu-item>
              <el-menu-item index="/oem/manage-tea" v-if="roleId === 1"
                >教师管理</el-menu-item
              >
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-receiving"></i>
                <span slot="title" class="menu-title">数据管理</span>
              </template>
              <el-menu-item index="/oem/manage-sub">课程管理</el-menu-item>
              <el-menu-item index="/oem/manage-source">资源管理</el-menu-item>
              <el-menu-item index="/oem/work">作业管理</el-menu-item>
            </el-submenu>
          </template>
          <template v-if="roleId == 1">
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-upload"></i>
                <span slot="title" class="menu-title">数据导入</span>
              </template>
              <el-menu-item index="/oem/import-stu">学生导入</el-menu-item>
              <el-menu-item index="/oem/import-tea">教师导入</el-menu-item>
            </el-submenu>
          </template>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span slot="title" class="menu-title">系统设置</span>
            </template>
            <el-menu-item index="/oem/password">修改密码</el-menu-item>
          </el-submenu>
        </el-menu></el-aside
      >
      <el-container style="height: auto">
        <el-main>
          <el-drawer
            title="移动端菜单栏"
            :visible.sync="isCollapse"
            :with-header="false"
            direction="ltr"
            size="50%"
            v-if="windowWidth < 720"
          >
            <el-menu
              :default-active="$route.path"
              class="left-menu"
              @select="mobileMenuSelect"
              @open="handleOpen"
              @close="handleClose"
              :collapse="false"
              :router="true"
              :unique-opened="true"
            >
              <el-menu-item index="/oem/home">
                <i class="el-icon-house"></i>
                <span slot="title" class="menu-title">系统主页</span>
              </el-menu-item>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span slot="title" class="menu-title">功能菜单</span>
                </template>
                <template v-if="roleId === 3">
                  <el-menu-item index="/oem/video">课程视频</el-menu-item>
                  <el-menu-item index="/oem/upload">提交作业</el-menu-item>
                  <el-menu-item index="/oem/mine">作业记录</el-menu-item>
                </template>
                <template v-if="roleId !== 3">
                  <el-menu-item index="/oem/subject">新增章节</el-menu-item>
                  <el-menu-item index="/oem/source">上传附件</el-menu-item>
                  <el-menu-item index="/oem/workform">发布作业</el-menu-item>
                  <el-menu-item index="/oem/review">批阅作业</el-menu-item>
                  <el-menu-item index="/oem/query-sign"
                    >查看签到情况</el-menu-item
                  >
                  <el-menu-item index="/oem/query-stu"
                    >管理学生作业</el-menu-item
                  >
                </template>
              </el-submenu>
              <template v-if="roleId == 1 || roleId == 2">
                <el-submenu index="3">
                  <template slot="title">
                    <i class="el-icon-user"></i>
                    <span slot="title" class="menu-title">用户管理</span>
                  </template>
                  <el-menu-item index="/oem/manage-stu">学生管理</el-menu-item>
                  <el-menu-item index="/oem/manage-tea" v-if="roleId === 1"
                    >教师管理</el-menu-item
                  >
                </el-submenu>
                <el-submenu index="4">
                  <template slot="title">
                    <i class="el-icon-receiving"></i>
                    <span slot="title" class="menu-title">数据管理</span>
                  </template>
                  <el-menu-item index="/oem/manage-sub">课程管理</el-menu-item>
                  <el-menu-item index="/oem/manage-source"
                    >资源管理</el-menu-item
                  >
                  <el-menu-item index="/oem/work">作业管理</el-menu-item>
                </el-submenu>
              </template>
              <template v-if="roleId == 1">
                <el-submenu index="5">
                  <template slot="title">
                    <i class="el-icon-upload"></i>
                    <span slot="title" class="menu-title">数据导入</span>
                  </template>
                  <el-menu-item index="/oem/import-stu">学生导入</el-menu-item>
                  <el-menu-item index="/oem/import-tea">教师导入</el-menu-item>
                </el-submenu>
              </template>
              <el-submenu index="6">
                <template slot="title">
                  <i class="el-icon-setting"></i>
                  <span slot="title" class="menu-title">系统设置</span>
                </template>
                <el-menu-item index="/oem/password">修改密码</el-menu-item>
              </el-submenu>
            </el-menu>
          </el-drawer>
          <router-view
        /></el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import { initHome, logout } from "../api";
import { mapGetters } from "vuex";
export default {
  name: "HomeScreen",
  data() {
    return {
      isCollapse: false,
      CollapseIcon: "el-icon-s-fold",
      windowWidth: document.documentElement.clientWidth, //实时屏幕宽度
    };
  },
  watch: {
    windowWidth(val) {
      let that = this;
      //closeDebug console.log("实时屏幕宽度：", val, that.windowHeight);
    },
  },

  computed: {
    ...mapGetters([
      "name", //用户名
      "username",
      "role",
      "roleId",
      "genderId",
      //如果是学生的话还有以下参数
      "grade",
      "major",
      "college",
      "l_class",
    ]),
  },
  mounted() {
    //进入时进行用户信息初始化
    this.init();
    var that = this;
    // <!--把window.onresize事件挂在到mounted函数上-->
    window.onresize = () => {
      return (() => {
        window.fullWidth = document.documentElement.clientWidth;
        that.windowWidth = window.fullWidth; // 宽
      })();
    };
    if (document.documentElement.clientWidth < 720) {
      //closeDebug console.log("触发移动端布局");
      this.CollapseIcon = "el-icon-s-unfold";
    }
  },
  methods: {
    //初始化角色
    init() {
      let _this = this;
      initHome()
        .then((res) => {
          //closeDebug console.log("-----------主页初始化---------------");
          if (res.code === 0) {
            // _this.$notify({
            //   title: "登陆成功",
            //   message: "欢迎回来",
            //   type: 'success'
            // });
            let obj = JSON.parse(res.msg);
            //closeDebug console.log("用户信息解析", obj);
            this.$store.commit("initUserInfo", {
              roleId: obj.l_roleId, //角色
              name: obj.l_name, //用户姓名
              reviewer: obj.l_name, //审阅人姓名
              username: obj.l_username, //用户编号
              role: obj.l_role, //用户角色
              genderId: obj.l_genderId, //性别
              //如果是学生的话还有以下参数
              grade: obj.l_grade, //年级
              major: obj.l_major, //专业
              l_genderId: obj.l_genderId, //性别
              l_class: obj.l_class, //班级
            });
          } else {
            _this.$notify({
              title: "未能读取到个人信息",
              message: "请重新登陆",
              type: "warning",
            });
            _this.$router.push({ path: "/" });
          }
        })
        .catch((failResponse) => {});
    },
    submenuTrigger() {
      this.isCollapse = !this.isCollapse;
      this.CollapseIcon = this.isCollapse
        ? "el-icon-s-unfold"
        : "el-icon-s-fold";
    },
    handleOpen(key, keyPath) {
      //closeDebug console.log("侧边菜单打开了", key, keyPath);
    },
    handleClose(key, keyPath) {
      //closeDebug console.log("侧边菜单关闭了", key, keyPath);
    },
    handleSelect(key, keyPath) {
      //closeDebug console.log("顶部菜单选中了", key, keyPath);
    },
    mobileMenuSelect(key, keyPath) {
      this.isCollapse = false;
    },
    loginExam() {
      let _this = this;
      this.$confirm(
        "即将进入考试模式，网课系统登录状态将会失效。是否确认?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        logout()
          .then((res) => {
            //closeDebug console.log("退出登陆", res);
            if (res.code === 0) {
              _this.$message({
                showClose: true,
                message: res.msg,
                type: "success",
              });
              //设置登陆状态
              // _this.$store.commit("setLoginState", false);
            } else {
              _this.$message({
                showClose: true,
                message: res.msg,
                type: "error",
              });
            }
          })
          .catch((failResponse) => {});
        setTimeout(function() {
          //跳转到百度
          window.location.href = "http://exam.844307947.xyz/";
        }, 1000);
      });
    },
    loginOutHander() {
      let _this = this;
      logout()
        .then((res) => {
          //closeDebug console.log("退出登陆", res);
          if (res.code === 0) {
            _this.$message({
              showClose: true,
              message: res.msg,
              type: "success",
            });
            //设置登陆状态
            // _this.$store.commit("setLoginState", false);
          } else {
            _this.$message({
              showClose: true,
              message: res.msg,
              type: "error",
            });
            _this.changeCode();
          }
        })
        .catch((failResponse) => {});
      setTimeout(function() {
        _this.$router.push({ path: "/" });
      }, 1000);
    },
  },
};
</script>
<style>
.logo {
  float: left;
  font-weight: 800;
  font-size: 36px;
  color: #9b9b9bbe;
}
.logo-text {
  margin-left: 10px;
  float: left;
  font-size: 22px;
  color: rgb(255, 255, 255);
}
.main-container {
  height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  border-right: 0;
}
.el-header {
  background-color: #001d3d;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-aside {
  background-color: #ffffff;
  color: rgb(71, 71, 71);
  text-align: left;
  line-height: 300px;
  display: flex;
  flex-direction: column;
}
.bottom-link {
  text-decoration: none;
}
/* 未访问的链接 */
.bottom-link:link {
  color: #a0a0a0;
}

/* 已访问的链接 */
.bottom-link:visited {
  color: #7c7c7c;
}
.el-main {
  background-color: #fafaff;
  color: #333;
}
.menu-title {
  font-weight: 600;
}

.menu-button {
  float: left !important;
  color: rgb(255, 255, 255) !important;
  margin: 15px 10px 0px 0px !important;
  padding: 0px !important;
  font-size: 28px !important;
}
</style>

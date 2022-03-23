<template>
  <el-card class="error-box">
    <div class="error-page">
      <img src="../assets/img/404.png" v-if="windowWidth >= 720"/>
      <div class="error-desc">啊哦~ 你所访问的页面不存在</div>
      <div class="error-handle">
        <router-link to="/oem/home">
          <el-button type="primary" size="large">点击此处返回首页</el-button>
        </router-link>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      windowWidth: document.documentElement.clientWidth, //实时屏幕宽度
    };
  },
  watch: {
    windowWidth(val) {
      //closeDebug console.log("实时屏幕宽度：", val, that.windowHeight);
    },
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        window.fullWidth = document.documentElement.clientWidth;
        this.windowWidth = window.fullWidth; // 宽
      })();
    };
  },
};
</script>

<style scoped>
.error-box {
  display: flex;
  flex-direction: column;
  margin: 40px 40px;
  padding: 30px 5% 40px 5%;
  border-radius: 6px;
  background: rgb(249 247 247 / 70%);
  box-shadow: 1px 1px 20px 10px rgb(80 80 80 / 21%);
}
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 80px 40px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.error-code span {
  color: #2d8cf0;
}
.error-desc {
  font-size: 30px;
  color: #777;
}
.error-handle {
  margin-top: 30px;
  padding-bottom: 200px;
}
.error-btn {
  margin-left: 100px;
}
</style>

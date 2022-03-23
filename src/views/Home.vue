<template>
  <div class="home">
    <el-row
      :gutter="16"
      :xs="24"
      type="flex"
      style="flex-wrap: wrap"
      justify="center"
    >
      <el-col :md="24" :lg="7">
        <WelCome
          :name="name"
          :username="username"
          :role="role"
          :roleId="roleId"
          :l_class="l_class"
          :genderId="genderId"
          :windowWidth="windowWidth"
        />
      </el-col>
      <el-col :md="24" :lg="17" v-if="windowWidth >= 720">
        <CounterDetail
          :SubjectNum="SubjectNum"
          :WorkNum="WorkNum"
          :VideoNum="VideoNum"
          :StudentWorkNum="StudentWorkNum"
        />
        </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Inform from "../components/Inform.vue";
import WelCome from "../components/WelCome.vue";
import CounterDetail from "../components/CounterDetail.vue";
export default {
  name: "Home",
  data() {
    return {
      windowWidth: document.documentElement.clientWidth, //实时屏幕宽度
    };
  },
  watch: {
    windowWidth(val) {
      let that = this;
      //closeDebug console.log("实时屏幕宽度：", val, that.windowHeight);
    },
  },
  components: {
    WelCome,
    Inform,
    CounterDetail
},
  methods: {
  },
  mounted() {
    // <!--把window.onresize事件挂在到mounted函数上-->
    window.onresize = () => {
      return (() => {
        window.fullWidth = document.documentElement.clientWidth;
        this.windowWidth = window.fullWidth; // 宽
      })();
    };
    if (document.documentElement.clientWidth < 720) {
      //closeDebug console.log("触发移动端布局");
    }
  },
  computed: {
    ...mapGetters([
      "name",
      "username",
      "role",
      "genderId",
      "l_class",
      "roleId",
    ]),
  },
};
</script>

<style></style>

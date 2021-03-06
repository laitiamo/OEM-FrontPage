import Vue from "vue";
import VueRouter from "vue-router";
import LoginScreen from "../screens/LoginScreen.vue";
import MainScreen from "../screens/MainScreen.vue";
import { checkState } from "../api/index";
import { Message } from "element-ui";

Vue.use(VueRouter);

// TODO 正式部署时全部改为懒加载模式可以加快加载速度

const routes = [
  {
    path: "/",
    name: "LoginScreen",
    component: LoginScreen,
  },
  {
    path: "/oem",
    name: "MainScreen",
    component: MainScreen,
    children: [
      {
        // 当 /oem/home 匹配成功，
        // Home 会被渲染在 MainScreen 的 <router-view> 中
        path: "home",
        component: () => import("../views/Home"),
      },
      {
        path: "upload",
        component: () => import("../views/Upload"),
      },
      {
        path: "work",
        component: () => import("../views/Work"),
      },
      {
        path: "video",
        component: () => import("../views/Video"),
      },
      {
        path: "video:id",
        component: () => import("../components/VideoPage"),
      },
      {
        path: "subject",
        component: () => import("../components/newVideoForm"),
      },
      {
        path: "workform",
        component: () => import("../components/WorkForm"),
      },
      {
        path: "source",
        component: () => import("../components/SourceForm"),
      },
      {
        path: "mine",
        component: () => import("../views/Mine"),
      },
      {
        path: "review",
        component: () => import("../views/Review"),
      },
      {
        path: "password",
        // which is lazy-loaded when the route is visited.
        // 使用时导入，类似懒加载
        component: () => import("../views/Password"),
      },
      {
        path: "query-stu",
        component: () => import("../views/QueryStu"),
      },
      {
        path: "manage-stu",
        component: () => import("../views/ManageStu"),
      },
      {
        path: "manage-tea",
        component: () => import("../views/ManageTea"),
      },
      {
        path: "manage-sub",
        component: () => import("../views/ManageSub"),
      },
      {
        path: "query-sign",
        component: () => import("../views/ManageSign"),
      },
      {
        path: "manage-class",
        component: () => import("../views/ManageClass"),
      },
      {
        path: "manage-source",
        component: () => import("../views/ManageSource"),
      },
      {
        path: "import-stu",
        component: () => import("../views/ImportStu"),
      },
      {
        path: "import-tea",
        component: () => import("../views/ImportTea"),
      },
    ],
  },
  {
    path: "/404",
    component: () => import("../views/404.vue"),
  },
  {
    path: "*",
    redirect: "/404",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.path !== "/") {
    // //closeDebug console.log("登陆状态",store.state.ifLogin)
    // next();
    let ifLogin = false;
    checkState()
      .then((res) => {
        //closeDebug console.log("登陆状态检测请求成功", res);
        ifLogin = true;
      })
      .catch((err) => {
        //closeDebug console.log("登陆状态检测请求失败", err);
      })
      .finally(() => {
        if (!ifLogin) {
          router.push({ name: "LoginScreen" });
          Message.error({
            message: "未登陆或登陆信息已过期，请重新登陆",
          });
        } else {
          next();
        }
      });
  } else {
    next();
  }
});

export default router;

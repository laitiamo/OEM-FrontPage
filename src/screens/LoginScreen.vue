<template>
  <div class="login">
    <transition name="el-fade-in-linear" appear>
      <div class="login-box">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="rules"
          status-icon
          :label-width="label_date.width"
          class="login-form"
        >
          <h3 class="login-title">网课系统登录</h3>
          <el-form-item :label="label_date.user" prop="username">
            <el-input
              v-model.number="loginForm.username"
              placeholder="Username"
            ></el-input>
          </el-form-item>
          <el-form-item :label="label_date.pwd" prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              autocomplete="off"
              placeholder="Password"
            ></el-input>
          </el-form-item>
          <el-form-item :label="label_date.cap" prop="captcha">
            <div class="captcha-input-container">
              <el-input
                v-model="loginForm.captcha"
                placeholder="Verify"
                autocomplete="off"
                @keyup.enter.native="submitForm('loginForm')"
              ></el-input>
              <img
                class="captcha-img"
                src=""
                ref="code"
                alt="verify"
                @click="changeCode"
              />
            </div>
          </el-form-item>
          <el-form-item label-width="0px">
            <el-button
              icon="el-icon-s-custom"
              type="primary"
              @click="submitForm('loginForm')"
              style="width:100%;"
              >登陆</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </transition>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/display.css";
//导入封装好的login请求
import { login, getCaptcha } from "../api/index";
// @ is an alias to /src
//登陆页
export default {
  name: "LoginScreen",
  data() {
    //自定义前端验证规则
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var validateUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    var validateCap = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };
    return {
      label_date: {
        width: "60px",
        user: "账号",
        pwd: "密码",
        cap: "验证码",
      },
      //表单数据
      loginForm: {
        password: "",
        username: "",
        captcha: "",
      },
      //校验规则
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        username: [{ validator: validateUser, trigger: "blur" }],
        captcha: [{ validator: validateCap, trigger: "blur" }],
      },
    };
  },
  mounted() {
    // 得到验证码图片
    this.changeCode();
    //closeDebug console.log("mounted!");
    if (document.documentElement.clientWidth < 390) {
      //closeDebug console.log("触发移动端布局");
      this.label_date = {
        width: "0px",
        user: "",
        pwd: "",
        cap: "",
      };
    }
  },
  methods: {
    //点击登陆，提交表单
    submitForm(formName) {
      let _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //前端校验通过后，进行登陆操作
          let params = new URLSearchParams();
          params.append("username", this.loginForm.username);
          params.append("password", this.loginForm.password);
          params.append("captcha", this.loginForm.captcha);
          login(params)
            .then((res) => {
              //closeDebug console.log("-----------获取登录信息---------------");
              //closeDebug console.log(res);
              if (res.code === 0) {
                _this.$notify({
                  title: res.msg,
                  message: "欢迎使用",
                  type: "success",
                });
                //设置登陆状态
                //_this.$store.commit("setLoginState", true);
                setTimeout(function() {
                  _this.$router.push({ path: "/oem/home" });
                }, 1000);
              } else {
                _this.$message({
                  message: res.msg,
                  type: "error",
                });
                _this.changeCode();
              }
            })
            .catch((failResponse) => {});
        } else {
          //前端校验未通过
          //closeDebug console.log("error submit!!");
          return false;
        }
      });
    },
    //获取随机数作来生成验证码
    getCaptchaKey() {
      let captchaKey = Math.random();
      return captchaKey;
    },
    //刷新验证码
    changeCode() {
      let _this = this;
      let captcha_key = this.getCaptchaKey();
      //此接口传入的是blob格式数据，再渲染至窗口
      getCaptcha(captcha_key)
        .then((res) => {
          //closeDebug console.log(res);
          _this.$refs.code.setAttribute("src", window.URL.createObjectURL(res));
        })
        .catch((err) => {
          //closeDebug console.log(err);
        });
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
  },
};
</script>
<style scoped>
.login-form >>> .el-form-item__label {
  text-align-last: justify;
  width: 100%;
}
</style>
<style>
.logo {
  margin-left: 20px;
}
.logo-text {
  margin-left: 20px;
  text-decoration-line: none;
}
.login-header {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.6);
  top: 0px;
  left: 0px;
  line-height: 60px;
  width: 100%;
}
a {
  text-decoration-line: none;
  color: rgb(249 247 247 / 83%);
}
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  width: 100%;
}
.login::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)),
    url(../assets/background.jpg) center center no-repeat;
  filter: blur(8px);
  z-index: -1;
  background-size: cover;
}
.login-box {
  display: flex;
  flex-direction: column;
  margin: 40px 40px;
  padding: 30px 5% 40px 5%;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.63);
}
.login-title {
  text-align: center;
  margin: 0px auto 30px auto;
  color: rgb(0, 0, 0);
  letter-spacing: 0.1em;
  font-weight: 400;
  font-size: 1.4em;
}
.button-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.captcha-input-container {
  display: flex;
  flex-direction: row;
}
.bottom-link {
  text-decoration: none;
}
/* 未访问的链接 */
.bottom-link:link {
  color: #0084ff;
}

/* 已访问的链接 */
.bottom-link:visited {
  color: #0084ff;
}
.captcha-img {
  height: 38px;
  width: 108px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
</style>

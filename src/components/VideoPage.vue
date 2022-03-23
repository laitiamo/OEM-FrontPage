<template>
  <div class="VideoForm">
    <h2>视频播放页</h2>
    {{ date }}，请点击签到按钮完成签到
    <el-button type="primary" size="large" @click="Sign"
      >点击此处进行签到</el-button
    >
    <el-row
      :gutter="16"
      :xs="24"
      type="flex"
      style="flex-wrap: wrap"
      justify="center"
    >
      <el-col :md="17" :lg="17">
        <div style="width:100%;height:100%">
          <video-player
            class="video-player vjs-custom-skin"
            :options="options"
          />
        </div>
      </el-col>
      <el-col :md="10" :lg="7">
        <el-card shadow="always">
          <el-table :data="SourceList" style="margin-left:10px">
            <el-table-column
              prop="SourceName"
              label="文件名"
              width="auto"
            ></el-table-column>
            <el-table-column
              label="附件"
              width="80"
              fixed="right"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="onExportFile(scope.$index, scope.row)"
                  style="margin-right: 10px"
                  >下载</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const options = {
  playbackRates: [0.25, 0.5, 1.0, 1.25, 2.0], // 可选择的播放速度
  autoplay: false, // 如果true,浏览器准备好时开始回放。
  muted: false, // 默认情况下将会消除任何音频。
  loop: false, // 视频一结束就重新开始。
  preload: "auto",
  language: "zh-CN",
  aspectRatio: "16:9",
  sources: [
    {
      type: "video/mp4", // 类型
      src: "",
    },
  ],
  notSupportedMessage: "等待教师发布该视频",
};
import { getVideo, getSourceList, VideoSign, exportSubjectPDF } from "../api";
export default {
  name: "VideoForm",
  data() {
    return {
      options,
      date: new Date(),
      SourceList: [{}],
    };
  },
  mounted() {
    this.init();
    let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.date = new Date(); // 修改数据date
    }, 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    //调用接口取数据
    init() {
      let id = this.$route.params.id;
      let params = new URLSearchParams();
      params.append("id", id.substr(1));
      getVideo(params)
        .then((res) => {
          //closeDebug console.log("-----------获取视频数据---------------");
          //closeDebug console.log(res.data);
          this.options.sources[0].src =
            "https://oem.844307947.xyz/api/upload/video/" +
            res[0].VideoName +
            "_" +
            res[0].salt +
            "_" +
            ".mp4"; //不知道为啥axios返回的地址无法被引用，只能先用简单粗暴的地址
        })
        .catch((failResponse) => {});
      let params2 = new URLSearchParams();
      params2.append("VideoId", id.substr(1));
      getSourceList(params2)
        .then((res) => {
          this.SourceList = res;
        })
        .catch((failResponse) => {});
    },
    //完成签到
    Sign() {
      let id = this.$route.params.id;
      let params = new URLSearchParams();
      params.append("VideoId", id.substr(1));
      VideoSign(params)
        .then((res) => {
          if (res.code === 0) {
            this.$message({
              message: res.msg,
              type: "success",
            });
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
        .catch((failResponse) => {});
    },
    //处理导出附件
    onExportFile(index, row) {
      //closeDebug console.log("export XLS:", this.form2Query);
      //参数绑定「筛选参数」
      this.loading = true;
      let params = new URLSearchParams();
      params.append("id", row.id);
      exportSubjectPDF(params)
        .then((res) => {
          //closeDebug console.log("-----------导出学生奖项表格文件---------------");
          //closeDebug console.log(res);
          const blob = new Blob([res.data]);
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          //new一个时间对象
          var nowDate = new Date().toLocaleDateString();
          downloadElement.download = decodeURIComponent(
            nowDate + "_" + row.VideoName + ".zip"
          );
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
        })
        .catch((failResponse) => {});
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.videoBtn button {
  margin: 8px 8px 0 0;
}
</style>

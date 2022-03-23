<template>
  <div class="SourceForm">
    <h3>上传附件</h3>
    <el-form
      ref="FormData"
      class="demo-form-inline"
      :model="FormData"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="课程名称" prop="SubjectId">
        <el-select
          v-model="FormData.SubjectId"
          placeholder="请选择课程"
          @change="QueryVideo"
          style="display: block"
        >
          <template v-for="rankEach in SubjectList">
            <el-option
              :label="rankEach.SubjectName"
              :value="rankEach.id"
              :key="rankEach.id"
            ></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="课程章节" prop="VideoId">
        <el-select
          v-model="FormData.VideoId"
          placeholder="请选择课程"
          style="display: block"
        >
          <template v-for="rankEach in VideoList">
            <el-option
              :label="rankEach.VideoName"
              :value="rankEach.id"
              :key="rankEach.id"
            ></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="资源名称" prop="SourceName">
        <el-input
          v-model="FormData.SourceName"
          placeholder="请输入资源名称"
          style="display: block"
        ></el-input>
      </el-form-item>
      <el-form-item label="课程资源" required prop="WorkSourceList">
        <el-upload
          class="img-upload"
          ref="upload"
          action="#"
          :auto-upload="false"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          :on-change="handleChange"
          :file-list="SourceList"
          :multiple="true"
          list-type="text"
          :limit="5"
          accept=".pdf"
        >
          <div slot="tip" class="el-upload__tip">
            只能上传 PDF 格式文件，且总大小不超过100MB，最多上传5个文件
          </div>
          <el-button size="small">上传资源</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('FormData')"
          style="width:100%"
          :loading="loading"
        >
          添加</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { initSubject, addSource, searchVideoList } from "../api";
export default {
  name: "SourceForm",
  components: {},
  computed: {},
  data() {
    return {
      loading: false,
      ifSmall: false,
      SubjectList: [],
      VideoList: [],
      SourceList: [],
      paginationLayout: "prev, pager,next, jumper, ->, total, sizes",
      // 数据列表
      FormData: {
        SubjectId: "",
        VideoId: "",
        SourceName: "",
        WorkSourceList: [],
      },
      rules:{
        SubjectId: [
          { required: true, message: "请选择课程", trigger: "change" }
        ],
        VideoId: [
          { required: true, message: "请选择章节", trigger: "change" }
        ],
        SourceName: [
          { required: true, message: "请输入资源名称", trigger: "blur" }
        ],
        WorkSourceList: [
          { required: true, message: "请上传资源", trigger: "change" }
        ]
      },
      dialogVideoUrl: "", //视频预览的url
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    //初始化
    init() {
      initSubject()
        .then((res) => {
          let obj = JSON.parse(res.msg);
          this.SubjectList = obj.Subject;
        })
        .catch((failResponse) => {});
    },
    //根据课程id查询课程下的章节
    QueryVideo() {
      let _this = this;
      this.FormData.VideoId = "";
      let params = new URLSearchParams();
      params.append("SubjectId", this.FormData.SubjectId);
      searchVideoList(params)
        .then((res) => {
          _this.VideoList = res;
        })
        .catch((failResponse) => {});
    },
    //取消上传，清空文件列表及表单
    cancelUpload(formName) {
      this.$refs[formName].resetFields();
      this.$refs.upload.clearFiles();
    },
    //处理已上传资源与表单内容的同步
    handleChange(file, SourceList) {
      //closeDebug console.log("添加视频后", file, SourceList);
      this.FormData.WorkSourceList = SourceList;
    },
    //处理已上传的视频的删除
    handleRemove(file, SourceList) {
      //closeDebug console.log("删除视频后", file, SourceList);
    },
    //处理已上传的视频的点击预览
    handlePreview(file) {
      //closeDebug console.log("点击预览了", file);
      this.dialogSourceUrl = file.url;
      this.dialogVisible = false;
    },
    //处理上传资源超过限制
    handleExceed(files, SourceList) {
      //closeDebug console.log("数量超出限制时", files, SourceList);
      this.$message({
        message: "已达到资源文件数量上限",
        type: "error",
      });
    },
    //数据格式化(还没用到)
    formatter(row, column) {
      return row.address;
    },
    //处理表单提交事件
    submitForm(formName) {
      let _this = this;
      _this.$message({
        dangerouslyUseHTMLString: true,
        duration: 0,
        type: "success",
        message:
          '<strong>上传中,请勿关闭页面</strong><i class="el-icon-loading"></i>',
      });
      this.loading = false;
      //closeDebug console.log();
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data2upload = new FormData();
          //获取实际input组件的文件
          let sourcesList = this.FormData.WorkSourceList;
          data2upload.append("SubjectId", this.FormData.SubjectId);
          data2upload.append("VideoId", this.FormData.VideoId);
          data2upload.append("SourceName", this.FormData.SourceName);
          //循环加入多文件
          for (let i = 0; i < sourcesList.length; i++) {
            data2upload.append(
              "source",
              sourcesList[i].raw,
              sourcesList[i].raw.name
            );
          }
          addSource(data2upload)
            .then((res) => {
              //closeDebug console.log("-----------表单提交---------------");
              //closeDebug console.log("服务器返回值：", res);
              if (res.code === 0) {
                _this.$message.closeAll();
                _this.$message({
                  message: res.msg,
                  type: "success",
                });
                _this.cancelUpload("FormData");
              } else {
                _this.$message.closeAll();
                _this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            })
            .catch((failResponse) => {
              _this.$message.closeAll();
              console.log(failResponse);
              if (failResponse.status == 500) {
                _this.$message({
                  message: "上传失败，大小超出限制",
                  type: "error",
                });
              } else {
                _this.$message({
                  message: "上传失败，请检查网络，或压缩视频",
                  type: "error",
                });
              }
            });
        } else {
          _this.$message.closeAll();
          this.$message({
            message: "填写的信息有误",
            type: "error",
          });
          return false;
        }
      });
    },
  },
};
</script>

<style>
.pagination {
  margin-top: 20px;
}
.check-group {
  margin-bottom: 10px;
}
.check-group > span {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}
</style>

<template>
  <div class="UploadForm">
    <el-form
      :model="FormData"
      :rules="rules"
      label-position="top"
      ref="FormData"
      size="small"
      class="demo-FormData"
    >
      <el-form-item label="作业名称" class="no-padding">
        <el-input v-model="WorkName" readonly></el-input>
      </el-form-item>
      <el-form-item label="作业内容" class="no-padding">
        <el-input type="textarea" v-model="WorkContent" disabled></el-input>
      </el-form-item>
      <el-form-item label="作业题目" prop="WorkPlace">
        <el-input
          v-model="FormData.WorkPlace"
          placeholder="请输入作业题目"
        ></el-input>
      </el-form-item>
      <el-form-item label="作业完成时间" prop="WorkTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="FormData.WorkTime"
          style="width: 100%"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-dialog :visible.sync="dialogVisible" width="90%">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
      <el-form-item label="作业图片（含笔记）" required prop="WorkPicList">
        <el-upload
          class="img-upload"
          ref="upload"
          action="#"
          :auto-upload="false"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          :on-change="handleChange"
          :file-list="fileList"
          :multiple="true"
          list-type="picture"
          :limit="20"
          accept="image/jpeg,image/png"
        >
          <el-button size="small">上传图片</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传 jpg/png 格式文件，且总大小不超过100MB，最多上传20张
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item style="margin-top: 40px" size="medium">
        <el-button type="primary" @click="submitForm('FormData')"
          >立即提交</el-button
        >
        <el-button
          @click="
            cancelUpload('FormData');
            goback();
          "
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { uploadWork } from "../api";

export default {
  name: "UploadForm",
  props: {
    WorkName: String,
    WorkContent: String,
    WorkId: Number,
    DeadLine: String,
    goback: { type: Function },
  },
  data() {
    return {
      fileList: [], //已上传的文件列表
      //表单数据
      FormData: {
        WorkTime: "",
        WorkPlace: "",
        WorkPicList: [],
      },
      //<el-form-item>标签的prop值的校验规则
      rules: {
        WorkPlace: [
          { required: true, message: "请输入作业题目", trigger: "blur" },
          { min: 2, message: "长度需大于两个字符", trigger: "blur" },
        ],
        WorkTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        WorkPicList: [
          { required: true, message: "请选择作业图片", trigger: "blur" },
        ],
      },
      dialogImageUrl: "", //图片预览的url
      dialogVisible: false, //是否显示预览
    };
  },
  mounted() {},
  methods: {
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

      //closeDebug console.log();
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data2upload = new FormData();
          //获取实际input组件的文件
          let filesList = this.FormData.WorkPicList;
          data2upload.append("WorkId", this.WorkId);
          data2upload.append("WorkName", this.WorkName);
          data2upload.append("WorkTime", this.FormData.WorkTime);
          data2upload.append("WorkPlace", this.FormData.WorkPlace);
          data2upload.append("DeadLine", this.DeadLine);
          //循环加入多文件
          for (let i = 0; i < filesList.length; i++) {
            data2upload.append("file", filesList[i].raw, filesList[i].raw.name);
          }
          //   //closeDebug console.log("WorkId", this.WorkId);
          //   //closeDebug console.log("WorkName", this.WorkName);
          //   //closeDebug console.log("WorkTime", this.FormData.WorkTime);
          //   //closeDebug console.log("WorkPlace", this.FormData.WorkPlace);
          //   //closeDebug console.log("file", filesList);

          uploadWork(data2upload)
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
                _this.goback();
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
                  message: "上传失败，请检查网络，或压缩图片",
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
    //取消上传，清空文件列表及表单
    cancelUpload(formName) {
      this.$refs[formName].resetFields();
      this.$refs.upload.clearFiles();
    },
    //处理已上传图片与表单内容的同步
    handleChange(file, fileList) {
      //closeDebug console.log("添加图片后", file, fileList);
      this.FormData.WorkPicList = fileList;
    },
    //处理已上传的图片的删除
    handleRemove(file, fileList) {
      //closeDebug console.log("删除图片后", file, fileList);
    },
    //处理已上传的图片的点击预览
    handlePreview(file) {
      //closeDebug console.log("点击预览了", file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //处理上传图片超过限制
    handleExceed(files, fileList) {
      //closeDebug console.log("数量超出限制时", files, fileList);
      this.$message({
        message: "已达到图片数量上限",
        type: "error",
      });
    },
  },
};
</script>

<!-- 添加 "scoped" 标签 可以使以下CSS样式仅在本组件生效 例：<style scoped> -->
<style>
.demo-FormData {
  width: auto;
}
</style>

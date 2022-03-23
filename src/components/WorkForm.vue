<template>
  <div class="WorkForm">
    <h3>发布作业</h3>
    <el-form
      ref="addworkForm"
      class="demo-form-inline"
      :model="addworkForm"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="课程名称" prop="SubjectId">
        <el-select
          v-model="addworkForm.SubjectId"
          placeholder="请选择课程"
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
      <el-form-item label="作业名称" prop="name">
        <el-input
          type="text"
          placeholder="请输入作业名"
          v-model="addworkForm.name"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="作业内容" prop="name">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="addworkForm.content"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="作业截止时间" prop="DeadLine">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="addworkForm.DeadLine"
          style="width: 100%"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="confirmAdd"
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
import { initSubject, addwork } from "../api";
import { mapGetters } from "vuex";
export default {
  name: "WorkForm",
  components: {},
  computed: {},
  data() {
    return {
      loading: false,
      ifSmall: false,
      SubjectList: [],
      paginationLayout: "prev, pager,next, jumper, ->, total, sizes",
      // 数据列表
      addworkForm: {
        name: "",
        SubjectId: "",
        DeadLine: "",
        content: "",
      },
      rules:{
        name: [
          { required: true, message: "请输入作业名称", trigger: "blur" }
        ],
        SubjectId: [
          { required: true, message: "请选择课程", trigger: "change" }
        ],
        DeadLine: [
          { required: true, message: "请选择截止时间", trigger: "change" }
        ],
        content: [
          { required: true, message: "请输入作业内容", trigger: "blur" }
        ]
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      initSubject()
        .then((res) => {
          let obj = JSON.parse(res.msg);
          this.SubjectList = obj.Subject;
        })
        .catch((failResponse) => {});
    },
    //数据格式化(还没用到)
    formatter(row, column) {
      return row.address;
    },
    //确认添加
    confirmAdd() {
      let _this = this;
      _this.loading = true;
      let params = new URLSearchParams();
      params.append("name", this.addworkForm.name);
      params.append("SubjectId", this.addworkForm.SubjectId);
      params.append("DeadLine", this.addworkForm.DeadLine);
      params.append("content", this.addworkForm.content);
      addwork(params)
        .then((res) => {
          //closeDebug console.log("-----------发布作业---------------");
          if (res.code === 0) {
            _this.$message({
              message: res.msg,
              type: "success",
            });
            _this.loading = false;
            _this.$router.push("/oem/work");
          } else {
            _this.$message({
              message: res.msg,
              type: "error",
            });
            _this.loading = false;
          }
        })
        .catch((failResponse) => {});
    },
  },
  computed: {
    ...mapGetters(["name", "roleId"]),
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

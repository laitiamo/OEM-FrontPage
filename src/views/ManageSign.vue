<template>
  <div class="manage-sign">
    <h3>考勤管理</h3>

    <!---课程列表部分，选中课程后隐藏--->
    <div>
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-select
            v-model="form2Query.gradeId"
            placeholder="全部年级"
            @change="QueryClass"
            style="width:140px"
          >
            <el-option label="全部年级" value=""></el-option>
            <el-option
              v-for="opt in gradeList"
              :key="opt.id"
              :label="opt.gradeName"
              :value="opt.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form2Query.majorId"
            placeholder="全部专业"
            @change="QueryClass"
            style="width:160px"
          >
            <el-option label="全部专业" value=""></el-option>
            <el-option
              v-for="opt in majorList"
              :key="opt.id"
              :label="opt.majorName"
              :value="opt.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form2Query.classId"
            placeholder=""
            style="width:180px"
          >
            <el-option label="全部班级" value=""></el-option>
            <el-option
              v-for="opt in classList"
              :key="opt.id"
              :label="opt.className"
              :value="opt.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form2Query.keyUsername"
            placeholder="搜索学号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form2Query.keyName"
            placeholder="搜索姓名"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item>
          <el-select
            v-model="form2Query.SubjectId"
            placeholder="全部课程"
            style="width:140px"
          >
            <el-option label="全部课程" value=""></el-option>
            <el-option
              v-for="opt in SubjectList"
              :key="opt.id"
              :label="opt.SubjectName"
              :value="opt.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form2Query.keyVideoName"
            style="width:130px"
            placeholder="查找章节"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查找</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onExportXLS"
            >导出作业信息(XLS)</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @sort-change="onSortChange"
        :default-sort="{ prop: 'VideoName', order: 'descending' }"
      >
        <template v-for="col in Columns">
          <el-table-column
            align="center"
            v-if="col.ifShow"
            :prop="col.value"
            :width="col.width"
            :label="col.name"
            sortable
            :key="col.value"
            show-overflow-tooltip
          >
          </el-table-column>
        </template>
      </el-table>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="pageSize"
        :layout="paginationLayout"
        :small="ifSmall"
        :total="dataCount"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getClassList, initQueryStu, initSubject, getSignList,exportStuSignXLS } from "../api";
import { mapGetters } from "vuex";
export default {
  name: "ManageSign",
  data() {
    return {
      ifSmall: false,
      paginationLayout: "prev, pager,next,  ->, total",
      currentPage: 1,
      pageSize: 10,
      // 数据列
      Columns: [
        { name: "序号", value: "id", width: "80", ifShow: false },
        { name: "学号", value: "username", width: "120", ifShow: true },
        { name: "姓名", value: "name", width: "120", ifShow: true },
        { name: "班级", value: "className", width: "200", ifShow: true },
        { name: "章节名称", value: "VideoName", width: "auto", ifShow: true },
        { name: "课程名称", value: "SubjectName", width: "200", ifShow: true },
        {
          name: "签到时间",
          value: "signTime",
          width: "240",
          ifShow: true,
        },
      ],
      form2Query: {
        gradeId: "", //年级
        majorId: "", //专业
        classId: "", //班级
        keyUsername: "", //用户id
        keyName: "", //姓名
        SubjectId: "", //课程id
        keyVideoName: "", //章节名称
      },
      //下拉栏内容列表
      gradeList: [],
      majorList: [],
      classList: [],
      SubjectList: [],

      tableData: [{}],
      dataCount: 0, //总数据条数

      windowWidth: document.documentElement.clientWidth, //实时屏幕宽度
    };
  },
  mounted() {
    this.initQueryList();
    this.getTableData();
    if (document.documentElement.clientWidth < 720) {
      //closeDebug console.log("触发移动端布局");
      this.ifSmall = true;
      this.Columns = [
        { name: "序号", value: "id", width: "80", ifShow: false },
        { name: "学号", value: "username", width: "120", ifShow: false },
        { name: "姓名", value: "name", width: "120", ifShow: true },
        { name: "班级", value: "className", width: "160", ifShow: false },
        { name: "章节名称", value: "VideoName", width: "auto", ifShow: true },
        { name: "课程名称", value: "SubjectName", width: "200", ifShow: false },
        {
          name: "签到时间",
          value: "signTime",
          width: "240",
          ifShow: false,
        },
      ];
    }
  },
  watch: {
    windowWidth(val) {
      let that = this;
      //closeDebug console.log("实时屏幕宽度：", val, that.windowHeight);
    },
  },
  methods: {
    //初始化查询参数
    initQueryList() {
      initSubject()
        .then((res) => {
          let obj = JSON.parse(res.msg);
          this.SubjectList = obj.Subject;
        })
        .catch((failResponse) => {});
      initQueryStu()
        .then((res) => {
          //closeDebug console.log("-----------初始化查询参数---------------");
          let obj = JSON.parse(res.msg);
          //closeDebug console.log(obj);
          this.gradeList = obj.grade;
          this.majorList = obj.major;
        })
        .catch((failResponse) => {});
    },
    //更新可供筛选的班级列表
    QueryClass() {
      let _this = this;
      _this.form2Query.classId = "";
      //closeDebug console.log("选中的筛选值","年级：",this.form2Query.gradeId,"专业",this.form2Query.majorId,"班级",this.form2Query.classId);
      let params = new URLSearchParams();
      params.append("gradeId", this.form2Query.gradeId);
      params.append("majorId", this.form2Query.majorId);
      getClassList(params)
        .then((res) => {
          //closeDebug console.log("-----------获取班级列表---------------");
          //closeDebug console.log(res);
          _this.classList = res;
        })
        .catch((failResponse) => {});
    },
    //调用接口取数据
    getTableData() {
      //参数绑定「分页大小、页码」
      let params = new URLSearchParams();
      params.append("limit", this.pageSize);
      params.append("page", this.currentPage);
      params.append("gradeId", this.form2Query.gradeId); //年级
      params.append("majorId", this.form2Query.majorId); //专业
      params.append("classId", this.form2Query.classId); //班级
      params.append("SubjectId", this.form2Query.SubjectId); //科目
      params.append("keyUsername", this.form2Query.keyUsername); //用户id
      params.append("keyName", this.form2Query.keyName); //姓名
      params.append("keyVideoName", this.form2Query.keyVideoName); //章节名称
      getSignList(params)
        .then((res) => {
          //closeDebug console.log("-----------获取表格数据---------------");
          //closeDebug console.log(res.data);
          this.tableData = res.data;
          this.dataCount = res.count;
        })
        .catch((failResponse) => {});
    },
    //查找考勤
    onSearch() {
      this.getTableData();
    },
    //处理导出学生考勤表格文件
    onExportXLS() {
      //closeDebug console.log("export XLS:", this.form2Query);
      //参数绑定「筛选参数」
      let params = new URLSearchParams();
      params.append("gradeId", this.form2Query.gradeId); //年级
      params.append("majorId", this.form2Query.majorId); //专业
      params.append("classId", this.form2Query.classId); //班级
      params.append("SubjectId", this.form2Query.SubjectId); //科目
      params.append("keyUsername", this.form2Query.keyUsername); //用户id
      params.append("keyName", this.form2Query.keyName); //姓名
      params.append("keyVideoName", this.form2Query.keyVideoName); //章节名称
      exportStuSignXLS(params)
        .then((res) => {
          //closeDebug console.log("-----------导出学生作业表格文件---------------");
          //closeDebug console.log(res);
          const blob = new Blob([res.data]);
          var downloadElement = document.createElement("a");
          var href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          //new一个时间对象
          var nowDate = new Date().toLocaleDateString();
          downloadElement.download = decodeURIComponent(
            nowDate + "_考勤表.xls"
          );
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
        })
        .catch((failResponse) => {});
    },
    //数据格式化
    formatter(row, column) {
      return row.address;
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      //closeDebug console.log(`每页 ${val} 条`);
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      //closeDebug console.log(`当前页: ${val}`);
      this.getTableData();
    },
    onSortChange(res) {
      //closeDebug console.log("触发排序:", res);
      if (res.order) {
        this.orderMode = res.order === "descending" ? "desc" : "asc";
        this.orderField = res.prop;
      } else {
        this.orderMode = "";
        this.orderField = "";
      }
      //closeDebug console.log(this.orderMode, this.orderField);
      this.onQuery();
    },
  },
  computed: {
    ...mapGetters([]),
  },
};
</script>

<style>
.upload > .el-button {
  margin-top: 1em;
  margin-bottom: 1em;
}
.back-button {
  margin-top: 1em;
  margin-bottom: 1em;
}
.pagination {
  margin-top: 20px;
}
</style>

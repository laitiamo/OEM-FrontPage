<template>
  <div class="manage-class">
    <h3>班级管理</h3>
    <el-form :inline="true" class="demo-form-inline" size="mini">
      <el-form-item>
        <el-select
          v-model="form2Query.gradeId"
          placeholder="全部年级"
          @change="QueryClass"
          style="width: 140px"
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
          style="width: 160px"
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
          style="width: 180px"
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
          v-model="form2Query.keyName"
          placeholder="搜索教师"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="form2Query.keyUserName"
          placeholder="搜索教职工号"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-form :inline="true" class="demo-form-inline" size="mini">
      <el-form-item>
        <el-button type="primary" @click="onQuery">筛选</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm
          confirm-button-text="确认删除"
          cancel-button-text="不用了"
          confirm-button-type="danger"
          cancel-button-type=""
          icon="el-icon-info"
          icon-color="red"
          title="警告：确认解绑？此操作会将该班级与教师的关系解绑"
          @confirm="handleDel"
        >
          <el-button type="danger" slot="reference">解绑班级</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>
    <div class="check-group">
      <span>显示列：</span>
      <el-checkbox
        v-for="col in Columns"
        v-model="col.ifShow"
        :key="col.value"
        size="small"
        style="margin-right: 10px"
        >{{ col.name }}</el-checkbox
      >
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      style="width: 100%"
      @sort-change="onSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55">
      </el-table-column>
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
</template>

<script>
import {
  getInsClassList,
  getNewClassList,
  initManageClass,
  delClass,
} from "../api";
export default {
  name: "ManageClass",
  components: {},
  computed: {},
  data() {
    return {
      visible: false,
      ifSmall: false,
      paginationLayout: "prev, pager,next, jumper, ->, total, sizes",
      ifShowUpdateDialog: false, //修改弹窗
      selectField: "", //正在修改的表单域
      // 数据列
      Columns: [
        { name: "编号", value: "id", width: "100", ifShow: true },
        { name: "教师编号", value: "teacherId", width: "150", ifShow: true },
        { name: "教师", value: "teaName", width: "120", ifShow: true },
        { name: "年级", value: "gradeName", width: "100", ifShow: true },
        { name: "专业", value: "majorName", width: "200", ifShow: true },
        { name: "班号", value: "classNo", width: "80", ifShow: true },
        { name: "班级全称", value: "className", width: "auto", ifShow: true },
      ],
      currentPage: 1,
      pageSize: 10,
      tableData: [{}], //展示的数据
      dataCount: 0, //总数据条数
      orderMode: "", //排序方式
      orderField: "", //排序字段
      //用于筛选的表单
      form2Query: {
        gradeId: "", //年级
        majorId: "", //专业
        classId: "", //班级
        keyName: "", //教师姓名
        keyUsername: "", //教职工号
      },
      //下拉栏内容列表
      gradeList: [],
      majorList: [],
      classList: [],
      //选中的数据
      multipleSelection: [],
    };
  },
  computed: {},
  mounted() {
    this.initQueryList();
    this.onQuery();
    if (document.documentElement.clientWidth < 720) {
      //closeDebug console.log("触发移动端布局");
      this.ifSmall = true;
      this.paginationLayout = "prev, pager,next, ->, total";
      this.Columns = [
        { name: "编号", value: "id", width: "80", ifShow: false },
        { name: "教师编号", value: "teacherId", width: "auto", ifShow: false },
        { name: "教师", value: "teaName", width: "auto", ifShow: true },
        { name: "年级", value: "gradeName", width: "120", ifShow: false },
        { name: "专业", value: "majorName", width: "150", ifShow: false },
        { name: "班号", value: "classNo", width: "80", ifShow: false },
        { name: "班级全称", value: "className", width: "auto", ifShow: true },
      ];
    }
  },
  methods: {
    //初始化查询参数
    initQueryList() {
      initManageClass()
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
      getNewClassList(params)
        .then((res) => {
          //closeDebug console.log("-----------获取班级列表---------------");
          //closeDebug console.log(res);
          _this.classList = res;
        })
        .catch((failResponse) => {});
    },
    //处理多选框变化
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //closeDebug console.log("多选框：", val);
    },
    //处理每页显示数据量变化
    handleSizeChange(val) {
      this.pageSize = val;
      //closeDebug console.log(`每页 ${val} 条`);
      this.onQuery();
    },
    //处理跳页
    handleCurrentChange(val) {
      this.currentPage = val;
      //closeDebug console.log(`当前页: ${val}`);
      this.onQuery();
    },
    //处理解除绑定
    handleDel() {
      let params = new URLSearchParams();
      for (let cls in this.multipleSelection) {
        params.append("ids[]", this.multipleSelection[cls].id);
      }
      let _this = this;
      delClass(params)
        .then((res) => {
          //closeDebug console.log("-----------删除用户---------------");
          if (res.code === 0) {
            _this.$message({
              message: res.msg,
              type: "success",
            });
            _this.onQuery();
          } else {
            _this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
        .catch((failResponse) => {});
    },
    //处理数据筛选
    onQuery() {
      //closeDebug console.log("submit:", this.form2Query);
      //参数绑定「分页大小、页码以及筛选参数」
      let params = new URLSearchParams();
      params.append("limit", this.pageSize);
      params.append("page", this.currentPage);
      params.append("gradeId", this.form2Query.gradeId); //年级
      params.append("majorId", this.form2Query.majorId); //专业
      params.append("classId", this.form2Query.classId); //班级
      params.append("keyName", this.form2Query.keyName); //教师姓名
      params.append("order", this.orderMode); //排序方式
      params.append("field", this.orderField); //排序字段
      getInsClassList(params)
        .then((res) => {
          //closeDebug console.log("-----------获取筛选后的表格数据---------------");
          //closeDebug console.log(res.data);
          this.tableData = res.data;
          this.dataCount = res.count;
        })
        .catch((failResponse) => {});
    },
    //处理排序后重新获取数据
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

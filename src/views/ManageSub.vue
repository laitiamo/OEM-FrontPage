<template>
  <div class="manage-sub">
    <h3>课程管理</h3>

    <!---课程列表部分，选中课程后隐藏--->
    <div v-show="!ifSelected">
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item>
          <el-input
            v-model="search"
            style="width:130px"
            placeholder="查找关键字"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查找</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelSearch">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="handleAddSubject"
            >添加课程</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :default-sort="{ prop: 'SubjectName', order: 'descending' }"
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
        <el-table-column label="操作" width="90" fixed="right" align="center">
          <template slot-scope="scope">
            <el-popconfirm
              confirm-button-text="确认删除"
              cancel-button-text="不用了"
              confirm-button-type="danger"
              cancel-button-type=""
              icon="el-icon-info"
              icon-color="red"
              title="警告：确认删除？此操作会删除所有相应记录，请谨慎操作"
              @confirm="handleDel(scope.$index, scope.row)"
            >
              <el-button type="danger" size="mini" slot="reference"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
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
      <el-dialog title="添加课程" :visible.sync="ifShowAddDialog" width="90%">
        <el-form
          ref="addSubjectForm"
          class="demo-form-inline"
          :model="addSubjectForm"
          label-position="top"
        >
          <el-form-item label="课程名称" prop="name">
            <el-input
              type="text"
              placeholder="请输入课程名"
              v-model="addSubjectForm.name"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="confirmAdd" style="width:100%"
              >添加</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { addSubject, getSubjectList, delSub } from "../api";
import { mapGetters } from "vuex";
export default {
  name: "ManageSub",
  data() {
    return {
      ifSmall: false,
      ifShowAddDialog: false,
      paginationLayout: "prev, pager,next,  ->, total",
      ifSelected: false,
      addSubjectForm: {
        name: "",
      },
      Columns: [
        { name: "序号", value: "id", width: "80", ifShow: true },
        { name: "章节名称", value: "SubjectName", width: "auto", ifShow: true },
      ],
      currentPage: 1,
      pageSize: 10,
      tableData: [{}],
      dataCount: 0, //总数据条数
      search: "",
    };
  },
  mounted() {
    this.getTableData();
    if (document.documentElement.clientWidth < 720) {
      //closeDebug console.log("触发移动端布局");
      this.ifSmall = true;
    }
  },
  methods: {
    //调用接口取数据
    getTableData() {
      //参数绑定「分页大小、页码」
      let params = new URLSearchParams();
      params.append("limit", this.pageSize);
      params.append("page", this.currentPage);
      params.append("key", this.search);
      getSubjectList(params)
        .then((res) => {
          //closeDebug console.log("-----------获取表格数据---------------");
          //closeDebug console.log(res.data);
          this.tableData = res.data;
          this.dataCount = res.count;
        })
        .catch((failResponse) => {});
    },
    //查找课程
    onSearch() {
      this.getTableData();
    },
    //处理添加课程
    handleAddSubject() {
      this.ifShowAddDialog = true;
    },
    //确认添加
    confirmAdd() {
      let _this = this;
      let params = new URLSearchParams();
      params.append("name", this.addSubjectForm.name);
      addSubject(params)
        .then((res) => {
          //closeDebug console.log("-----------添加课程名---------------");
          if (res.code === 0) {
            _this.$message({
              message: res.msg,
              type: "success",
            });
            _this.onSearch();
          } else {
            _this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
        .catch((failResponse) => {});
      this.ifShowAddDialog = false;
      this.$refs.addSubjectForm.resetFields();
    },
    //处理删除课程信息
    handleDel(index, row) {
      let params = new URLSearchParams();
      params.append("SubjectName", row.SubjectName);
      let _this = this;
      delSub(params)
        .then((res) => {
          //closeDebug console.log("-----------删除课程---------------");
          if (res.code === 0) {
            _this.$message({
              message: res.msg,
              type: "success",
            });
            _this.onSearch();
          } else {
            _this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
        .catch((failResponse) => {});
    },
    //取消查找
    cancelSearch() {
      this.search = "";
      this.getTableData();
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
    //返回重选课程
    goBack() {
      this.ifSelected = false;
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

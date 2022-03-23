<template>
  <div class="work">
    <h3>作业管理</h3>
    <el-form :inline="true" class="demo-form-inline" size="mini">
      <el-form-item>
        <el-input v-model="form2Query.key" placeholder="搜索作业"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onQuery">筛选</el-button>
      </el-form-item>
    </el-form>
    <div class="check-group">
      <span>显示列：</span>
      <el-checkbox
        v-for="col in Columns"
        v-model="col.ifShow"
        :key="col.value"
        size="small"
        style="margin-right:10px"
        >{{ col.name }}</el-checkbox
      >
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      @sort-change="onSortChange"
    >
      <template v-for="col in Columns">
        <el-table-column
          v-if="col.ifShow"
          :prop="col.value"
          :width="col.width"
          :label="col.name"
          sortable
          :key="col.value"
        >
        </el-table-column>
      </template>
      <el-table-column label="操作" width="150" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.$index, scope.row)"
            style="margin-right:10px"
            >编辑</el-button
          >
          <el-popconfirm
            confirm-button-text="确认删除"
            cancel-button-text="不用了"
            confirm-button-type="danger"
            cancel-button-type=""
            icon="el-icon-info"
            icon-color="red"
            title="警告：这会删除所有相关获奖记录！"
            @confirm="handleDel(scope.$index, scope.row)"
          >
            <el-button size="mini" type="danger" slot="reference"
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
    <el-dialog title="编辑作业" :visible.sync="ifShowUpdateDialog" width="90%">
      <span>正在编辑作业：{{ selectwork.WorkName }}</span>
      <div style="margin: 10px 0;"></div>
      <el-form label-position="left" label-width="100px">
        <el-form-item label="原作业内容" prop="WorkContent"
          ><el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="selectwork.WorkContent"
            disabled
          >
          </el-input
        ></el-form-item>
        <el-form-item label="新作业内容" prop="newContent"
          ><el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="newForm.newContent"
          >
          </el-input
        ></el-form-item>
        <el-form-item label="作业截止时间" prop="newDeadLine">
          <el-date-picker
            type="date"
            placeholder="请选择截止日期"
            v-model="newForm.newDeadLine"
            style="width: 100%"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="confirmUpdate" style="width:100%"
        >提交</el-button
      >
    </el-dialog>
  </div>
</template>

<script>
import { delwork, getAllWorkList, updateWorkContent } from "../api";
import { mapGetters } from "vuex";
export default {
  name: "work",
  components: {},
  computed: {},
  data() {
    return {
      ifSmall: false,
      paginationLayout: "prev, pager,next, jumper, ->, total, sizes",
      // 数据列
      Columns: [
        { name: "作业ID", value: "id", width: "90", ifShow: true },
        { name: "作业名称", value: "WorkName", width: "auto", ifShow: true },
        { name: "课程名称", value: "SubjectName", width: "200", ifShow: true },
        { name: "开始日期", value: "createAt", width: "240", ifShow: true },
        { name: "截止日期", value: "DeadLine", width: "240", ifShow: true },
      ],
      currentPage: 1,
      pageSize: 10,
      tableData: [{}], //展示的数据
      dataCount: 0, //总数据条数
      orderMode: "desc", //排序方式
      orderField: "", //排序字段
      //用于筛选的表单
      form2Query: {
        key: "", //作业关键词
      },
      newForm: {
        newContent: "", //新作业名
        newDeadLine: "", //新截止日期
      },
      ifShowUpdateDialog: false,
      ifShowAddDialog: false,
      selectwork: {}, //选中的作业的id
    };
  },
  mounted() {
    this.onQuery();
    if (document.documentElement.clientWidth < 720) {
      //closeDebug console.log("触发移动端布局");
      this.paginationLayout = "prev, pager,next, ->, total";
      this.ifSmall = true;
      this.Columns = [
        { name: "作业名称", value: "WorkName", width: "auto", ifShow: true },
        { name: "开始日期", value: "createAt", width: "auto", ifShow: false },
        { name: "截止日期", value: "DeadLine", width: "auto", ifShow: true },
      ];
    }
  },
  methods: {
    //数据格式化(还没用到)
    formatter(row, column) {
      return row.address;
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
    //处理编辑作业
    handleUpdate(index, row) {
      //closeDebug console.log("点击编辑", index, row);
      this.selectwork = row;
      this.ifShowUpdateDialog = true;
    },
    //确认编辑
    confirmUpdate() {
      let _this = this;
      let params = new URLSearchParams();
      params.append("id", this.selectwork.id);
      params.append("newContent", this.newForm.newContent);
      params.append("newDeadLine", this.newForm.newDeadLine);
      updateWorkContent(params)
        .then((res) => {
          //closeDebug console.log("-----------编辑作业名---------------");
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
          //还原表单数据
          _this.selectwork = {};
        })
        .catch((failResponse) => {});
      this.ifShowUpdateDialog = false;
    },
    //处理删除作业
    handleDel(index, row) {
      //closeDebug console.log("点击删除", index, row);
      let params = new URLSearchParams();
      params.append("ids[]", row.id);
      let _this = this;
      delwork(params)
        .then((res) => {
          //closeDebug console.log("-----------删除作业---------------");
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
      params.append("key", this.form2Query.key); //作业名
      params.append("order", this.orderMode);
      getAllWorkList(params)
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
        this.orderMode = "desc";
        this.orderField = "";
      }
      //closeDebug console.log(this.orderMode, this.orderField);
      this.onQuery();
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

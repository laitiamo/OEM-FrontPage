<template>
  <div class="video">
    <h3>在线学习</h3>

    <!---课程列表部分，选中课程后隐藏--->
    <div v-show="!ifSelected">
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item>
          <el-input
            v-model="keySubjectName"
            style="width:130px"
            placeholder="查找课程"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="keyVideoName"
            style="width:130px"
            placeholder="查找章节"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查找</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelSearch">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
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
        <el-table-column label="操作" width="80" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >学习</el-button
            >
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
    </div>

    <!---提交表单部分，选中课程后显示--->
  </div>
</template>

<script>
import { getVideoList } from "../api";
import { mapGetters } from "vuex";
export default {
  name: "Video",
  data() {
    return {
      ifSmall: false,
      paginationLayout: "prev, pager,next,  ->, total",
      ifSelected: false,
      currentPage: 1,
      pageSize: 10,
      Columns:[
        {
          value: "id",
          name: "序号",
          ifShow: true,
          width: "80"
        },
        {
          value: "VideoName",
          name: "章节名称",
          ifShow: true,
          width: "auto"
        },
        {
          value: "SubjectName",
          name: "课程名称",
          ifShow: true,
          width: "200"
        },
        {
          value: "UploadTime",
          name: "上传时间",
          ifShow: true,
          width: "200"
        },
      ],
      tableData: [{}],
      dataCount: 0, //总数据条数
      keySubjectName: "",
      keyVideoName: "",
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
      params.append("keySubjectName", this.keySubjectName);
      params.append("keyVideoName", this.keyVideoName);
      getVideoList(params)
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
    //处理选中，跳转到播放页
    handleEdit(index, row) {
      this.$router.push({ path: "/oem/video:" + row.id });
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

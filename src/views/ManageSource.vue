<template>
  <div class="manage-video">
    <h3>资源管理</h3>

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
        <template v-if="windowWidth >= 720">
          <el-table-column
            label="查看视频"
            width="120"
            fixed="right"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                slot="reference"
                @click="VideoPlay(scope.$index, scope.row)"
                >查看视频</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            label="下载附件"
            width="160"
            fixed="right"
            align="center"
          >
            <template slot-scope="scope2">
              <el-button
                type="primary"
                size="mini"
                slot="reference"
                :loading="loading"
                @click="sourcePlay(scope2.$index, scope2.row)"
                >查看附件</el-button
              >
            </template>
          </el-table-column>
        </template>
        <el-table-column label="删除" width="90" fixed="right" align="center">
          <template slot-scope="scope3">
            <el-popconfirm
              confirm-button-text="确认删除"
              cancel-button-text="不用了"
              confirm-button-type="danger"
              cancel-button-type=""
              icon="el-icon-info"
              icon-color="red"
              title="警告：确认删除？此操作会删除所有相应记录，请谨慎操作"
              @confirm="handleDel(scope3.$index, scope3.row)"
            >
              <el-button type="danger" size="mini" slot="reference"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="已上传资源" :visible.sync="ifShowDialog" width="90%">
        <el-table :data="SourceList" style="margin-top:10px">
          <template v-for="col in SourceColumns">
            <el-table-column
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
          <el-table-column label="附件" width="80" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="onExportFile(scope.$index, scope.row)"
                style="margin-right: 10px"
                >下载</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" fixed="right" align="center">
            <template slot-scope="scope2">
              <el-button
                size="mini"
                @click="handleDelete(scope2.$index, scope2.row)"
                style="margin-right: 10px"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
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
import {
  getVideoList,
  delVideo,
  getSourceList,
  exportSubjectPDF,
  delSource,
} from "../api";
import { mapGetters } from "vuex";
export default {
  name: "ManageSub",
  data() {
    return {
      loading: false,
      ifSmall: false,
      ifShowDialog: false,
      paginationLayout: "prev, pager,next,  ->, total",
      ifSelected: false,
      currentPage: 1,
      pageSize: 10,
      SourceList: [{}],
      // 数据列
      Columns: [
        { name: "序号", value: "id", width: "80", ifShow: true },
        { name: "章节名称", value: "VideoName", width: "auto", ifShow: true },
        { name: "课程名称", value: "SubjectName", width: "200", ifShow: true },
        { name: "文件校验值", value: "salt", width: "120", ifShow: true },
        {
          name: "上传时间",
          value: "UploadTime",
          width: "200",
          ifShow: true,
        },
      ],
      SourceColumns: [
        { name: "序号", value: "id", width: "80", ifShow: true },
        { name: "文件名", value: "SourceName", width: "auto", ifShow: true },
        { name: "章节名称", value: "VideoName", width: "auto", ifShow: true },
        { name: "课程名称", value: "SubjectName", width: "auto", ifShow: true },
        {
          name: "上传时间",
          value: "UploadTime",
          width: "auto",
          ifShow: true,
        },
      ],
      tableData: [{}],
      dataCount: 0, //总数据条数
      keySubjectName: "",
      keyVideoName: "",
      windowWidth: document.documentElement.clientWidth, //实时屏幕宽度
    };
  },
  mounted() {
    this.getTableData();
    if (document.documentElement.clientWidth < 720) {
      //closeDebug console.log("触发移动端布局");
      this.ifSmall = true;
      this.Columns = [
        { name: "序号", value: "id", width: "80", ifShow: true },
        { name: "章节名称", value: "VideoName", width: "auto", ifShow: true },
        { name: "课程名称", value: "SubjectName", width: "200", ifShow: false },
        { name: "文件校验值", value: "salt", width: "120", ifShow: false },
        {
          name: "上传时间",
          value: "UploadTime",
          width: "200",
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
    //查看自己课程的视频
    VideoPlay(index, row) {
      this.$router.push({ path: "/oem/video:" + row.id });
    },
    sourcePlay(index, row) {
      this.ifShowDialog = true;
      let params = new URLSearchParams();
      params.append("VideoId", row.id);
      getSourceList(params)
        .then((res) => {
          this.SourceList = res;
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
    //处理删除课程信息
    handleDel(index, row) {
      let params = new URLSearchParams();
      params.append("VideoName", row.VideoName);
      params.append("salt", row.salt);
      let _this = this;
      delVideo(params)
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
    //处理删除资源信息
    handleDelete(index, row) {
      let params = new URLSearchParams();
      params.append("id", row.id);
      delSource(params)
        .then((res) => {
          //closeDebug console.log("-----------删除资源---------------");
          if (res.code === 0) {
            this.$message({
              message: res.msg,
              type: "success",
            });
            this.ifShowDialog = false;
          } else {
            this.$message({
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

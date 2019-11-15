<template>
  <div v-cloak class="app-container">
    <el-button style="margin-bottom:20px" type="primary" icon="el-icon-upload2" @click="importDialogVisible = true">导入</el-button>
    <el-button style="margin-bottom:20px" type="primary" icon="el-icon-delete" @click="handleDeleteButtonClick">删除选中</el-button>
    <el-form ref="conditionForm" :model="conditionForm" :inline="true" style="float: right" @submit.native.prevent>
      <el-form-item>
        <el-input
          v-model="conditionForm.keyword"
          placeholder="输入关键字搜索"
          clearable
          @keyup.enter.native.prevent="doSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="doSearch" />
        </el-input>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="listQuery.list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      >
      <!-- <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column> -->
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="50" />
      <el-table-column prop="id" label="编号" min-width="15" />
      <el-table-column label="文件名" min-width="50">
        <template slot-scope="scope">
          <el-link
            :download="scope.row.fileName"
            target="_blank"
            @click="downloadFile(scope.row.fileName)"
          >
            {{ scope.row.fileName }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="上传人" min-width="20">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" min-width="20">
        <template slot-scope="scope">
          {{ scope.row.importTime }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="95">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusTextFilter }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="operating" label="操作" width="100">
        <el-button size="small" icon="el-icon-delete" @click="handleDeleteButtonClick">删除</el-button>
      </el-table-column> -->
    </el-table>

    <el-pagination
      :current-page="listQuery.pageNum || 1"
      :page-sizes="[10,20,50]"
      :page-size="10"
      :pager-count="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total || 0"
      @size-change="pageSizeChange"
      @current-change="currentPageChange"
    />
    <!-- 上传对话框 -->
    <el-dialog title="导入" :visible.sync="importDialogVisible" width="35%" center :close-on-click-modal="false">
      <el-upload
        ref="excelUploader"
        class="excel-uploader"
        :action="excelUploadUrl"
        :on-preview="handleUploaderPreview"
        :on-remove="handleUploaderRemove"
        :auto-upload="false"
        :drag="true"
        :multiple="true"
        :accept="acceptFileTypes"
        :limit="fileLimit"
        :data="loginUser"
        :on-exceed="handleOnExceed"
        :on-success="handleOnSuccess"
        :on-error="handleOnError"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或点击<em>选择文件</em></div>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，最多支持{{ fileLimit }}个文件同时上传</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-button @click="handleClearUploaderFiles">清 空</el-button>
        <el-button type="primary" icon="el-icon-upload2" @click="submitUploader">上传</el-button>
      </span>
    </el-dialog>
    <a ref="downloadLink" href="" target="_blank" style="display: block" />
  </div>
</template>

<script>
import { getList, deleteImpByIds } from '@/api/excelImport'
// import Pagination from '@/components/Pagination'
import downloader from '@/utils/downloader'

export default {
  name: 'ExcelImport',
  // components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'error'
      }
      return statusMap[status]
    },
    statusTextFilter(status) {
      const statusMap = {
        1: '处理成功',
        0: '处理失败'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listLoading: true,
      listQuery: {
      },
      conditionForm: {},
      excelUploadUrl: process.env.VUE_APP_BASE_API + '/excel/upload',
      importDialogVisible: false,
      fileLimit: 5,
      acceptFileTypes: '.xls,.xlsx'
    }
  },
  computed: {
    loginUser() {
      return this.$store.state.user.loginUser
    }
  },
  created() {
    this.fetchData(true)
  },
  methods: {
    fetchData(reset) {
      this.listLoading = true
      const params = this.getRequestParams(reset)
      getList(params).then(response => {
        // this.list = response.data.items
        this.listQuery = response.data || {}
        this.listLoading = false
      })
    },
    getList() {
      return {}
    },
    doSearch() {
      this.fetchData(true)
    },
    submitUploader() {
      this.$refs.excelUploader.submit()
    },
    pageSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize
      this.fetchData()
    },
    currentPageChange(pageNum) {
      this.listQuery.pageNum = pageNum
      this.fetchData()
    },
    getRequestParams(reset) {
      if (reset) {
        this.listQuery.pageNum = 0
      }
      const pageNum = this.listQuery.pageNum || 1
      const pageSize = this.listQuery.pageSize || 10
      return Object.assign({}, { 'pageNum': pageNum, 'pageSize': pageSize }, this.conditionForm)
    },
    handleSelectionChange(val) {
      this.selections = val
    },
    handleDeleteButtonClick() {
      if (!this.selections || !this.selections.length) {
        this.$message({
          showClose: true,
          message: `请选择要删除的数据`,
          type: 'warning'
        })
        return
      }
      this.$confirm(`明细数据将会被删除，确定要删除选中的${this.selections.length}条导入记录吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => { this.doDeleteImp() })
        .catch(() => {})
    },
    doDeleteImp() {
      const me = this
      const ids = this.selections.map(itm => itm.id)
      const params = { ids: ids.join(',') }
      deleteImpByIds(params).then(res => {
        me.$message({
          showClose: true,
          message: `删除成功`,
          type: 'success'
        })
        const newList = []
        me.listQuery.list.forEach(itm => {
          if (!ids.includes(itm.id)) {
            newList.push(itm)
          }
        })
        me.listQuery.list = newList
      })
    },
    handleOnExceed(files, fileList) {
      this.$message({
        showClose: true,
        message: `一次最多支持${this.fileLimit}个文件`,
        type: 'error'
      })
    },
    handleOnSuccess(response, file, fileList) {
      let allSuccess = true;
      (fileList || []).forEach(itm => (allSuccess = allSuccess && itm.status === 'success'))
      if (allSuccess) {
        this.$message({
          showClose: true,
          message: `全部上传成功`,
          type: 'success'
        })
        this.importDialogVisible = false
        this.fetchData()
      }
    },
    // eslint-disable-next-line handle-callback-err
    handleOnError(err, file, fileList) {
      this.$message({
        showClose: true,
        message: `${file.name} 上传失败`,
        type: 'error'
      })
    },
    handleUploaderPreview(file) {
      console.log(file)
    },
    handleUploaderRemove(file, fileList) {
      console.log(file, fileList)
    },
    handleClearUploaderFiles() {
      this.$refs.excelUploader.clearFiles()
    },
    fileNameLinkFormatter(fileName) {
      return process.env.VUE_APP_BASE_API + process.env.VUE_APP_UPLOAD_RESOURCES_PATH + fileName
    },
    downloadFile(fileName) {
      const url = this.fileNameLinkFormatter(fileName)
      downloader.get(url, fileName)
    }
  }
}
</script>
<style>
  .excel-uploader .el-upload,.excel-uploader .el-upload-dragger{
    width: 100%;
  }
</style>

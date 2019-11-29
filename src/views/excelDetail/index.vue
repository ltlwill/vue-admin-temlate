<template>
  <div v-cloak class="app-container">
    <el-button style="margin-bottom:20px" type="primary" icon="el-icon-delete" @click="handleDeleteButtonClick">删除选中</el-button>
    <el-form
      ref="conditionForm"
      :model="conditionForm"
      :inline="true"
      style="float: right"
      class="biz-condition-form"
      @submit.native.prevent
    >
      <el-form-item>
        <!-- <el-input v-model="conditionForm.keyword" placeholder="输入关键字搜索" clearable>
          <el-button slot="append" icon="el-icon-search" @click="doSearch" />
        </el-input> -->
        <div class="input-with-select-wrap">
          <el-input
            v-model="conditionForm.keyword"
            clearable
            placeholder="输入关键字搜索"
            class="input-with-select"
            @keyup.enter.native.prevent="doSearch"
          >
            <el-select
              slot="prepend"
              v-model="conditionForm.keywordType"
              placeholder="选择条件"
              clearable
              @change="handleTypeChange"
            >
              <el-option label="导入编号" value="impId" />
              <el-option label="文件名" value="fileLowerName" />
              <el-option label="户名" value="accountName" />
              <el-option label="账号" value="accountNo" />
              <el-option label="开户行" value="bankName" />
              <el-option label="交易日期" value="transactionDate" />
              <el-option label="交易时间" value="transactionTime" />
              <el-option label="收入" value="income" />
              <el-option label="支出" value="expend" />
              <el-option label="余额" value="balance" />
              <el-option label="对方户名" value="toAccountName" />
              <el-option label="对方账号" value="toAccountNo" />
              <el-option label="对方银行" value="toBankName" />
              <el-option label="摘要" value="summary" />
              <el-option label="IP" value="ip" />
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="doSearch" />
          </el-input>
        </div>
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
      <!-- <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column> -->
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="50" />
      <el-table-column prop="impId" label="导入编号" width="60" />
      <el-table-column label="文件名" min-width="30">
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
      <el-table-column label="户名" min-width="30">
        <template slot-scope="scope">
          {{ scope.row.accountName }}
        </template>
      </el-table-column>
      <el-table-column label="账号" min-width="30">
        <template slot-scope="scope">
          <span>{{ scope.row.accountNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户行" min-width="30">
        <template slot-scope="scope">
          <span>{{ scope.row.bankName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易日期" min-width="20">
        <template slot-scope="scope">
          {{ scope.row.transactionDate }}
        </template>
      </el-table-column>
      <el-table-column label="交易时间" min-width="20">
        <template slot-scope="scope">
          {{ scope.row.transactionTime }}
        </template>
      </el-table-column>
      <el-table-column prop="income" label="收入" min-width="20" />
      <el-table-column prop="expend" label="支出" min-width="20" />
      <el-table-column prop="balance" label="余额" min-width="20" />
      <el-table-column prop="toAccountName" label="对方户名" min-width="30" />
      <el-table-column prop="toAccountNo" label="对方账号" min-width="30" />
      <el-table-column prop="toBankName" label="对方银行" min-width="30" />
      <el-table-column prop="summary" label="摘要" min-width="30" show-overflow-tooltip />
      <el-table-column prop="ip" label="IP" min-width="20" />
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
  </div>
</template>

<script>
import { getList, deleteDetailByIds } from '@/api/excelDetail'
// import Pagination from '@/components/Pagination'
import downloader from '@/utils/downloader'

export default {
  // 注：这里的组件名称和路由里配置的name要一致，不然keep-alive缓存不生效
  name: 'ExcelDetails',
  // components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        fail: 'error'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        list: null
      },
      conditionForm: {
        type: ''
      }
    }
  },
  created() {
    this.fetchData(true)
  },
  methods: {
    fetchData(reset) {
      this.listLoading = true
      const params = this.getRequestParams(reset)
      const numberFields = ['impId', 'income', 'expend', 'balance']
      // 如果是数字类型的字段且填写的条件值不是数字
      if (numberFields.includes(params.keywordType) && isNaN(params.keyword)) {
        this.$message({
          showClose: true,
          message: `请填写数字型的条件值`,
          type: 'warning'
        })
        this.listLoading = false
        return false
      }
      getList(params).then(response => {
        // this.list = response.data.items
        this.listQuery = response.data || {}
        this.listLoading = false
      })
    },
    doSearch() {
      this.fetchData(true)
    },
    handleTypeChange() {
      if (this.conditionForm.keyword) {
        this.fetchData(true)
      }
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
      const keywordType = this.conditionForm.keywordType
      const params = { 'pageNum': pageNum, 'pageSize': pageSize }
      if (keywordType) {
        params[keywordType] = this.conditionForm.keyword
      }
      return Object.assign({}, params, this.conditionForm)
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
      this.$confirm(`确定要删除选中的${this.selections.length}条明细吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => { this.doDeleteImpDetail() })
        .catch(() => {})
    },
    doDeleteImpDetail() {
      const me = this
      const ids = this.selections.map(itm => itm.id)
      const params = { ids: ids.join(',') }
      deleteDetailByIds(params).then(res => {
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
<style lang="scss">
  .input-with-select-wrap .input-with-select .el-select .el-input {
    width: 120px;
  }
  .input-with-select-wrap .input-with-select .el-input-group__prepend {
    background-color: rgb(255, 255, 255);
  }
</style>

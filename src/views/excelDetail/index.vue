<template>
  <div v-cloak class="app-container">
    <el-form ref="conditionForm" :model="conditionForm" :inline="true" style="float: right" @submit.native.prevent>
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
              v-model="conditionForm.type"
              placeholder="选择类型"
              clearable
              @change="handleTypeChange"
            >
              <el-option label="户名" value="accountName" />
              <el-option label="账号" value="accountNo" />
              <el-option label="开户行" value="bankName" />
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
    >
      <!-- <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column> -->
      <el-table-column type="index" width="50" />
      <el-table-column prop="impId" label="导入编号" min-width="15" />
      <el-table-column label="户名" min-width="50">
        <template slot-scope="scope">
          {{ scope.row.accountName }}
        </template>
      </el-table-column>
      <el-table-column label="账号" min-width="30">
        <template slot-scope="scope">
          <span>{{ scope.row.accountNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户行" min-width="40">
        <template slot-scope="scope">
          <span>{{ scope.row.bankName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易日期" min-width="20">
        <template slot-scope="scope">
          {{ scope.row.transactionDate }}
        </template>
      </el-table-column>
      <el-table-column label="交易时间" min-width="15">
        <template slot-scope="scope">
          {{ scope.row.transactionTime }}
        </template>
      </el-table-column>
      <el-table-column prop="income" label="收入" min-width="20" />
      <el-table-column prop="expend" label="支出" min-width="20" />
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
import { getList } from '@/api/excelDetail'
// import Pagination from '@/components/Pagination'

export default {
  name: 'ExcelDetail',
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
      const type = this.conditionForm.type
      const params = { 'pageNum': pageNum, 'pageSize': pageSize }
      if (type) {
        params[type] = this.conditionForm.keyword
      }
      return Object.assign({}, params, this.conditionForm)
    }
  }
}
</script>
<style lang="scss">
  .input-with-select-wrap .input-with-select .el-select .el-input {
    width: 120px;
  }
  .input-with-select-wrap .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>

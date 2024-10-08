<script setup name="Gen" lang="ts">
import { oneOf } from '@zeronejs/utils'
import { ElForm } from 'element-plus'
import { getCurrentInstance, onActivated, reactive, ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import {
  delTable,
  genCode,
  listTable,
  previewTable,
  synchDb,
} from '@/api/tool/gen'
import router from '@/router'
import importTable from './importTable.vue'

const route = useRoute()
const { proxy } = getCurrentInstance()!

const tableList = ref<any[]>([])
const loading = ref(true)
const showSearch = ref(true)
const ids = ref<number[]>([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const tableNames = ref<any[]>([])
const dateRange = ref<any>([])
const uniqueId = ref('')
const queryRef = ref<typeof ElForm | null>(null)

const data = reactive<{
  queryParams: any
  preview: {
    open: boolean
    title: string
    data: Record<string, any>
    activeName: string
  }
}>({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    tableName: undefined,
    tableComment: undefined,
  },
  preview: {
    open: false,
    title: '代码预览',
    data: {},
    activeName: 'domain.java',
  },
})

const { queryParams, preview } = toRefs(data)

onActivated(() => {
  const time = oneOf(route.query.t)
  if (time && time !== uniqueId.value) {
    uniqueId.value = time
    queryParams.value.pageNum = Number(route.query.pageNum)
    dateRange.value = []
    proxy?.resetForm('queryForm')
    getList()
  }
})

/** 查询表集合 */
function getList() {
  loading.value = true
  listTable(proxy?.addDateRange(queryParams.value, dateRange.value)).then(
    (response: any) => {
      tableList.value = response.rows
      total.value = response.total
      loading.value = false
    },
  )
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}
/** 生成代码操作 */
function handleGenTable(row: any) {
  const tbNames = row.tableName || tableNames.value
  if (tbNames === '') {
    proxy?.$modal.msgError('请选择要生成的数据')
    return
  }
  if (row.genType === '1') {
    genCode(row.tableName).then(() => {
      proxy?.$modal.msgSuccess(`成功生成到自定义路径：${row.genPath}`)
    })
  } else {
    proxy?.$download.zip(
      `/tool/gen/batchGenCode?tables=${tbNames}`,
      'ruoyi.zip',
    )
  }
}
/** 同步数据库操作 */
function handleSynchDb(row: any) {
  const tableName = row.tableName
  proxy?.$modal
    .confirm(`确认要强制同步"${tableName}"表结构吗？`)
    .then(() => {
      return synchDb(tableName)
    })
    .then(() => {
      proxy!.$modal.msgSuccess('同步成功')
    })
    .catch(() => {
      proxy!.$modal.msgError('同步失败')
    })
}
/** 打开导入表弹窗 */
function openImportTable() {
  ;(proxy?.$refs.importRef as any).show()
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = []
  proxy?.resetForm('queryRef')
  handleQuery()
}
/** 预览按钮 */
function handlePreview(row: any) {
  previewTable(row.tableId).then((response) => {
    preview.value.data = response.data
    preview.value.open = true
    preview.value.activeName = 'domain.java'
  })
}
/** 复制代码成功 */
function copyTextSuccess() {
  proxy?.$modal.msgSuccess('复制成功')
}
// 多选框选中数据
function handleSelectionChange(selection: any[]) {
  ids.value = selection.map((item) => item.tableId)
  tableNames.value = selection.map((item) => item.tableName)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}
/** 修改按钮操作 */
function handleEditTable(row: any) {
  const tableId = row.tableId || ids.value[0]
  router.push({
    path: `/tool/gen-edit/index/${tableId}`,
    query: { pageNum: queryParams.value.pageNum },
  })
}
/** 删除按钮操作 */
function handleDelete(row: any) {
  const tableIds = row.tableId || ids.value
  proxy?.$modal
    .confirm(`是否确认删除表编号为"${tableIds}"的数据项？`)
    .then(() => {
      return delTable(tableIds)
    })
    .then(() => {
      getList()
      proxy!.$modal.msgSuccess('删除成功')
    })
    .catch(() => {
      proxy!.$modal.msgError('删除失败')
    })
}

getList()
</script>

<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryRef"
      :model="queryParams"
      :inline="true"
    >
      <el-form-item label="表名称" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入表名称"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input
          v-model="queryParams.tableComment"
          placeholder="请输入表描述"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" style="width: 308px">
        <el-date-picker
          v-model="dateRange"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">
          搜索
        </el-button>
        <el-button icon="Refresh" @click="resetQuery"> 重置 </el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['tool:gen:code']"
          type="primary"
          plain
          icon="Download"
          @click="handleGenTable"
        >
          生成
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['tool:gen:import']"
          type="info"
          plain
          icon="Upload"
          @click="openImportTable"
        >
          导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['tool:gen:edit']"
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleEditTable"
        >
          修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['tool:gen:remove']"
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
        >
          删除
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @query-table="getList" />
    </el-row>

    <el-table
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column label="序号" type="index" width="50" align="center">
        <template #default="scope">
          <span>{{
            (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="表名称"
        align="center"
        prop="tableName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="表描述"
        align="center"
        prop="tableComment"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="实体"
        align="center"
        prop="className"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="160"
      />
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        width="160"
      />
      <el-table-column
        label="操作"
        align="center"
        width="330"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-tooltip content="预览" placement="top">
            <el-button
              v-hasPermi="['tool:gen:preview']"
              link
              type="primary"
              icon="View"
              @click="handlePreview(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="编辑" placement="top">
            <el-button
              v-hasPermi="['tool:gen:edit']"
              link
              type="primary"
              icon="Edit"
              @click="handleEditTable(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              v-hasPermi="['tool:gen:remove']"
              link
              type="primary"
              icon="Delete"
              @click="handleDelete(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="同步" placement="top">
            <el-button
              v-hasPermi="['tool:gen:edit']"
              link
              type="primary"
              icon="Refresh"
              @click="handleSynchDb(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="生成代码" placement="top">
            <el-button
              v-hasPermi="['tool:gen:code']"
              link
              type="primary"
              icon="Download"
              @click="handleGenTable(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      :total="total"
      @pagination="getList"
    />
    <!-- 预览界面 -->
    <el-dialog
      v-model="preview.open"
      :title="preview.title"
      width="80%"
      top="5vh"
      append-to-body
      custom-class="scrollbar"
    >
      <el-tabs v-model="preview.activeName">
        <el-tab-pane
          v-for="(value, key) in preview.data"
          :key="key"
          :label="key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm'))"
          :name="key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm'))"
        >
          <el-link
            v-copyText="value"
            v-copyText:callback="copyTextSuccess"
            :underline="false"
            icon="DocumentCopy"
            style="float: right"
          >
            &nbsp;复制
          </el-link>
          <pre>{{ value }}</pre>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <import-table ref="importRef" @ok="handleQuery" />
  </div>
</template>

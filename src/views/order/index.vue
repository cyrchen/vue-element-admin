<template>
  <div class="app-container">
    
         <!-- 搜索框 -->
      <el-input placeholder="请输入订单ID" v-model="orderid" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchListItemById"></el-button>
      </el-input>
      <!-- 订单列表表格 -->
      <el-row>
       <el-table
        :data="tableList"
        style="width: 100%">
        <el-table-column type="index" :index="indexMethod"></el-table-column>
        <el-table-column
          :span="3"
          prop="orderNo"
          label="订单号">
        </el-table-column>
        <el-table-column
          :span="3"
          prop="mobile"
          label="手机号"
        >
        </el-table-column>
        <el-table-column
          :span="3"
          prop="totalPrice"
          label="价格"
        >
        </el-table-column>
        <el-table-column
          :span="3"
          prop="orderStatus"
          label="支付状态"
        >
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatus === 0">未支付</span>
          <span v-else-if="scope.row.orderStatus === 1">已支付</span>
          <span v-else>已取消</span>
        </template>
        </el-table-column>
        <el-table-column
          :span="3"
          prop="invoiceStatus"
          label="发票状态"
        >
        <template slot-scope="scope">
          <span v-if="scope.row.invoiceStatus === 0">未开发票</span>
          <span v-else-if="scope.row.invoiceStatus === 1">已开发票</span>
          <span v-else>已取消</span>
        </template>
        </el-table-column>
        <el-table-column label="操作" :span="3">
        <template slot-scope="scope">
          <el-button @click="showEdit(scope.row)" type="primary" icon="el-icon-edit" size="mini" plain circle></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain
            circle
            @click="deleteItemById(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
      </el-table>
     </el-row>
       <!-- 分页 -->
       <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listPage.currentPage"
        :page-size="listPage.pageSize"
        :page-sizes="[4, 6, 8, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listPage.total">
       </el-pagination>
      <!-- 查看订单的对话框 -->
     <el-dialog
      title="查看订单信息"
      :visible.sync="editDialogVisible"
      width="40%">
      <!-- 表单组件 -->
      <el-form ref="editForm" status-icon :model="editForm" label-width="80px">
        <el-form-item label="订单号" prop="orderNo">
          <el-tag type="info">{{editForm.orderNo}}</el-tag>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-tag type="info">{{editForm.mobile}}</el-tag>
        </el-form-item>
        <el-form-item label="价格" prop="totalPrice">
          <el-tag type="info">{{editForm.totalPrice}}</el-tag>
        </el-form-item>
        <el-form-item label="支付状态" prop="orderStatus">
          <el-tag type="info">
         {{editForm.orderStatus === 0 ? '未支付' : ( editForm.orderStatus === 1 ? '已支付' : '已取消') }}
          </el-tag>
        </el-form-item>
        <el-form-item label="发票状态" prop="invoiceStatus">
          <el-tag type="info">
         {{editForm.invoiceStatus === 0 ? '未开发票' : ( editForm.orderStatus === 1 ? '已开发票' : '已取消') }}
          </el-tag>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPageList, fetchListItemById, addNewItem, updateItem, deleteItemById } from '@/api/order'
export default {
  data () {
    return {
      // 分页列表数据渲染
      listPage: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      tableList: [],
      orderid: '',
      // 查看订单的对话框
      editDialogVisible: false,
      editForm: {
        orderNo: '',
        totalPrice: '',
        orderStatus: '',
        id: '',
        mobile: '',
        invoiceStatus: ''
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchPageList(this.listPage).then(res => {
        console.log(res)
        let response = res.data
        this.tableList = response.list
        this.listPage.total = response.total
      })
    },
    searchListItemById(){
      fetchListItemById(this.orderid).then(res => {
        this.tableList = []
        this.tableList.push(res.data)
        this.listPage.total = this.tableList.length
        this.listPage.currentPage = 1
      })
    },
    addNewProduct(){
      addNewItem(this.addForm).then(res => {
        this.addDialogVisible = false
        this.$refs.addForm.resetFields()
        this.$message.success(res.message)
        this.fetchData()
      })
    },
    updateItem(){
      updateItem(this.addForm).then(res => {
        this.editDialogVisible = false
        this.$refs.editForm.resetFields()
        this.$message.success(res.message)
        this.fetchData()
      })
    },
    deleteItemById(id){
      this.$confirm('你确定要删除该订单吗', '温馨提示', {type: 'warning'})
      .then(()=>{
        deleteItemById(id).then(res => {
          this.$message.success('删除成功')
          this.fetchData()
        })
      })
    },

    handleSizeChange (val) {
      this.listPage.pageSize = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listPage.currentPage = val
      this.fetchData()
    },
    indexMethod (index) {
      return index + 1 + (this.listPage.currentPage - 1) * this.listPage.pageSize
    },
    
    showEdit (order) {
      this.editDialogVisible = true
      this.editForm.id = order.id
      this.editForm.orderNo = order.orderNo
      this.editForm.totalPrice = order.totalPrice
      this.editForm.orderStatus = order.orderStatus
      this.editForm.mobile = order.mobile
      this.editForm.invoiceStatus = order.invoiceStatus
    },
    
  }
}
</script>

<style lang="scss" socped>
.input-with-select{
  width: 400px;
  margin-bottom: 10px;
}
</style>

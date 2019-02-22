<template>
    <div class="app-container">
      
      <!-- 搜索框 -->
      <el-input placeholder="请输入用户ID" v-model="userid" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchListItemById"></el-button>
      </el-input>
      <!-- 用户列表表格 -->
      <el-row>
      <el-table
        :data="tableList"
        style="width: 100%">
        <el-table-column type="index" :index="indexMethod"></el-table-column>
        <el-table-column
          label="用户头像"
          :span="4">
          <template slot-scope="scope">
            <img :src="scope.row.avatarUrl" alt="" width="30" height="30">
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名称"
          :span="4">
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="用户昵称"
          :span="4">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          :span="4"
        >
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          :span="4"
        >
        <template slot-scope="scope">
          <span v-if="scope.row.gender === '1'">男</span>
          <span v-else>女</span>
        </template>
        </el-table-column>
         <el-table-column label="操作" :span="4">
        <template slot-scope="scope">
          <el-button @click="showEdit(scope.row)" type="primary" size="mini" plain circle>查看</el-button>
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
       <!-- 查看的对话框 -->
    <el-dialog
      title="查看用户"
      :visible.sync="editDialogVisible"
      width="40%">
      <!-- 表单组件 -->
      <el-form ref="editForm" status-icon :model="editForm" :rules="rules" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
         <el-form-item label="用户昵称" prop="nickName">
          <el-tag type="info">{{editForm.nickName}}</el-tag>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-tag type="info">{{editForm.mobile}}</el-tag>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-tag type="info">{{editForm.gender === '1' ? '男' : '女'}}</el-tag>
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
import { fetchPageList, fetchListItemById } from '@/api/user'
export default {
  data () {
    return {
      tableList: [],
      userid: '',
      // 分页列表数据渲染
      listPage: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        username: '',
        nickName: '',
        mobile: '',
        gender: '',
        id: ''
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
      fetchListItemById(this.userid).then(res => {
        this.tableList = []
        this.tableList.push(res.data)
        this.listPage.total = this.tableList.length
        this.listPage.currentPage = 1
      })
    },

    handleSizeChange (val) {
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.fetchData()
    },
    indexMethod (index) {
      return index + 1 + (this.listPage.currentPage - 1) * this.listPage.pageSize
    },
   
    showEdit (user) {
      this.editDialogVisible = true
      this.editForm.id = user.id
      this.editForm.username = user.username
      this.editForm.nickName = user.nickName
      this.editForm.mobile = user.mobile
      this.editForm.gender = user.gender
    }
  }

}
</script>

<style lang="scss" socped>
.input-with-select{
  width: 400px;
  margin-bottom: 10px;
}
</style>

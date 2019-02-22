<template>
    <div class="app-container">
         <!-- 搜索框 -->
      <el-input placeholder="请输入商品ID" v-model="productId" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchListItemById"></el-button>
      </el-input>
      <el-button type="success" plain @click="showAdd">添加商品</el-button>
        <!-- 商品列表表格 -->
      <el-row>
      <el-table
        :data="tableList"
        style="width: 100%">
        <el-table-column type="index" :index="indexMethod"></el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          :span="4">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          :span="4"
        >
        </el-table-column>
        <el-table-column
          prop="discountPrice"
          label="折后价格"
          :span="4"
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="商品描述"
          :span="4"
        >
        <template slot-scope="scope">
          <el-button @click="show(scope.row)" type="primary" size="mini" plain circle>预览</el-button>
        </template>
        </el-table-column>
         <el-table-column label="操作" :span="4">
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
      <!-- 添加的对话框 -->
    <el-dialog
      title="添加商品"
      :visible.sync="addDialogVisible"
      width="40%">
      <!-- 表单组件 -->
      <el-form ref="addForm" status-icon :model="addForm" label-width="80px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="addForm.price" placeholder="请输入价格"></el-input>
        </el-form-item>
        <el-form-item label="折后价格" prop="discountPrice">
          <el-input v-model="addForm.discountPrice" placeholder="请输入折后价格"></el-input>
        </el-form-item>
        <el-form-item label="添加图片" prop="image">
          <!-- <el-input v-model="addForm.image"></el-input> -->
          <el-upload
            class="upload-demo"
            action="http://47.100.174.37:8080/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList2"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="addForm.description" placeholder="请输入商品描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewProduct">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 显示商品描述的对话框 -->
    <el-dialog
      title="商品描述详情"
      :visible.sync="showDialogVisible"
      width="40%">
      <!-- 表单组件 -->
      <el-form ref="showForm" status-icon :model="editForm" label-width="80px">
        <el-form-item label="商品描述" prop="description">
          <el-tag type="info">{{showForm.description}}</el-tag>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
        <!-- 修改的对话框 -->
     <el-dialog
      title="修改商品"
      :visible.sync="editDialogVisible"
      width="40%">
      <!-- 表单组件 -->
      <el-form ref="editForm" status-icon :model="editForm" label-width="80px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="editForm.price" placeholder="请输入价格"></el-input>
        </el-form-item>
        <el-form-item label="折后价格" prop="discountPrice">
          <el-input v-model="editForm.discountPrice" placeholder="请输入折后价格"></el-input>
        </el-form-item>
      </el-form>
      <!-- <quill-editor v-model="content"
                ref="myQuillEditor"
                @change="onEditorChange($event)"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)">
      </quill-editor> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateItem">确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>
<script>
import { fetchList, fetchListItemById, addNewItem, updateItem, deleteItemById } from '@/api/product'
export default {
  data () {
    return {
      // 富文本输入内容
      content: '',
      defaultMsg: '这里是UE测试',
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      },
      ue1: 'user1',
      // 分页列表数据渲染
      listPage: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      tableList: [],
      productId: '',
      // 添加的对话框
      addDialogVisible: false,
      addForm: {
        name: '',
        price: '',
        discountPrice: '',
        image: '',
        description: ''
      },
      fileList2: [],
      //  显示商品描述的对话框
      showDialogVisible: false,
      showForm: {
        description: ''
      },
      // 修改的对话框
      editDialogVisible: false,
      editForm: {
        name: '',
        price: '',
        discountPrice: '',
        image: '',
        description: '',
        id: ''
      }
    }
  },
  created () {
   /*  this.getproductList()
    this.getproductPage() */
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchList(this.listPage).then(res => {
        console.log(res)
        let response = res.data
        this.tableList= response
      })
    },
    searchListItemById(){
      fetchListItemById(this.productId).then(res => {
        this.tableList = []
        this.tableList.push(res.data)
        /* this.listPage.total = this.tableList.length
        this.listPage.currentPage = 1 */
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
      this.$confirm('你确定要删除该商品吗', '温馨提示', {type: 'warning'})
      .then(()=>{
        deleteItemById(id).then(res => {
          this.$message.success('删除成功')
          this.fetchData()
        })
      })
    },

    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    
    handleSizeChange (val) {
      this.listPage.pageSize = val
      this.getproductPage()
    },
    handleCurrentChange (val) {
      this.listPage.currentPage = val
      this.getproductPage()
    },
    indexMethod (index) {
      return index + 1 + (this.listPage.currentPage - 1) * this.listPage.pageSize
    },
    showAdd () {
      this.addDialogVisible = true
    },
    
    show (product) {
      this.showDialogVisible = true
      this.showForm.description = product.description
    },
    showEdit (product) {
      this.editDialogVisible = true
      this.editForm.id = product.id
      this.editForm.name = product.name
      this.editForm.price = product.price
      this.editForm.discountPrice = product.discountPrice
      this.editForm.description = product.description
    },
   
    onEditorReady (e) {},
   
  }
}
</script>

<style lang="scss" socped>
.input-with-select{
  width: 400px;
  margin-bottom: 10px;
}
</style>

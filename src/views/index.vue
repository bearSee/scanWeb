<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-01 18:31:16
 * @LastEditTime: 2020-05-31 14:16:01
 * @LastEditors: Please set LastEditors
 -->
<template>
  <el-container class="index">
    <el-header class="index-head">
      <div class="logo-box">
        <img class="logo" src="@/assets/image/logo.png" alt="">
        <div class="logo-des">Scaner Client</div>
      </div>
      <div class="search-box">
        <div class="label">单号</div>
        <el-input v-model="imageNumber" placeholder="请输入单号，点击按钮进行检索">
          <template slot="suffix">
            <img class="searh-icon" @click="getImageList" src="@/assets/image/search-icon.png" alt="">
          </template>
        </el-input>
      </div>
      <div class="head-right">
        <div class="user-box">
          <div class="user-name">{{ userName }}</div>
          <img class="avatar" src="@/assets/image/avatar.png" alt="">
        </div>
        <div class="oprate-box">
          <img class="refresh" @click="handlerRefresh" src="@/assets/image/refresh.png" alt="">
          <img class="set" @click="handlerSet" src="@/assets/image/set.png" alt="">
          <img class="close" @click="handlerLoginOut" src="@/assets/image/close.png" alt="">
        </div>
      </div>
    </el-header>
    <el-main class="index-content" v-loading="isLoading">
      <!-- 主菜单 -->
      <div class="main-menus">
        <div
          class="menu"
          v-for="(menu, i) in mainMenus"
          :key="i"
          @click="handlerClickMenu(menu)">
          <img class="icon" :src="require('@/assets/image/' + menu.icon)" alt="">
          <el-badge :value="menu.tipNum" class="item">
            <span>{{ menu.name }}</span>
          </el-badge>
        </div>
      </div>
      <!-- 档案区 -->
      <div class="image-area">
        <div class="area">
          <div
            class="image-box"
            v-for="img in images"
            :key="img.id">
            <div class="image-content">
              <template>
                <img v-if="img.checked" class="checked-icon" src="@/assets/image/checked.png" alt="">
                <div v-else class="unchecked-icon"></div>
              </template>
              <input class="checkbox" type="checkbox" v-model="img.checked">
              <!-- <img class="image" :src="img.imagePath" alt=""> -->
              <el-image
                class="image"
                :src="img.imagePath"
                :preview-src-list="[img.imagePath]">
              </el-image>
              <div class="img-name">{{ img.imageName }}</div>
            </div>
            <div class="image-des" v-if="img.status">
              {{ img.status }}：{{ img.statusReason }}
            </div>
          </div>
        </div>
      </div>
      <!-- 副菜单 -->
      <div class="main-menus sub-menu">
        <div
          class="menu"
          v-for="(menu, i) in subMenus"
          :key="i"
          @click="handlerClickMenu(menu)">
          <img class="icon" :src="require('@/assets/image/' + menu.icon)" alt="">
          <span>{{ menu.name }}</span>
        </div>
      </div>
      <!-- 上传列队 -->
      <div class="upload-list">
        <div class="title">上传列队</div>
        <div class="upload-table">
          <el-table
            :data="uploadTableData"
            stripe>
            <el-table-column
              prop="oprate"
              label="操作"
              width="70">
              <template slot-scope="{ row }">
                <el-dropdown :class="{
                    'disabled': row && row.status !== 'fail',
                  }"
                  @command="handleCommand($event, row)">
                  <span>选择<i class="el-icon-arrow-down el-icon--right"></i></span>
                  <el-dropdown-menu slot="dropdown" v-if="row.status === 'fail'">
                    <el-dropdown-item command="reupload">重传</el-dropdown-item>
                    <el-dropdown-item command="reset">还原</el-dropdown-item>
                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column
              v-for="col in uploadTableColumn"
              :key="col.code"
              :prop="col.code"
              :label="col.label"
              :width="col.width"
              :show-overflow-tooltip="col.tips">
            </el-table-column>
          </el-table>
        </div>
        <!-- 设置弹窗 -->
        <el-drawer
          class="set-drawer"
          :modal="false"
          :append-to-body="false"
          :visible.sync="drawerVisible"
          :withHeader="false"
          direction="rtl">
          <el-form
            class="set-form"
            size="mini"
            ref="setForm"
            :model="serFormData"
            :rules="rules">
            <el-form-item label="应用系统" prop="applicationSystem">
              <el-input v-model="serFormData.applicationSystem" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="上传模式" prop="uploadModel">
              <el-radio-group v-model="serFormData.uploadModel">
                <el-radio label="HTTP">HTTP</el-radio>
                <el-radio label="FTP">FTP被动</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="条码规则" prop="barCodeRule">
              <el-input v-model="serFormData.barCodeRule" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="非空白率" prop="notBlankRate">
              <el-input v-model="serFormData.notBlankRate" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="串口名称" prop="portName">
              <el-input v-model="serFormData.portName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="波特率" prop="baudRate">
              <el-input v-model="serFormData.baudRate" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="扫描设备" prop="scanEquipment">
              <el-input v-model="serFormData.scanEquipment" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="编码规则" class="encoding-rules" :class="{
              'check-mark': !!rules.letter,
            }">
              <el-form-item prop="letter">
                <el-input v-model="serFormData.letter" placeholder="字母"></el-input><span class="conect-str">+</span>
              </el-form-item>
              <el-form-item prop="dateNum">
                <el-input v-model="serFormData.dateNum" placeholder="年月日"></el-input><span class="conect-str">+</span>
              </el-form-item>
              <el-form-item prop="SerialNumber">
                <el-input v-model="serFormData.SerialNumber" placeholder="流水"></el-input>
              </el-form-item>
              <!-- <el-input v-model="serFormData.letter" placeholder="字母"></el-input><span class="conect-str">+</span>
              <el-input v-model="serFormData.dateNum" placeholder="年月日"></el-input><span class="conect-str">+</span>
              <el-input v-model="serFormData.SerialNumber" placeholder="流水"></el-input> -->
            </el-form-item>
          </el-form>
          <div class="oprate-box">
            <el-button type="primary" @click="handlerSaveSet">保 存</el-button>
            <el-button @click="drawerVisible = false">取 消</el-button>
          </div>
        </el-drawer>
      </div>
    </el-main>
    <el-dialog
      title="编辑单号"
      class="editNumber-dialog"
      width="35%"
      :close-on-click-modal="false"
      :visible.sync="editNumberVisible">
      <el-form
        class="edit-number-form"
        :model="form"
        size="mini">
        <el-form-item label="影像单号" class="imageNumber">
          <el-input v-model="form.imageNumber" placeholder="请输入单号"></el-input>
        </el-form-item>
        <el-form-item class="submit">
          <el-button @click="editNumberVisible = false">取消</el-button>
          <el-button type="primary" @click="handlerSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-upload
      style="display: none"
      ref="upload"
      :action="uploadConfig.action"
      :headers="uploadConfig.headers"
      :data="uploadConfig.params"
      :limit="uploadConfig.limit"
      :beforeUpload="handleBeforeUpload"
      :onError="handleUploadError"
      :onSuccess="handleUploadSuccess">
      <el-button ref="uploadBtn" slot="trigger" size="small" type="primary">选取文件</el-button>
    </el-upload>
  </el-container>
</template>

<script>

export default {
  name: 'index',
  data() {
    return {
      userName: '10086生生世世绅士手',
      imageNumber: '',
      isLoading: false,
      // 主菜单
      mainMenus: [
        {
          name: '直接扫描',
          code: 'directScan',
          icon: 'directScan.png',
          fn: 'directScan',
        },
        {
          name: '新增档案',
          code: 'addNewFile',
          icon: 'addNewFile.png',
          fn: 'addNewFile',
        },
        {
          name: '待办任务',
          code: 'waitingTask',
          icon: 'waitingTask.png',
          tipNum: '3',
        },
        {
          name: '直接补件',
          code: 'directPatch',
          icon: 'directPatch.png',
          fn: 'directPatch',
        },
      ],
      // 图像数据
      images: [
        {
          imagePath: 'http://www.bearsee.com.cn/images/study-bg.jpg',
          imageName: 'SDSDS64345645453454',
          imageNumber: '113324255gsdd',
          id: '1',
          status: '补扫',
          statusReason: '缺少发票',
        },
        {
          imagePath: 'http://www.bearsee.com.cn/images/study-bg.jpg',
          imageName: 'SDSDS64345645453454',
          imageNumber: '113324255gsdd',
          id: '2',
          status: '',
          statusReason: '',
        },
        {
          imagePath: 'http://www.bearsee.com.cn/images/study-bg.jpg',
          imageName: 'SDSDS64345645453454',
          imageNumber: '113324255gsdd',
          id: '3',
          status: '补扫',
          statusReason: '缺少发票',
        },
        {
          imagePath: 'http://www.bearsee.com.cn/images/study-bg.jpg',
          imageName: 'SDSDS64345645453454',
          imageNumber: '113324255gsdd',
          id: '4',
          status: '补扫',
          statusReason: '缺少发票',
        },
        {
          imagePath: 'http://www.bearsee.com.cn/images/study-bg.jpg',
          id: '5',
          status: '',
          statusReason: '',
        },
        {
          imagePath: 'http://www.bearsee.com.cn/images/study-bg.jpg',
          imageName: 'SDSDS64345645453454',
          imageNumber: '113324255gsdd',
          id: '6',
          status: '',
          statusReason: '',
        },
      ],
      // 副菜单
      subMenus: [
        {
          name: '上传图像',
          code: 'uploadImage',
          icon: 'uploadImage.png',
          fn: 'uploadImage',
        },
        {
          name: '导入图像',
          code: 'importImage',
          icon: 'importImage.png',
          fn: 'importImage',
        },
        {
          name: '补扫文件',
          code: 'supplementFile',
          icon: 'supplementFile.png',
          fn: 'supplementFile',
        },
        {
          name: '重新扫描',
          code: 'scanAgain',
          icon: 'scanAgain.png',
          fn: 'scanAgain',
        },
        {
          name: '替扫图像',
          code: 'insteadImage',
          icon: 'insteadImage.png',
          fn: 'insteadImage',
        },
        {
          name: '编辑单号',
          code: 'editNumber',
          icon: 'editNumber.png',
          fn: 'editNumber',
        },
        {
          name: '删除',
          code: 'deleteImage',
          icon: 'delete.png',
          fn: 'deleteImage',
        },
      ],
      // 上传列队列名
      uploadTableColumn: [
        {
          label: '单号',
          code: 'imageNumber',
          width: 100,
          tips: true,
        },
        {
          label: '页数',
          code: 'pageNumber',
          width: 50,
        },
        {
          label: '状态',
          code: 'statusName',
          width: 60,
        },
        {
          label: '原因',
          code: 'reason',
          tips: true,
        },
      ],
      // 上传列队数据
      uploadTableData: [
        {
          imageNumber: 'SSDFS12323213423123213',
          pageNumber: '23',
          status: 'sucssece',
          statusName: '成功',
          reason: '',
        },
        {
          imageNumber: 'SSDFS1232321123213',
          pageNumber: '5',
          status: 'fail',
          statusName: '失败',
          reason: '连接超时撒打算是生生世世事实上的',
        },
        {
          imageNumber: 'SSDFS12323',
          pageNumber: '16',
          status: 'fail',
          statusName: '失败',
          reason: '连接超时撒打算的',
        },
      ],
      // 编辑单号
      editNumberVisible: false,
      form: {},
      // 上传配置
      uploadConfig: {
        action: '',
        // headers: {},
        params: {},
        limit: 1,
        fileType: ['.png', '.jpg'],
      },
      // 设置弹窗
      drawerVisible: false,
      serFormData: {
        applicationSystem: '应用系统测试文字',
        uploadModel: 'HTTP',
        barCodeRule: '条码规则测试文字',
        notBlankRate: '非空白率测试文字',
        portName: '串口名称测试文字',
        baudRate: '波特率测试文字',
        scanEquipment: '扫描设备测试文字',
        letter: '字母测试文字',
        dateNum: '年月日测试文字',
        SerialNumber: '流水测试文字',
      },
      // 校验规则
      rules: {
        applicationSystem: [
          { required: true, message: '请输入应用系统', trigger: 'blur' },
        ],
        uploadModel: [
          { required: true, message: '请选择上传模式', trigger: 'change' },
        ],
        barCodeRule: [
          { required: true, message: '请输入条码规则', trigger: 'blur' },
        ],
        notBlankRate: [
          { required: true, message: '请输入非空白率', trigger: 'blur' },
        ],
        portName: [
          { required: true, message: '请输入串口名称', trigger: 'blur' },
        ],
        baudRate: [
          { required: true, message: '请输入波特率', trigger: 'blur' },
        ],
        scanEquipment: [
          { required: true, message: '请输入扫描设备', trigger: 'blur' },
        ],
        letter: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        dateNum: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        SerialNumber: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.getImageList();
    this.getTableList();
  },
  methods: {
    // 顶部设置按钮
    handlerSet() {
      this.drawerVisible = !this.drawerVisible;
    },
    // 保存设置弹窗表单
    handlerSaveSet() {
      console.log('serFormData', this.serFormData);
      this.$refs.setForm.validate((valid) => {
        if (valid) {
          this.$message.success('校验通过');
          this.isLoading = true;
          this.$http.post('', this.serFormData).then(
            () => {
              this.$router.push('/login');
            },
            () => {},
          ).finally(() => {
            this.isLoading = false;
          });
          return true;
        }
        this.$message.warning('校验失败');
        return false;
      });
    },
    // 顶部刷新按钮
    handlerRefresh() {
      this.getImageList();
    },
    // 顶部注销按钮
    handlerLoginOut() {
      this.$confirm('请确认是否退出登录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.isLoading = true;
        this.$http.post('', {}).then(
          () => {
            this.$router.push('/login');
          },
          () => {},
        ).finally(() => {
          this.isLoading = false;
        });
      });
    },
    // 获取图像列表数据
    getImageList() {
      this.isLoading = true;
      const params = {
        imageNumber: this.imageNumber,
      };
      this.$http.post('', params).then(
        ({ data }) => {
          this.images = data.images;
          const index = this.mainMenus.findIndex(({ code }) => code === 'waitingTask');
          this.mainMenus[index].tipNum = this.images.length;
        },
        () => {},
      ).finally(() => {
        this.isLoading = false;
      });
    },
    // 点击主菜单/副菜单
    handlerClickMenu(menu) {
      if (menu.fn) this[menu.fn](menu);
    },
    // 直接扫描
    directScan() {
      this.isLoading = true;
      this.$http.post('', {}).then(
        () => {
          this.$message.success('操作成功');
          this.getImageList();
        },
        () => {},
      ).finally(() => {
        this.isLoading = false;
      });
    },
    // 新增档案
    addNewFile() {
      this.isLoading = true;
      this.$http.post('', {}).then(
        () => {
          this.$message.success('操作成功');
          this.getImageList();
        },
        () => {},
      ).finally(() => {
        this.isLoading = false;
      });
    },
    // 直接补件
    directPatch() {
      this.isLoading = true;
      this.$http.post('', {}).then(
        () => {
          this.$message.success('操作成功');
          this.getImageList();
        },
        () => {},
      ).finally(() => {
        this.isLoading = false;
      });
    },
    // 上传图像
    uploadImage() {
      const selectRows = this.images.filter(({ checked }) => checked);
      if (!selectRows.length) {
        this.$message.warning('请勾选至少一条档案数据');
        return;
      }
      const params = selectRows.map(({ id }) => id);
      this.isLoading = true;
      this.$http.post('', params).then(
        () => {
          this.$message.success('操作成功');
          this.getImageList();
        },
        () => {},
      ).finally(() => {
        this.isLoading = false;
      });
    },
    // 导入图像
    importImage() {
      this.$refs.uploadBtn.$el.click();
    },
    // 导入前
    handleBeforeUpload(file) {
      const fileType = file.name.slice(file.name.lastIndexOf('.'));
      const validator = this.uploadConfig.fileType.includes(fileType);
      if (validator) {
        this.isLoading = true;
      } else {
        this.$message.warning('文件类型有误，请重新上传');
      }
      return validator;
    },
    // 导入成功
    handleUploadSuccess(res) {
      console.log('导入成功', res);
      this.isLoading = false;
      this.$message.success('导入成功');
      this.getImageList();
    },
    // 导入失败
    handleUploadError(err) {
      console.log('导入失败', err);
      this.isLoading = false;
      this.$message.warning('导入失败');
    },
    // 补扫文件
    supplementFile() {
      this.isLoading = true;
      this.$http.post('', {}).then(
        () => {
          this.$message.success('操作成功');
          this.getImageList();
        },
        () => {},
      ).finally(() => {
        this.isLoading = false;
      });
    },
    // 重新扫描
    scanAgain() {
      this.isLoading = true;
      this.$http.post('', {}).then(
        () => {
          this.$message.success('操作成功');
          this.getImageList();
        },
        () => {},
      ).finally(() => {
        this.isLoading = false;
      });
    },
    // 替扫图像
    insteadImage() {
      this.isLoading = true;
      this.$http.post('', {}).then(
        () => {
          this.$message.success('操作成功');
          this.getImageList();
        },
        () => {},
      ).finally(() => {
        this.isLoading = false;
      });
    },
    // 编辑单号
    editNumber() {
      const selectRows = this.images.filter(({ checked }) => checked);
      if (!selectRows.length) {
        this.$message.warning('请勾选一条档案数据');
        return;
      }
      if (selectRows.length > 1) {
        this.$message.warning('只能选择一条档案数据进行编辑');
        return;
      }
      this.form = { ...selectRows[0] };
      this.editNumberVisible = true;
    },
    // 提交单号
    handlerSubmit() {
      this.isLoading = true;
      this.$http.post('', this.form).then(
        () => {
          this.$message.success('操作成功');
          this.getImageList();
        },
        () => {},
      ).finally(() => {
        this.isLoading = false;
      });
    },
    // 删除文件
    deleteImage() {
      const selectRows = this.images.filter(({ checked }) => checked);
      if (!selectRows.length) {
        this.$message.warning('请勾选至少一条档案数据');
        return;
      }
      this.$confirm('请确认是否删除选中档案', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const params = selectRows.map(({ id }) => id);
        this.isLoading = true;
        this.$http.post('', params).then(
          () => {
            this.$message.success('操作成功');
            this.getImageList();
          },
          () => {},
        ).finally(() => {
          this.isLoading = false;
        });
      });
    },
    // 获取上传列表
    getTableList() {
      this.isLoading = true;
      this.$http.post('', {}).then(
        ({ data }) => {
          this.uploadTableData = data.list || [];
        },
        () => {},
      ).finally(() => {
        this.isLoading = false;
      });
    },
    // 列表上传失败操作
    handleCommand(command, row) {
      if (this[command]) this[command](row);
    },
    // 重传
    reupload(row) {
      console.log('重传', row);
      this.isLoading = true;
      this.$http.post('', { id: row.id }).then(
        () => {
          this.$message.success('重传成功');
          this.getTableList();
        },
        () => {},
      ).finally(() => {
        this.isLoading = false;
      });
    },
    // 还原
    reset(row) {
      console.log('还原', row);
      this.isLoading = true;
      this.$http.post('', { id: row.id }).then(
        () => {
          this.$message.success('还原成功');
          this.getTableList();
        },
        () => {},
      ).finally(() => {
        this.isLoading = false;
      });
    },
    // 删除行
    delete(row) {
      console.log('删除', row);
      this.isLoading = true;
      this.$http.post('', { id: row.id }).then(
        () => {
          this.$message.success('删除成功');
          this.getTableList();
        },
        () => {},
      ).finally(() => {
        this.isLoading = false;
      });
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";
@import "@/assets/scss/style.scss";

.index {
  width: 100%;
  height: 100%;
  font-size: 16px;
  color: #fff;;
  .index-head {
    background: $sub-theme;
    display: flex;
    .logo-box {
      display: flex;
      width: 200px;
      .logo {
        width: 50px;
        height: 50px;
        margin: auto 0;
      }
      .logo-des {
        font-size: 20px;
        margin: auto 10px;
      }
    }
    .search-box {
      display: flex;
      .label {
        width: 50px;
        margin: auto 10px;
      }
      .el-input {
        margin: auto 10px;
        .el-input__inner {
          width: 250px;
          border-radius: 20px;
          padding-right: 40px;
          background: #605e96;
          border: 0;
          color: #b8b3f2;
          // color: #fff;
        }
        .el-input__suffix {
          display: flex;
          right: 23px;
          .el-input__suffix-inner {
            display: flex;
            .searh-icon {
              width: 20px;
              cursor: pointer;
              margin: auto;
            }
          }
        }
      }
    }
    .head-right {
      flex: 1 1 auto;
      display: flex;
      justify-content: flex-end;
      .user-box {
        display: flex;
        .user-name {
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: auto 0;
        }
        .avatar {
          width: 40px;
          height: 40px;
          margin: auto 10px;
        }
      }
      .oprate-box {
        display: flex;
        padding-left: 30px;
        img {
          height: 20px;
          margin: auto 10px;
          cursor: pointer;
        }
      }
    }
  }
  .index-content {
    background: $theme;
    display: flex;
    padding: 0;
    .main-menus {
      width: 250px;
      border-right: 1px solid #39355a;
      overflow-y: auto;
      .menu {
        display: flex;
        height: 80px;
        line-height: 80px;
        padding-left: 60px;
        border-bottom: 1px solid #39355a;
        cursor: pointer;
        &:active {
          background: $deep-theme;
        }
        .icon {
          margin: auto 10px;
          width: 15px;
        }
        .el-badge {
          display: flex;
          .el-badge__content {
            position: static;
            transform: none;
            margin: auto 10px;
            background: #f93338;
            border: 0;
          }
        }
      }
    }
    .sub-menu {
      width: 180px;
      .menu {
        padding-left: 30px;
        .icon {
          width: 18px;
        }
      }
    }
    .image-area {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      flex: 1 1 360px;
      background: $deep-theme;
      border-right: 1px solid #39355a;
      .area {
        padding: 20px 40px;
        display: flex;
        flex-wrap: wrap;
        .image-box {
          width: 150px;
          margin-right: 20px;
          margin-bottom: 10px;
          .image-content {
            width: 100%;
            height: 200px;
            padding: 20px;
            padding-bottom: 10px;
            box-sizing: border-box;
            background: #48437b;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            .checked-icon,.unchecked-icon {
              position: absolute;
              right: 0;
              top: 0;
              width: 20px;
              height: 20px;
            }
            .unchecked-icon {
              border: 2px solid #3ebfb3;
            }
            .image {
              width: 100%;
              flex: 1 1 auto;
            }
            .img-name {
              height: 40px;
              font-size: 13px;
              line-height: 1.2;
              padding-top: 10px;
              word-break: break-all;
              overflow: hidden;
            }
            .checkbox {
              position: absolute;
              width: 100%;
              height: 100%;
              margin: 0;
              left: 0;
              top: 0;
              z-index: 0;
              opacity: 0;
            }
          }
          .image-des {
            width: 100%;
            background: #fad040;
            color: $theme;
            font-size: 14px;
            text-align: center;
            margin: 10px 0;
            padding: 5px;
            border-radius: 5px 0 5px 5px;
          }
        }
      }
      /*滚动条样式*/
      &::-webkit-scrollbar {
        width: 4px;
        background: $sub-theme;
      }
      &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: $sub-theme;
      }
      &::-webkit-scrollbar-track {/*滚动条里面轨道*/
        border-radius: 4px;
        background: $theme;
      }
    }
    .upload-list {
      width: 400px;
      position: relative;
      .title {
        line-height: 79px;
        border-bottom: 1px solid #39355a;
        text-align: center;
        font-size: 20px;
      }
      .upload-table {
        width: 100%;
        .el-table {
          color: #fff;
          background: transparent;
          &::before {
            background: #39355a;
          }
          th, td, tr {
            line-height: 22px;
            background: transparent;
            color: #fff;
            border-color: #39355a;
          }
          .el-dropdown {
            font-size: 12px;
            color: #7976a5;
            span {
              cursor: pointer;
            }
            &.disabled {
              span {
                cursor: not-allowed;
                color: #514f79f2;
              }
            }
          }
        }
      }
      .set-drawer {
        position: absolute;
        .el-drawer {
          width: 100%!important;
          background: $theme;
          .el-drawer__body {
            padding: 40px 30px;
            display: block;
            .el-form-item {
              display: flex;
              .el-form-item__label {
                width: 80px;
                min-width: 80px;
                color: #fff;
              }
              .el-form-item__content {
                flex: 1 1 auto;
                .el-radio-group {
                  .el-radio {
                    &.is-checked {
                      .el-radio__label {
                        color: #54acb2;
                      }
                      .el-radio__inner {
                        border-color: #54acb2;
                        background: #54acb2;
                      }
                    }
                  }
                }
                .el-input__inner {
                  // border-radius: 20px;
                  // color: #b8b3f2;
                  border: 0;
                  background: #605e96;
                  color: #fff;
                }
              }
              &.encoding-rules {
                &.check-mark {
                  .el-form-item__label::before {
                    content: '*';
                    color: #F56C6C;
                    margin-right: 4px;
                  }
                }
                .el-form-item__content {
                  display: flex;
                  .conect-str {
                    margin: 0 5px;
                  }
                  .el-input__inner {
                    padding: 0 5px;
                  }
                }
              }
            }
            .oprate-box {
              width: 100%;
              height: 30px;
              margin-top: 50px;
              display: flex;
              justify-content: space-between;
              .el-button {
                padding: 7px 25px;
                span {
                  font-size: 14px;
                }
              }
            }
          }
        }
      }
    }
  }
}
.editNumber-dialog {
  .el-dialog {
    .el-dialog__title {
              color: #beb9fb;
    }
    .el-dialog__body {
      padding-bottom: 10px;
      .el-form {
        .el-form-item__label {
          // color: #fff;
              color: #beb9fb;
        }
        .imageNumber {
          display: flex;
          .el-form-item__content {
            flex: 1 1 auto;
            .el-input__inner {
              background: #605e96;
              color: #beb9fb;
            }
          }
        }
        .submit {
          .el-form-item__content {
            text-align: right;
          }
        }
      }
    }
  }
}
</style>

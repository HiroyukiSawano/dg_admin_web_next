<template>
  <div class="el-page">
    <el-card header="打印控制">
      <el-form inline>
        <el-form-item label="页面大小">
          <el-select v-model="printSettings.pageSize" style="width: 176px">
            <el-option label="A4" value="A4" />
            <el-option label="A3" value="A3" />
            <el-option label="Letter" value="Letter" />
            <el-option label="Legal" value="Legal" />
          </el-select>
        </el-form-item>
        <el-form-item label="打印方向">
          <el-select v-model="printSettings.orientation" style="width: 176px">
            <el-option label="纵向" value="portrait" />
            <el-option label="横向" value="landscape" />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="printDocument">打印文档</el-button>
          <el-button type="primary" plain @click="printTable">打印表格</el-button>
          <el-button type="primary" plain @click="printImage">打印图片</el-button>
          <el-button @click="customPrint">自定义打印</el-button>
          <el-button @click="printSelected">打印选中内容</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 文档打印区域 -->
    <el-card header="文档打印">
      <div ref="documentRef" style="padding: 20px; background: var(--el-bg-color); border-radius: var(--el-border-radius-base)">
        <h1 style="margin-bottom: 20px; font-size: 28px; font-weight: bold; color: var(--el-color-primary); text-align: center">
          测试打印文档的标题
        </h1>

        <div>
          <p style="margin-bottom: 10px; font-size: 16px; font-style: italic; line-height: 1.8; color: var(--el-text-color-regular)">
            这是一个用于演示打印功能的文档内容。您可以在这里添加任何需要打印的文本内容。
          </p>
        </div>

        <h2
          style="
            padding-bottom: 8px;
            margin: 30px 0 15px 0;
            font-size: 22px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            border-bottom: 2px solid var(--el-color-primary-light-5);
          "
        >
          ✨ 功能特点
        </h2>
        <ul style="padding-left: 25px; font-size: 15px; line-height: 1.8; color: var(--el-text-color-regular)">
          <li style="position: relative; margin-bottom: 8px">
            <span style="margin-right: 8px; font-weight: 600; color: var(--el-color-success)">✓</span>
            支持多种打印格式
          </li>
          <li style="position: relative; margin-bottom: 8px">
            <span style="margin-right: 8px; font-weight: 600; color: var(--el-color-success)">✓</span>
            自定义打印设置
          </li>
          <li style="position: relative; margin-bottom: 8px">
            <span style="margin-right: 8px; font-weight: 600; color: var(--el-color-success)">✓</span>
            打印预览功能
          </li>
          <li style="position: relative; margin-bottom: 8px">
            <span style="margin-right: 8px; font-weight: 600; color: var(--el-color-success)">✓</span>
            响应式设计
          </li>
        </ul>
      </div>
    </el-card>

    <el-card header="表格打印">
      <div ref="tableRef">
        <el-table border :data="tableData" highlight-current-row stripe style="width: 100%">
          <el-table-column label="姓名" prop="name" width="120" />
          <el-table-column label="地址" prop="address" />
        </el-table>
      </div>
    </el-card>

    <el-card header="图片打印">
      <div ref="imageRef" style="padding: 20px; text-align: center">
        <img
          alt="风景图片"
          src="https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg"
          style="
            width: 100%;
            max-width: 500px;
            height: auto;
            border-radius: var(--el-border-radius-base);
            box-shadow: 0 2px 8px var(--el-border-color);
          "
        />
      </div>
    </el-card>

    <!-- 自定义打印对话框 -->
    <el-dialog v-model="customPrintVisible" title="自定义打印" :width="720" destroy-on-close append-to-body>
      <el-form label-width="100px" :model="customPrintForm">
        <el-form-item label="打印标题">
          <el-input v-model="customPrintForm.title" placeholder="请输入打印标题" />
        </el-form-item>
        <el-form-item label="打印内容">
          <el-input v-model="customPrintForm.content" placeholder="请输入要打印的内容（支持HTML标签）" :rows="8" type="textarea" />
        </el-form-item>
        <el-form-item label="页脚信息">
          <el-input v-model="customPrintForm.footer" placeholder="请输入页脚信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="customPrintVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCustomPrint">确认打印</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import Print from '@/plugins/print'

defineOptions({
  name: 'vabPrint',
})

// 响应式数据
const imageRef = ref()
const tableRef = ref()
const documentRef = ref()

// 打印设置
const printSettings = reactive({
  pageSize: 'A4',
  orientation: 'portrait',
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '马云',
    address: '上海市普陀区金沙江路',
  },
  {
    id: 2,
    name: '马化腾',
    address: '深圳市南山区科技园',
  },
  {
    id: 3,
    name: '李彦宏',
    address: '北京市海淀区中关村',
  },
  {
    id: 4,
    name: '刘强东',
    address: '北京市朝阳区京东总部',
  },
])

// 对话框状态
const customPrintVisible = ref(false)

// 自定义打印表单
const customPrintForm = reactive({
  title: '自定义打印内容',
  content: `<h1>自定义打印标题</h1>
<p>这是一个自定义打印内容的示例。</p>
<ul>
    <li>支持HTML标签</li>
    <li>自定义样式</li>
    <li>灵活配置</li>
</ul>`,
  footer: `打印时间：${new Date().toLocaleString()}`,
})

// 当前时间
const currentTime = ref(new Date().toLocaleString())

// 更新时间
setInterval(() => {
  currentTime.value = new Date().toLocaleString()
}, 1000)

// 打印图片
const printImage = async () => {
  try {
    await Print(imageRef.value, {
      title: '图片打印',
      footer: `打印时间：${new Date().toLocaleString()}`,
      pageSize: printSettings.pageSize,
      orientation: printSettings.orientation,
      customStyle: `
                img {
                    width: 100%;
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 0 auto;
                }
                .print-container {
                    text-align: center;
                    padding: 20px;
                }
            `,
      beforePrint: () => {
        ElMessage.info('正在准备打印...')
      },
      afterPrint: () => {
        ElMessage.success('图片打印成功')
      },
      onError: (error) => {
        ElMessage.error('图片打印失败')
        console.error('打印错误:', error)
      },
    })
  } catch (error) {
    ElMessage.error('图片打印失败')
    console.error('打印错误:', error)
  }
}

// 打印表格
const printTable = async () => {
  try {
    await Print(tableRef.value, {
      title: '表格打印',
      footer: `打印时间：${new Date().toLocaleString()} | 共 ${tableData.value.length} 条记录`,
      pageSize: printSettings.pageSize,
      orientation: printSettings.orientation,
      customStyle: `
                .el-table { width: 100%; border-collapse: collapse; }
                .el-table th, .el-table td { border: 1px solid #ebeef5; padding: 8px; }
                .el-table th { background-color: #f5f7fa; font-weight: bold; }
            `,
      beforePrint: () => {
        ElMessage.info('正在准备打印表格...')
      },
      afterPrint: () => {
        ElMessage.success('表格打印成功')
      },
      onError: (error) => {
        ElMessage.error('表格打印失败')
        console.error('打印错误:', error)
      },
    })
  } catch (error) {
    ElMessage.error('表格打印失败')
    console.error('打印错误:', error)
  }
}

// 打印文档
const printDocument = async () => {
  try {
    await Print(documentRef.value, {
      title: '测试打印文档',
      footer: `打印时间：${new Date().toLocaleString()} | 文档版本：v1.0.0`,
      pageSize: printSettings.pageSize,
      orientation: printSettings.orientation,
      beforePrint: () => {
        ElMessage.info('正在准备打印文档...')
      },
      afterPrint: () => {
        ElMessage.success('文档打印成功')
      },
      onError: (error) => {
        ElMessage.error('文档打印失败')
        console.error('打印错误:', error)
      },
    })
  } catch (error) {
    ElMessage.error('文档打印失败')
    console.error('打印错误:', error)
  }
}

// 自定义打印
const customPrint = () => {
  customPrintVisible.value = true
}

// 处理自定义打印
const handleCustomPrint = async () => {
  try {
    const content = `
            <div style="padding: 20px; font-family: 'Microsoft YaHei', Arial, sans-serif; background: var(--el-bg-color);">
                <h1 style="text-align: center; color: var(--el-color-primary); margin-bottom: 30px;">${customPrintForm.title}</h1>
                <div style="margin: 20px 0; line-height: 1.6; color: var(--el-text-color-regular);">
                    ${customPrintForm.content}
                </div>
                <div style="margin-top: 40px; text-align: center; color: var(--el-text-color-secondary); font-size: 12px; border-top: 1px solid var(--el-border-color); padding-top: 20px;">
                    ${customPrintForm.footer}
                </div>
            </div>
        `
    await Print(content, {
      pageSize: printSettings.pageSize,
      orientation: printSettings.orientation,
      beforePrint: () => {
        ElMessage.info('正在准备自定义打印...')
      },
      afterPrint: () => {
        ElMessage.success('自定义内容打印成功')
        customPrintVisible.value = false
      },
      onError: (error) => {
        ElMessage.error('自定义打印失败')
        console.error('打印错误:', error)
      },
    })
  } catch (error) {
    ElMessage.error('自定义打印失败')
    console.error('打印错误:', error)
  }
}

// 打印选中内容
const printSelected = () => {
  ElMessageBox.confirm('请先选择要打印的内容，然后点击确认', '打印选中内容', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info',
  })
    .then(() => {
      const selection = globalThis.getSelection()
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0)
        const container = document.createElement('div')
        container.appendChild(range.cloneContents())

        Print(container, {
          title: '选中内容打印',
          footer: `打印时间：${new Date().toLocaleString()}`,
          pageSize: printSettings.pageSize,
          orientation: printSettings.orientation,
          beforePrint: () => {
            ElMessage.info('正在准备打印选中内容...')
          },
          afterPrint: () => {
            ElMessage.success('选中内容打印成功')
          },
          onError: (error) => {
            ElMessage.error('选中内容打印失败')
            console.error('打印错误:', error)
          },
        })
      } else {
        ElMessage.warning('请先选择要打印的内容')
      }
    })
    .catch(() => {
      // 用户取消
    })
}
</script>

<template>
  <a-modal
    width="50vw"
    unmount-on-close
    :visible="modalVisible"
    :title="props.title"
    :footer="false"
    @cancel="cancel"
  >
    <div class="import-data-modal-container">
      <div class="progress">
        <div class="steps">
          <a-steps type="dot" :current="currentStep" label-placement="vertical">
            <a-step>
              <div class="step-desc">
                <div>上传文件</div>
              </div>
            </a-step>
            <a-step>
              <div class="step-desc">
                <div>数据预览</div>
              </div>
            </a-step>
            <a-step>
              <div class="step-desc">
                <div>导入数据</div>
              </div>
            </a-step>
            <a-step>
              <div class="step-desc">
                <div>导入完成</div>
              </div>
            </a-step>
          </a-steps>
        </div>
      </div>
      <div class="first" v-if="currentStep === 1">
        <div class="download-content">
          <div class="left">
            <i class="iconfont icon-jihua"></i>
          </div>
          <div class="right">
            <div class="title">填写导入数据信息</div>
            <div class="description"
              >请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除</div
            >
            <a-link @click="downloadTemplate">下载模板</a-link>
          </div>
        </div>
        <div class="upload-content">
          <div class="left">
            <i class="iconfont icon-shujuweihu"></i>
          </div>
          <div class="right">
            <div class="title">上传填好的信息表</div>
            <div class="description"
              >文件后缀名必须为xls或xlsx（即Excel格式），文件大小不得大于10M，最多支持导入3000条数据</div
            >
            <div class="file-list">
              <span style="color: var(--color-blue)">
                {{ fileList.length ? fileList[0].name : '' }}
              </span>
              <icon-close v-if="fileList.length" @click="deleteFileList" />
            </div>
            <a-upload
              :file-list="fileList"
              accept=".xls,.xlsx"
              action="/"
              :limit="1"
              :auto-upload="false"
              @before-upload="beforeUpload"
            >
              <template #upload-button>
                <a-link>上传文件</a-link>
              </template>
            </a-upload>
          </div>
        </div>
        <slot name="tips" />
      </div>
      <div class="second" v-if="currentStep === 2">
        <div class="warning-text" v-if="warningNum">
          <icon-close-circle style="color: #d43030; font-size: 16px" />
          {{
            warningNum
          }}条数据存在异常，详情请见下面列表中红色字体部分，并按照列表中异常说明及处理进行处理或者重新进行选择
        </div>
        <div v-if="warningNum" class="total"
          >共选中{{ tableData.total }}条数据</div
        >
        <div class="table">
          <a-table
            :data="tableData.list"
            row-key="id"
            :columns="tableColumns"
            :bordered="false"
            :pagination="{
              total: tableData.total,
              showTotal: true,
              showPageSize: true,
              pageSizeOptions: [10, 20, 50, 100],
            }"
          >
          </a-table>
        </div>
      </div>
      <div class="third" v-if="currentStep === 3">
        <a-progress
          size="large"
          :percent="Number((progressBarStatus / 100).toFixed(2))"
        />
        <div class="loading-text">正在导入数据，请勿关闭或刷新页面</div>
      </div>
      <div class="fourth" v-if="currentStep === 4">
        <icon-check-circle-fill style="font-size: 100px; color: #43cf7c" />
        <span>数据导入完成</span>
        <div class="success-text">您已成功导入{{ tableData.total }}条数据</div>
      </div>
      <div class="btn">
        <a-space>
          <a-button v-if="currentStep === 1" @click="modalVisible = false"
            >取消</a-button
          >
          <a-button v-if="warningNum && currentStep === 2" @click="reUpload"
            >重新上传</a-button
          >
          <a-button
            v-if="!warningNum && currentStep > 1 && currentStep < 3"
            @click="currentStep--"
            >上一步</a-button
          >
          <a-button v-if="currentStep < 3" type="primary" @click="nextStep"
            >下一步</a-button
          >
          <a-button v-if="currentStep === 4" @click="cancel">完成</a-button>
        </a-space>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
  import { exportData } from '@/utils/utils';
  import { defaultFormConfig } from '@/views/risk/gradedControl/composition/defaultFormConfig';
  import { Message, TableColumnData } from '@arco-design/web-vue';

  const props = defineProps({
    title: {
      type: String,
      default: '数据导入',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    templateUrl: {
      type: String,
    },
    tableColumns: {
      type: Array as PropType<TableColumnData[]>,
      required: true,
    },
    previewApi: {
      type: Function as PropType<(file: any) => Promise<any>>,
      required: true,
    },
    importApi: {
      type: Function as PropType<(file: any) => Promise<any>>,
      required: true,
    },
    templateApi: {
      type: Function as PropType<() => Promise<any>>,
    },
    importCallback: {
      type: Function as PropType<(data: any) => any>,
      required: true,
    },
  });

  const currentStep = ref(1);

  const emit = defineEmits(['update:visible', 'success']);
  const modalVisible = computed({
    get() {
      return props.visible;
    },
    set(val) {
      emit('update:visible', val);
    },
  });

  const tableColumns = ref<TableColumnData[]>(props.tableColumns);

  const tableData = ref({ total: 0, list: [] });
  const fileList = ref<any[]>([]);
  const warningNum = ref(0);

  const nextStep = async () => {
    if (currentStep.value === 1) {
      if (fileList.value.length === 0) {
        Message.warning('请上传文件');
        return;
      }
      const params = new FormData();
      params.append('file', fileList.value[0]);
      const {
        data: { errorNumber, successNumber, result },
      } = await props.previewApi(params);
      tableData.value.total = errorNumber + successNumber;
      tableData.value.list = result.map((item: any) => {
        return {
          ...item,
          ...item.data,
        };
      });
      if (errorNumber > 0) {
        warningNum.value = errorNumber;
        tableColumns.value = [
          ...props.tableColumns,
          {
            title: '异常说明及处理',
            dataIndex: 'error',
            width: 200,
            cellStyle: { color: '#d43030' },
          },
        ];
      }
    } else if (currentStep.value === 2) {
      if (warningNum.value) {
        warningNum.value = 0;
        tableColumns.value = props.tableColumns;
        tableData.value.list = tableData.value.list.filter((item: any) => {
          return item.flag;
        });
        tableData.value.total = tableData.value.list.length;
        return;
      }
      currentStep.value++;
      progressBarStatus.value = 0;
      await startRequest();
    }
    currentStep.value++;
  };

  const progressBarStatus = ref(0);
  const isRequestSucces = ref(false);

  let timer: any;
  const startRequest = async () => {
    return new Promise((resolve, reject) => {
      // 记录请求开始时间
      // const requestStartTime = Date.now();

      // 请求完成后立即启动定时器
      timer = setInterval(() => {
        if (progressBarStatus.value < 99) {
          progressBarStatus.value += 1;
        } else {
          // 清除定时器
          clearInterval(timer);
          if (isRequestSucces.value) {
            progressBarStatus.value = 100;
          }
        }
      }, 10);

      const params = props.importCallback(tableData.value.list);
      setTimeout(() => {
        props
          .importApi(params)
          .then((res) => {
            isRequestSucces.value = true;
            resolve(void 0);
          })
          .catch(() => {
            isRequestSucces.value = false;
            currentStep.value = 2;
            reject();
          });
      }, 1000);
    });
  };

  const downloadTemplate = async () => {
    if (props.templateUrl) {
      const baseUrl =
        import.meta.env.MODE !== 'development'
          ? `${import.meta.env.VITE_API_BASE_URL}/template/`
          : 'https://business.api.xkrsecure.com/template/';
      // 创建a标签
      let a = document.createElement('a');
      // 定义下载名称
      a.download = props.templateUrl;
      // 隐藏标签
      a.style.display = 'none';
      // 设置文件路径
      a.href = baseUrl + props.templateUrl;
      // 将创建的标签插入dom
      document.body.appendChild(a);
      // 点击标签，执行下载
      a.click();
      // 将标签从dom移除
      document.body.removeChild(a);
    } else if (props.templateApi) {
      const response = await props.templateApi();
      exportData(response);
    }
  };

  const beforeUpload = (file: any) => {
    // 文件大小限制
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      Message.warning('文件大小不能超过10M');
      return false;
    }
    // 限制文件后缀名为.xls或.xlsx
    const fileExt = file.name.split('.').pop();
    if (!(fileExt === 'xls' || fileExt === 'xlsx')) {
      Message.warning('文件后缀名必须是.xls或.xlsx');
      return false;
    }
    // 限制文件必须是excel文件
    const isExcel =
      file.type === 'application/vnd.ms-excel' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isExcel) {
      Message.warning('请上传Excel文件');
      return false;
    }
    if (fileList.value.length > 0) {
      fileList.value[0] = file;
    } else {
      fileList.value.push(file);
    }
    return true;
  };
  const deleteFileList = () => {
    fileList.value = [];
  };

  const cancel = () => {
    modalVisible.value = false;
    fileList.value = [];
    if (currentStep.value === 4) {
      emit('success');
    }
    currentStep.value = 1;
  };

  const reUpload = () => {
    fileList.value = [];
    tableData.value.list = [];
    tableData.value.total = 0;
    warningNum.value = 0;
    currentStep.value--;
  };
</script>
<style lang="less">
  .import-data-modal-container {
    .arco-upload {
      width: 100%;
    }
    .arco-upload-list {
      display: none;
    }
    .arco-steps-item-title {
      line-height: 1;
    }
  }
</style>
<style lang="less" scoped>
  .import-data-modal-container {
    // min-height: calc(100vh - 265px);
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 0 32px;

    .first {
      display: flex;
      flex-direction: column;
      gap: 20px;
      .download-content,
      .upload-content {
        display: flex;
        border: 1px solid #e8e8e8;

        .left {
          padding: 20px;
          background-color: var(--color-bg-3);
          display: flex;
          align-items: center;
          justify-content: center;
          i {
            font-size: 40px;
            color: var(--color-blue);
          }
        }

        .right {
          padding: 20px;
          line-height: 2;
          .title {
            font-size: 14px;
            color: var(--color-text-black);
            font-family: 'Alibaba-Medium';
          }

          .description {
            font-size: 12px;
            color: var(--color-text-grey1);
          }
          .file-list {
            display: flex;
            align-items: center;
            gap: 5px;
            svg {
              cursor: pointer;
            }
          }

          a-link {
            color: var(--color-blue);
          }
        }
      }
    }

    .second {
      .warning-text {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 16px;
        background-color: #ffece8;
        border-radius: 8px;
        color: #333333;
      }

      .total {
        font-family: 'Alibaba-Medium';
        font-size: 16px;
      }
      .table {
        max-height: 50%;
      }
    }

    .third {
      display: flex;
      flex-direction: column;
      gap: 24px;

      .total {
        font-family: 'Alibaba-Medium';
        font-size: 16px;
      }
    }

    .fourth {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .loading-text {
        font-size: 14px;
        color: var(--color-text-grey1);
      }

      .success-text {
        font-family: 'Alibaba-Medium';
        font-size: 20px;
        color: var(--color-text-grey);
      }
    }

    .step-desc {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;

      div:nth-of-type(1) {
        color: var(--color-text-grey);
      }

      div:nth-of-type(2) {
        color: var(--color-text-grey1);
      }
    }

    .btn {
      margin-top: 12px;
      width: 100%;
      text-align: center;
    }

    .error-desc {
      display: flex;
      flex-direction: column;
      gap: 5px;

      span {
        margin-left: -20px;
        color: #d43030;
      }
    }
  }
</style>

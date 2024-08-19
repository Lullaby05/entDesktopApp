<template>
  <div
    v-if="loginFlag"
    class="login-form-wrapper"
    style="-webkit-app-region: no-drag"
    v-loading="loading"
  >
    <div class="login-form-title">
      <div
        :class="{ item: title === '1' }"
        @click="
          () => {
            title = '1';
          }
        "
      >
        {{ $t('login.form.login.method.password') }}
      </div>
      <div
        :class="{ item: title === '2' }"
        @click="
          () => {
            title = '2';
          }
        "
        >{{ $t('login.form.login.method.message') }}
      </div>
    </div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      :rules="rules"
      @submit="handleSubmit"
    >
      <a-form-item
        v-if="title === '1'"
        field="username"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.username"
          :placeholder="$t('login.form.userName.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        v-if="title === '1'"
        field="password"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="userInfo.password"
          :placeholder="$t('login.form.password.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item v-if="title === '2'" field="phone" hide-label>
        <a-input
          v-model="userInfo.phone"
          placeholder="请输入手机号码"
          allow-clear
        >
          <template #prefix>
            <icon-mobile />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item v-if="title === '2'" field="verifyCode" hide-label>
        <a-input
          v-model="userInfo.verifyCode"
          placeholder="请输入短信验证码"
          allow-clear
        >
          <template #prefix>
            <icon-exclamation-circle />
          </template>
          <template #suffix>
            <a-link v-if="countDown === 0" @click="getVerifyCodeFn">{{
              verifyCodeText
            }}</a-link>
            <a-link v-else>{{ countDown + 's' }}</a-link>
          </template>
        </a-input>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions" v-if="title === '1'">
          <a-checkbox
            checked="rememberPassword"
            :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword as any"
          >
            {{ $t('login.form.rememberPassword') }}
          </a-checkbox>
          <a-tooltip content="请联系公司相关负责人进行密码重置">
            <a-link>{{ $t('login.form.forgetPassword') }}</a-link>
          </a-tooltip>
        </div>
        <div class="login-form-password-actions-empty" v-if="title === '2'">
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          {{ $t('login.form.login') }}
        </a-button>
        <!-- <a-button type="text" long class="login-form-register-btn">
          {{ $t('login.form.register') }}
        </a-button> -->
      </a-space>
    </a-form>
    <a-modal
      v-model:visible="enterpriseChooseVisible"
      title-align="start"
      :mask="false"
      :fullscreen="true"
      title="选择进入身份"
      :footer="false"
      class="login-enterprise-choose"
    >
      <choose-enterprise
        v-loading="enterpriseLoading"
        :enterpriseList="enterpriseList"
        v-model:selectEnterprise="selectEnterprise"
        @cancel="cancelChooseEnterprise"
        @confirm="confirmChooseEnterprise"
      />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, defineEmits } from 'vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import { getTokenByTenant, getVerifyCode, type LoginData } from '@/api/user';
  import ChooseEnterprise from './chooseEnterprise.vue';

  const { loading, setLoading } = useLoading();
  const { t } = useI18n();

  const userStore = useUserStore();
  const emit = defineEmits(['loginClick']);

  const loginFlag = ref(true);
  const errorMessage = ref('');
  const title = ref('1');
  const loginForm = ref<any>(null);

  const loginConfig = useStorage('login-config', {
    rememberPassword: true,
    username: '',
    password: '',
    phone: '',
    verifyCode: '',
  });
  const userInfo = reactive({
    username: loginConfig.value.username,
    password: loginConfig.value.password,
    phone: loginConfig.value.phone,
    verifyCode: loginConfig.value.verifyCode,
  });

  const rules = {
    username: [{ required: true, message: t('login.form.userName.errMsg') }],
    password: [{ required: true, message: t('login.form.password.errMsg') }],
    phone: [
      {
        validator: (value: any, callback: Function) => {
          const regexp = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
          if (!value) {
            callback('请输入手机号码');
          } else if (!regexp.test(value)) {
            callback('请输入正确的手机号码');
          } else {
            callback();
          }
        },
      },
    ],
    verifyCode: [{ required: true, message: '请输入短信验证码' }],
  };

  const countDown = ref(0);
  let timer: any | null = null;

  const verifyCodeText = ref('获取验证码');
  const getVerifyCodeFn = async () => {
    const res = await loginForm.value.validateField(['phone']);
    if (res) return;
    await getVerifyCode(userInfo.phone);
    countDown.value = 60;
    verifyCodeText.value = '再次获取';
    timer = setInterval(countDownFn, 1000);
  };

  const countDownFn = () => {
    countDown.value--;
    if (countDown.value <= 0) {
      clearInterval(timer);
      countDown.value = 0;
    }
  };

  const enterpriseList = ref([]);
  const selectEnterprise = ref({});
  const enterpriseChooseVisible = ref(false);
  const { loading: enterpriseLoading, setLoading: setEnterpriseLoading } =
    useLoading();
  const cancelChooseEnterprise = () => {
    enterpriseChooseVisible.value = false;
    selectEnterprise.value = {};
  };
  const confirmChooseEnterprise = async () => {
    try {
      setEnterpriseLoading(true);
      const { data } = await getTokenByTenant(selectEnterprise.value);
      await userStore.getUserBasicInfo(data);
      handleLogin(userInfo);
    } finally {
      setEnterpriseLoading(false);
    }
  };
  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) {
      return;
    }
    setLoading(true);
    if (!errors) {
      try {
        const res = await userStore.login(values as LoginData, title.value);
        if (res.enterpriseList) {
          enterpriseList.value = res.enterpriseList;
          userStore.setEnterpriseList(res.enterpriseList);
          enterpriseChooseVisible.value = true;
          return;
        }
        if (!res) return;
        handleLogin(values);
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
  };
  const router = useRouter();
  const handleLogin = async (values: any) => {
    emit('loginClick', '登录开始');
    const info = {
      info: JSON.parse(JSON.stringify(userStore.userInfo)),
    };
    if (navigator.userAgent.includes('Electron')) {
      window.versions.login(info);
    } else {
      router.push({
        name: 'Workplace',
      });
    }
    appStyle();
    // Message.success(t('login.form.login.success'));
    const { rememberPassword } = loginConfig.value;
    const { username, password } = values;
    // 实际生产环境需要进行加密存储。
    // The actual production environment requires encrypted storage.
    loginConfig.value.username = rememberPassword ? username : '';
    loginConfig.value.password = rememberPassword ? password : '';
  };
  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value;
  };

  function appStyle() {
    const remFlag = document.getElementById('app') as HTMLInputElement;
    remFlag.style.setProperty('border-radius', '0px');
  }
</script>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      display: flex;
      justify-content: space-around; /* space-between */
      color: var(--color-text-1);
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0px;
      line-height: 27.44px;
      text-align: left;
      vertical-align: top;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
    .login-form-register-btn {
      color: var(--color-text-black) !important;
      background-color: var(--bg4);
    }
  }

  .login-form-title {
    & > div {
      cursor: pointer;
    }
  }
  .login-form-password-actions-empty {
    padding: 12px 0;
  }

  .item {
    color: rgba(53, 124, 240, 1);
  }
</style>
<style lang="less">
  .login-enterprise-choose {
    .arco-modal-body {
      height: 100%;
    }
  }
</style>

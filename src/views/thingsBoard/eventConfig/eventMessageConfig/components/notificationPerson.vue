<template>
  <div class="notification-person-container">
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      v-if="props.type === 'edit'"
    >
      <div>
        <a-form-item field="notifyMethod" hide-label>
          <a-checkbox-group v-model="formData.notifyMethod">
            <a-checkbox
              v-for="item in notificationMethodList"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}
              <a-tooltip>
                <icon-info-circle size="16" />
                <template #content>
                  <div v-if="item.remark === 'VOICE_PHONE'">
                    <icon-play-circle
                      size="28"
                      style="cursor: pointer"
                      @click="playVoice"
                    />
                  </div>
                  <div v-if="item.remark === 'MINI_PROGRAM'">
                    <img
                      src="@/assets/images/miniProgramPreview.jpg"
                      style="height: 200px; object-fit: contain"
                    />
                  </div>
                  <div v-if="item.remark === 'WALKIE_TALKIE'">
                    <img
                      src="@/assets/images/talkerPreview.jpg"
                      style="height: 200px; object-fit: contain"
                    />
                  </div>
                </template>
              </a-tooltip>
            </a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </div>
      <div> 告警将通知到 </div>
      <div class="error-person arco-form-item-message" v-if="personNotSelect">
        请选择通知人员
      </div>
      <div class="custom">
        <a-button type="text" @click="openGroupDrawer">选择班组</a-button>
        <a-tag
          v-for="item in formData.group"
          :key="item.id"
          closable
          @close="deleteGroup(item)"
          >{{ item.groupPlanName }}</a-tag
        >
      </div>
      <div class="custom">
        <a-button type="text" @click="openPostDrawer">选择岗位</a-button>
        <a-tag
          v-for="item in formData.post"
          :key="item.id"
          closable
          @close="deletePost(item)"
          >{{ item.jobName + '-' + item.deptName }}</a-tag
        >
      </div>
      <div class="custom">
        <a-button type="text" @click="openPersonDrawer">选择员工</a-button>
        <a-tag
          v-for="item in formData.person"
          :key="item.userId"
          closable
          @close="deletePerson(item)"
          >{{ item.userName + '-' + item.deptName }}</a-tag
        >
      </div>
      <div class="custom" v-if="hasChoosePhoneAndSms">
        <a-button type="text" @click="addCustomPerson">添加人员</a-button>
        <a-tag
          v-for="item in formData.customPerson"
          :key="item.phone"
          closable
          @close="deleteCustomPerson(item)"
          >{{ item.name + '-' + item.phone }}</a-tag
        >
        <div
          style="
            margin-top: 10px;
            margin-left: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
          "
        >
          <a-input
            v-model="customPerson.name"
            placeholder="请输入人员姓名"
            allow-clear
          ></a-input>
          <a-input
            v-model="customPerson.phone"
            placeholder="请输入人员联系方式"
            allow-clear
          ></a-input>
        </div>
      </div>
    </a-form>
    <div v-if="props.type === 'detail'" class="detail-container">
      <div class="notification-method">
        <div
          v-for="item in notificationMethodList.filter((ele) =>
            (formData.notifyMethod || []).includes(ele.value)
          )"
          :key="item.value"
          >{{ item.label }}
          <a-tooltip>
            <icon-info-circle size="16" />
            <template #content>
              <div v-if="item.remark === 'VOICE_PHONE'">
                <icon-play-circle
                  size="28"
                  style="cursor: pointer"
                  @click="playVoice"
                />
              </div>
              <div v-if="item.remark === 'MINI_PROGRAM'">
                <img
                  src="@/assets/images/miniProgramPreview.jpg"
                  style="height: 200px; object-fit: contain"
                />
              </div>
              <div v-if="item.remark === 'WALKIE_TALKIE'">
                <img
                  src="@/assets/images/talkerPreview.jpg"
                  style="height: 200px; object-fit: contain"
                />
              </div>
            </template>
          </a-tooltip>
        </div>
      </div>
      <div>告警将通知到</div>
      <div class="custom">
        <a-button disabled type="text">班组</a-button>
        <a-tag v-for="(item, index) in formData.group" :key="item.id">{{
          item.groupPlanName
        }}</a-tag>
      </div>
      <div class="custom">
        <a-button disabled type="text">岗位</a-button>
        <a-tag v-for="(item, index) in formData.post" :key="item.id">{{
          item.jobName + '-' + item.deptName
        }}</a-tag>
      </div>
      <div class="custom">
        <a-button disabled type="text">员工</a-button>
        <a-tag v-for="(item, index) in formData.person" :key="item.id">{{
          item.userName + '-' + item.deptName
        }}</a-tag>
      </div>
      <div class="custom" v-if="hasChoosePhoneAndSms">
        <a-button disabled type="text">人员</a-button>
        <a-tag
          v-for="(item, index) in formData.customPerson"
          :key="item.name"
          >{{ item.name + '-' + item.phone }}</a-tag
        >
      </div>
    </div>
    <groupDrawer ref="groupDrawerRef" v-model:table-data="formData.group" />
    <staffDrawer
      ref="personDrawerRef"
      v-model:table-data="formData.person"
      :dept-data="props.deptData"
    />
    <postDrawer
      ref="postDrawerRef"
      v-model:table-data="formData.post"
      :dept-data="props.deptData"
    />
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref, toRef } from 'vue';
  import staffDrawer from './staffDrawer.vue';
  import postDrawer from './postDrawer.vue';
  import groupDrawer from './groupDrawer.vue';
  import { useSearch } from '@/views/pitfall/snapshot/composition/useSearch';
  import { getNoticeTypeDict } from '@/api/messageCenter';
  import { PropType } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import voice from '@/assets/audio/voicePreview.mp3';

  const props = defineProps({
    formData: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: 'edit',
    },
    deptData: {
      type: Array,
      default: () => [],
    },
    notificationMethodList: {
      type: Array as PropType<
        { label: string; value: string; remark: string }[]
      >,
      default: () => [],
    },
  });

  const emits = defineEmits(['update:formData']);
  const formData = computed({
    get() {
      return props.formData;
    },
    set(value) {
      emits('update:formData', value);
    },
  });
  const rules = {
    notifyMethod: [
      { required: true, message: '请选择通知方式', trigger: 'change' },
    ],
  };
  const notificationMethodList = toRef(props, 'notificationMethodList');
  const hasChoosePhoneAndSms = computed(() => {
    const phone = notificationMethodList.value.find(
      (item) => item.remark === 'VOICE_PHONE'
    );
    const sms = notificationMethodList.value.find(
      (item) => item.remark === 'SMS'
    );
    const result =
      formData.value.notifyMethod &&
      (formData.value.notifyMethod.includes(phone?.value) ||
        formData.value.notifyMethod.includes(sms?.value));
    if (!result) {
      formData.value.customPerson = [];
    }
    return result;
  });
  const formRef = ref<any>(null);
  const personNotSelect = ref(false);
  const validate = () => {
    return new Promise(async (resolve, reject) => {
      // 判断四个数组中是否有一个有值
      personNotSelect.value =
        (!formData.value?.group?.length ?? 0) &&
        (!formData.value?.post?.length ?? 0) &&
        (!formData.value?.person?.length ?? 0) &&
        (!formData.value?.customPerson?.length ?? 0);
      let result = await formRef.value.validate();
      if (personNotSelect.value) reject();
      resolve(result);
    });
  };
  const deleteGroup = (item: any) => {
    formData.value.group = formData.value.group.filter(
      (ele: any) => ele.id !== item.id
    );
  };
  const deletePost = (item: any) => {
    formData.value.post = formData.value.post.filter(
      (ele: any) => ele.id !== item.id
    );
  };
  const deletePerson = (item: any) => {
    formData.value.person = formData.value.person.filter(
      (ele: any) => ele.userId !== item.userId
    );
  };
  const deleteCustomPerson = (item: any) => {
    formData.value.customPerson = formData.value.customPerson.filter(
      (ele: any) => ele.phone !== item.phone
    );
  };

  const personDrawerRef = ref<InstanceType<typeof staffDrawer> | null>(null);
  const openPersonDrawer = () => {
    personDrawerRef.value!.open();
  };
  const postDrawerRef = ref<InstanceType<typeof postDrawer> | null>(null);
  const openPostDrawer = () => {
    postDrawerRef.value!.open();
  };
  const groupDrawerRef = ref<InstanceType<typeof groupDrawer> | null>(null);
  const openGroupDrawer = () => {
    groupDrawerRef.value!.open();
  };
  const customPerson = ref({
    name: '',
    phone: '',
  });
  const addCustomPerson = () => {
    const { name, phone } = customPerson.value;
    // 判断是否存在重复的手机号
    const isExist = formData.value.customPerson.some(
      (item: any) => item.phone === phone
    );
    if (isExist) return Message.warning('手机号已存在');
    if (!name || !phone) return;
    formData.value.customPerson.push({
      name,
      phone,
    });
    customPerson.value = { name: '', phone: '' };
  };

  const voiceOpen = ref(false);
  const playVoice = () => {
    // 播放一段音频
    if (voiceOpen.value) return;
    voiceOpen.value = true;
    const audio = new Audio();
    audio.src = voice;
    audio.play();
    // 防止重复点击播放多次声音
    audio.onended = () => {
      voiceOpen.value = false;
    };
  };

  defineExpose({
    validate,
  });
</script>
<style lang="less" scoped>
  .custom {
    white-space: pre-wrap;
    :deep(.arco-tag + .arco-tag) {
      margin-left: 10px;
    }
  }
  .detail-container {
    .notification-method {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--color-text-grey1);
    }
  }
</style>
<style lang="less">
  .arco-tooltip-content {
    max-width: 100%;
  }
</style>

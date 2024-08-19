import { getUserSign, updateEmployeeSignature } from '@/api/pitfall';
import { useUserStore } from '@/store';
import { ref } from 'vue';

export const useSign = (signRef: any) => {
  const signModalVisible = ref(false);
  let ctx: any = null;
  let drawing = false;
  let status = false; // 是否有值
  // 初始化画布，如果存有值则直接使用默认值
  const defaultSign = ref('');
  const userStore = useUserStore();
  const userInfo = computed(() => userStore.userInfo);

  //   打开窗口
  const openSignModal = async () => {
    signModalVisible.value = true;
    status = false;
    ctx = signRef.value.getContext('2d');
    if (defaultSign.value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = defaultSign.value;
    } else {
      getUserSign().then((res: any) => {
        defaultSign.value = res.data.signature;
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = defaultSign.value;
      });
    }
    const maxWidth = signRef.value.width;
    const maxHeight = signRef.value.height;
    signRef.value.addEventListener('mousedown', (e: any) => {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    });
    signRef.value.addEventListener('mousemove', (e: any) => {
      if (drawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        if (
          e.offsetX >= maxWidth - 10 ||
          e.offsetY >= maxHeight - 10 ||
          e.offsetX <= 10 ||
          e.offsetY <= 10
        ) {
          drawing = false;
          status = true;
        }
      }
    });
    signRef.value.addEventListener('mouseup', (e: any) => {
      drawing = false;
      status = true;
    });
  };

  //   清除画布
  const clearSign = (callback?: () => void) => {
    ctx.clearRect(0, 0, signRef.value.width, signRef.value.height);
    status = false;
    callback && callback();
  };

  const closeSignModal = () => {
    signModalVisible.value = false;
    ctx.clearRect(0, 0, signRef.value.width, signRef.value.height);
  };

  //   获取数据（base64）
  const confirmSign = () => {
    const result = signRef.value.toDataURL('image/png');
    const resultStatus = status || result === defaultSign.value;
    if (result && result !== defaultSign.value) {
      // 保存最新的签名
      updateEmployeeSignature({
        userId: userInfo.value.enterPriseUserId,
        signature: result,
      });
    }
    closeSignModal();
    return resultStatus ? result : '';
  };

  return {
    signRef,
    signModalVisible,
    openSignModal,
    closeSignModal,
    confirmSign,
    clearSign,
  };
};

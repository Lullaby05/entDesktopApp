export default {
  preventReClick: {
    mounted(el: HTMLElement, binding: { value: number }) {
      const disableClick = () => {
        if (!el.disabled) {
          el.disabled = true;
          el.style.opacity = '0.5';
          setTimeout(() => {
            el.disabled = false;
            el.style.opacity = '1';
          }, binding.value || 2000);
        }
      };
      el.addEventListener('click', disableClick);
      el._disableClick = disableClick; // 存储引用，以便后续移除
    },
    updated(el: HTMLElement, binding: { value: number }) {
      // 移除旧的监听器
      if (el._disableClick) {
        el.removeEventListener('click', el._disableClick);
      }
      // 添加新的监听器
      const disableClick = () => {
        if (!el.disabled) {
          el.disabled = true;
          el.style.opacity = '0.5';
          setTimeout(() => {
            el.disabled = false;
            el.style.opacity = '1';
          }, binding.value || 2000);
        }
      };
      el.addEventListener('click', disableClick);
      el._disableClick = disableClick;
    },
    unmounted(el: HTMLElement) {
      // 组件卸载时移除监听器
      if (el._disableClick) {
        el.removeEventListener('click', el._disableClick);
      }
    },
  },
};

import { DirectiveBinding } from 'vue';
import { useAppStore, useUserStore } from '@/store';

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  const appStore = useAppStore()
  const btnPermissionList = appStore.appPermissionList

  if (btnPermissionList && btnPermissionList.length && value) {
    const hasPermission = btnPermissionList.includes(value)
    if (!hasPermission && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
};

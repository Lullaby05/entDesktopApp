import { judgeBindingUser, judgeUserHasPermission } from '@/api/user';
import { useAppStore } from '@/store';
import useRouterJump from './routerJump';
import { Modal } from '@arco-design/web-vue';
import { h } from 'vue';

export default function useJudgeBindingUser() {
  const { jumpWithTab } = useRouterJump();

  const judgeBinding = async (options: {
    record: { id: string; userName: string; deptId: string; deptName: string };
  }) => {
    return new Promise(
      async (resolve: (value: { hasBindingUser: boolean } | false) => void) => {
        const { record } = options;
        if (!record.id) return;
        const { data } = await judgeBindingUser(record.id);
        if (!data) {
          const appStore = useAppStore();
          const btnPermissionList = appStore.appPermissionList;
          const permission = btnPermissionList.includes('UserListAdd');

          const modal = Modal.open({
            title: '提示',
            content: h('div', null, [
              `该员工没有登录账号，无法进行操作，请重新选择人员或`,
              permission
                ? h('span', null, [
                    `为该员工`,
                    h(
                      'a',
                      {
                        style: {
                          color: '#357cf0',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        },
                        onClick: () => {
                          jumpWithTab({
                            routerName: 'UserListAdd',
                            redirectName: 'UserList',
                            params: record,
                          });
                          modal.close();
                          resolve(false);
                          // onCancel && onCancel();
                        },
                      },
                      `创建登录账号`
                    ),
                  ])
                : `选中后联系管理员为该员工创建登录账号`,
            ]) as any,
            titleAlign: 'start',
            okText: '确定选中',
            cancelText: '重新选择',
            onOk: () => {
              resolve({
                hasBindingUser: false,
              });
            },
            onCancel: () => {
              resolve(false);
            },
          });
        } else {
          resolve({
            hasBindingUser: true,
          });
        }
      }
    );
  };

  const judgeHasPermission = (options: {
    id: string;
    moduleNamesPC: string;
    moduleNamesWX: string;
  }) => {
    return new Promise(async (resolve) => {
      const { id, moduleNamesPC, moduleNamesWX } = options;
      if (!id) return;
      const { data } = await judgeUserHasPermission({
        employeeId: id,
        menuTagsPC: moduleNamesPC.split(','),
        menuTagsWX: moduleNamesWX.split(','),
      });
      if (!data.validate) {
        Modal.open({
          title: '提示',
          content: data.message,
          titleAlign: 'start',
          okText: '确定选中',
          cancelText: '重新选择',
          onOk: () => {
            resolve(true);
          },
          onCancel: () => {
            resolve(false);
          },
        });
      } else {
        resolve(true);
      }
    });
  };

  return {
    judgeBinding,
    judgeHasPermission,
  };
}

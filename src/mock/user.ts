import Mock from 'mockjs';
import setupMock, {
  successResponseWrap,
  failResponseWrap,
} from '@/utils/setup-mock';

import { MockParams } from '@/types/mock';
import { isLogin } from '@/utils/auth';

setupMock({
  mock: true,
  setup() {
    // Mock.XHR.prototype.withCredentials = true;

    // 用户信息
    Mock.mock(new RegExp('/api/user/info'), () => {
      if (isLogin()) {
        const role = window.localStorage.getItem('userRole') || 'admin';
        return successResponseWrap({
          name: '王立群',
          avatar:
            '//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png',
          email: 'wangliqun@email.com',
          job: 'frontend',
          jobName: '前端艺术家',
          organization: 'Frontend',
          organizationName: '前端',
          location: 'beijing',
          locationName: '北京',
          introduction: '人潇洒，性温存',
          personalWebsite: 'https://www.arco.design',
          phone: '150****0000',
          registrationDate: '2013-05-10 12:10:00',
          accountId: '15012312300',
          certification: 1,
          role,
        });
      }
      return failResponseWrap(null, '未登录', 50008);
    });

    // 登录
    Mock.mock(new RegExp('/api/user/login'), (params: MockParams) => {
      console.log('登录mock');

      const { username, password } = JSON.parse(params.body);
      if (!username) {
        return failResponseWrap(null, '用户名不能为空', 50000);
      }
      if (!password) {
        return failResponseWrap(null, '密码不能为空', 50000);
      }
      if (username === 'admin' && password === 'admin') {
        window.localStorage.setItem('userRole', 'admin');
        return successResponseWrap({
          token: '12345',
        });
      }
      if (username === 'user' && password === 'user') {
        window.localStorage.setItem('userRole', 'user');
        return successResponseWrap({
          token: '54321',
        });
      }
      return failResponseWrap(null, '账号或者密码错误', 50000);
    });

    // 登出
    Mock.mock(new RegExp('/api/user/logout'), () => {
      return successResponseWrap(null);
    });

    // 用户的服务端菜单
    Mock.mock(new RegExp('/api/user/menu'), () => {
      const menuList = [
        {
          path: '/dashboard',
          name: 'dashboard',
          meta: {
            locale: 'menu.server.dashboard',
            requiresAuth: true,
            icon: 'icon-dashboard',
            order: 1,
          },
          children: [
            {
              path: 'workplace',
              name: 'Workplace',
              meta: {
                locale: 'menu.server.workplace',
                requiresAuth: true,
              },
            },
            {
              path: 'https://arco.design',
              name: 'arcoWebsite',
              meta: {
                locale: 'menu.arcoWebsite',
                requiresAuth: true,
              },
            },
          ],
        },
      ];
      return successResponseWrap(menuList);
    });
  },
});

type roleType = {
  id: string;
  roleName: string;
  roleDescription: string;
  userNum: string | number;
  permissionNum: string | number;
  roleStatusCode: string;
  roleStatus: string;
  createTime: string;
  updateTime: string;
}
const roleStatusList = [
  { key: '启用', value: '1' },
  { key: '禁用', value: '2' },
]
type userType = {
  id: string;
  userName: string;
  loginPhone: string;
  userAccount: string;
  deptName: string;
  role: string;
  accountTypeCode: string;
  accountType: string;
  relatedInfo: string;
  lastSendAccountTime: string;
  userStatus: string;
  userStatusCode: string;
  createTime: string;
}
const userStatusList = [
  { key: '启用', value: '1' },
  { key: '禁用', value: '2' },
]
const accountTypeList = [
  { key: '员工账号', value: '1' },
  { key: '其他', value: '2' },
]

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

function createTreeNode(options?: { depth?: number; }): TreeNode | null {
  const currentDepth = (options?.depth || 0) + 1; // 当前层级深度，默认从0开始计数
  const maxDepth = 3; // 设置最大允许的层级深度

  if (currentDepth > maxDepth) {
    return null; // 如果超过最大深度，则返回null表示终止递归
  }

  const childrenCount = Mock.Random.integer(0, 5); // 默认生成0到5个子节点
  const children = Array.from({ length: childrenCount }, () => createTreeNode({ depth: currentDepth }));

  return {
    id: Mock.Random.id(),
    permissionName: Mock.Random.cname(),
    permissionDescription: Mock.Random.cname(),
    children: children.filter(child => child !== null), // 过滤掉结束递归时返回的null值
  };
}
setupMock({
  mock: true,
  setup() {
    Mock.mock(
      new RegExp('/businessApi/business/user/roleList'),
      (params: MockParams) => {
        const tableData: roleType[] = [];
        for (let i = 0; i < 100; i++) {
          const randomStatusCode = Mock.Random.integer(1, 2).toString();
          tableData.push({
            id: Mock.Random.integer(
              100000000000000000,
              999999999999999999
            ).toString(),
            roleName: Mock.Random.cname(),
            roleDescription: Mock.Random.natural(1, 3).toString(),
            userNum: Mock.Random.integer(10, 50),
            permissionNum: Mock.Random.integer(10, 50),
            roleStatusCode: randomStatusCode,
            roleStatus: roleStatusList.find(ele => ele.value === randomStatusCode)!.key,
            createTime: Mock.Random.datetime(),
            updateTime: Mock.Random.datetime(),
          } as roleType);
        }
        const { pageNo = 1, pageSize = 10 } = JSON.parse(params.body);
        const start = (pageNo - 1) * pageSize;
        const end = start + pageSize;
        const result = tableData.slice(start, end);
        return {
          code: 0,
          data: {
            total: tableData.length,
            list: result,
          },
          msg: '请求成功',
        };
      }
    );
    Mock.mock(
      new RegExp('/businessApi/business/user/userList'),
      (params: MockParams) => {
        const tableData: userType[] = [];
        for (let i = 0; i < 100; i++) {
          const randomStatusCode = Mock.Random.integer(1, 2).toString();
          const randomAccountTypeCode = Mock.Random.integer(1, 2).toString();
          tableData.push({
            id: Mock.Random.integer(
              100000000000000000,
              999999999999999999
            ).toString(),
            userName: Mock.Random.cname(),
            loginPhone: '13800138000',
            userAccount: '123456',
            accountTypeCode: randomAccountTypeCode,
            accountType: accountTypeList.find(ele => ele.value === randomAccountTypeCode)!.key,
            deptName: Mock.Random.cname(),
            role: Mock.Random.cname(),
            relatedInfo: randomAccountTypeCode === '1' ? '石达(安保部)' : '未关联',
            userStatusCode: randomStatusCode,
            userStatus: userStatusList.find(ele => ele.value === randomStatusCode)!.key,
            createTime: Mock.Random.datetime(),
            lastSendAccountTime: Mock.Random.datetime(),
          } as userType);
        }
        const { pageNo = 1, pageSize = 10 } = JSON.parse(params.body);
        const start = (pageNo - 1) * pageSize;
        const end = start + pageSize;
        const result = tableData.slice(start, end);
        return {
          code: 0,
          data: {
            total: tableData.length,
            list: result,
          },
          msg: '请求成功',
        };
      }
    );
    Mock.mock(
      new RegExp('/businessApi/business/user/user/getPhone'),
      (params: MockParams) => {
        const tableData: { id: string, userName: string, tel: string }[] = [];
        for (let i = 0; i < 100; i++) {
          tableData.push({
            id: Mock.Random.integer(
              100000000000000000,
              999999999999999999
            ).toString(),
            userName: Mock.Random.cname(),
            tel: '13800138000',
          } as { id: string, userName: string, tel: string });
        }
        const { pageNo = 1, pageSize = 10 } = JSON.parse(params.body);
        const start = (pageNo - 1) * pageSize;
        const end = start + pageSize;
        const result = tableData.slice(start, end);
        return {
          code: 0,
          data: {
            total: tableData.length,
            list: result,
          },
          msg: '请求成功',
        };
      }
    );
    Mock.mock(
      new RegExp('/businessApi/business/user/user/getPermissionList'),
      (params: MockParams) => {
        const treeData: TreeNode[] = [createTreeNode()];
        return {
          code: 0,
          data: treeData,
          msg: '请求成功',
        };
      }
    );
  },
});
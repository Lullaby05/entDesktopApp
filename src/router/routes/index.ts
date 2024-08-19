import type { RouteRecordNormalized } from 'vue-router';

const modules = import.meta.glob('./modules/*.ts', { eager: true });
const externalModules = import.meta.glob('./externalModules/*.ts', {
  eager: true,
});

// 获取路由信息，进行遍历转换成数组
function formatModules(_modules: any, result: RouteRecordNormalized[]) {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    const moduleList = Array.isArray(defaultModule)
      ? [...defaultModule]
      : [defaultModule];
    result.push(...moduleList);
  });
  return result;
}

// 通过name查找模块
export function findModule(
  name: string,
  obj: any = {},
  routes: any = appRoutes
) {
  const queue = [];
  // 将根节点加入队列
  for (const node of routes) {
    queue.push(node);
  }

  while (queue.length > 0) {
    const currentNode: any = queue.shift();
    if (currentNode.name === name) {
      return currentNode;
    }
    if (currentNode.children) {
      for (const child of currentNode.children) {
        queue.push(child);
      }
    }
  }
  // 遍历完所有节点仍未找到目标节点
  return {};
}

export const appRoutes: RouteRecordNormalized[] = formatModules(modules, []);

export const appExternalRoutes: RouteRecordNormalized[] = formatModules(
  externalModules,
  []
);

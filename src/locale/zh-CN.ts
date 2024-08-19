import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeSettings from './zh-CN/settings';
import localeDashboard from './zh-CN/dashboard';
import localeEnterprise from './zh-CN/enterprise';
import localeCommon from './zh-CN/common';

export default {
  'menu.dashboard': '工作台',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.userManage': '用户管理',
  // 企业管理
  'menu.enterpriseManage': '企业管理',
  'menu.baseInfo': '企业基础信息',
  'menu.organization': '组织架构管理',
  'menu.securityDepartmentManage': '安全部门管理',
  'menu.workType': '工种管理',
  'menu.staffManage': '员工管理',
  'menu.postManage': '岗位管理',
  'menu.certificate': '证照管理',
  'menu.enterpriseCollect': '企业证照管理',
  'menu.enterpriseExamine': '企业证照复核',
  'menu.staffCollect': '员工证照管理',
  'menu.staffExamine': '员工证照复核',
  // 安全管理
  'menu.safetyManage': '安全管理',
  'menu.dangerous': '涉危管理',
  'menu.operation': '危险作业管理',
  'menu.operationSafety': '作业安全措施',
  'menu.operatonCertificateUpload': '作业证上传存档',
  'menu.operatonCertificateManage': '作业证管理',
  'menu.shortCircuit': '断路作业',
  'menu.excavation': '动土作业',
  'menu.hotWork': '动火作业',
  'menu.temporaryElectricity': '临时用电作业',
  'menu.hoistingSafety': '吊装作业',
  'menu.blindPlate': '盲板抽堵作业',
  'menu.aerialWork': '高处作业',
  'menu.confinedApaces': '受限空间作业',
  'menu.beInProgress': '正在进行的作业证查看',
  // 风险管控
  'menu.riskControl': '风险管控',
  'menu.safetySigns': '安全标志管理',
  'menu.accidentType': '事故类型管理',
  'menu.riskAssessment': '风险评估方法设置',
  'menu.identificationAndEvaluation': '风险辨识与评价',
  'menu.dangerPointManage': '危险源列表',
  'menu.gradedControl': '风险分级管控',
  // 隐患管理
  'menu.pitfall': '隐患管理',
  'menu.snapshot': '随手拍',
  'menu.snapshotDetail': '随手拍详情',
  'menu.pitfallDetail': '隐患详情',

  'menu.dailyCheckTasks': '排查任务',
  'menu.checkContentManage': '排查内容',
  'menu.checkListManage': '排查表',
  'menu.checkPlanManage': '排查计划',
  'menu.formDesignTest': '表单设计器',
  'menu.planToCheckTask': '计划排查任务',
  'menu.pitfallManage': '隐患处理',
  'menu.pitfallManagePermission': '隐患处理配置',
  'menu.pitfallControl': '隐患治理',
  'menu.pitfallOverview': '隐患总览',

  // 应急管理
  'menu.emergency': '应急管理',
  'menu.emergencyResource': '应急资源',
  'menu.exerciseExpert': '应急专家',
  'menu.exerciseMaterials': '应急物资',
  'menu.exerciseTroops': '应急队伍',
  'menu.emergencyPlan': '应急预案',
  'menu.emergencyExercisePlan': '演练计划',
  // 用户管理
  'menu.role': '角色管理',
  'menu.userList': '用户列表',
  'menu.batchLicensing': '批量授权',
  'menu.system': '系统管理',
  'menu.deptManager': '部门管理',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  // 监测预警管理
  'menu.equipment': '监测预警管理',
  'menu.home': '首页',
  'menu.alarms': '告警',
  'menu.thingsBoardDashboard': '仪表盘',
  'menu.entities': '实体',
  'menu.devices': '设备',
  'menu.assets': '资产',
  'menu.entityViews': '实体视图',
  'menu.instances': '边缘实例',
  'menu.notification': '通知中心',
  'menu.eventConfigManagement': '事件配置管理',
  'menu.eventManagement': '事件处置',
  'menu.eventOverview': '事件总览',
  'menu.eventConfig': '事件默认通知配置',
  'menu.monitoringDataScreen': '智能监测处置中心',
  // 下载中心
  'menu.downloadCenter': '批量下载',
  // 消息管理
  'menu.messageCenter': '消息通知中心',
  'menu.messageLog': '消息通知日志',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localeDashboard,
  ...localeEnterprise,
  ...localeCommon,
};

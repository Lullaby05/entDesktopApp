import Mock from 'mockjs';
import setupMock, {
  successResponseWrap,
  failResponseWrap,
} from '@/utils/setup-mock';

import { MockParams } from '@/types/mock';
import { isLogin } from '@/utils/auth';
import {
  editEventConfigOptions,
  eventConfigView,
  searchType,
} from '@/views/thingsBoard/eventConfig/eventConfigManagement/type';
import { eventManageView } from '@/views/thingsBoard/eventConfig/eventManagement/type';

setupMock({
  mock: true,
  setup() {
    Mock.mock(
      new RegExp(
        '/businessApi/business/thingsboard/eventConfigManagement/get-page'
      ),
      (params: MockParams) => {
        const tableData: eventConfigView[] = [];
        for (let i = 0; i < 100; i++) {
          tableData.push({
            id: Mock.Random.guid(),
            name: Mock.Random.cname(),
            typeCode: Mock.Random.guid(),
            type: Mock.Random.cname(),
            levelCode: Mock.Random.guid(),
            level: Mock.Random.cname(),
            methodsCode: ['1', '2', '3'],
            methods: Mock.Random.cname(),
            personConfirm: Mock.Random.cname(),
            description: Mock.Random.cname(),
            createBy: Mock.Random.cname(),
            createTime: Mock.Random.date(),
            updateBy: Mock.Random.cname(),
            updateTime: Mock.Random.date(),
          });
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
      new RegExp(
        '/businessApi/business/thingsboard/eventConfigManagement/get-detail'
      ),
      (params: MockParams) => {
        const detailData: editEventConfigOptions = {
          id: Mock.Random.guid(),
          name: Mock.Random.cname(),
          type: Mock.Random.cname(),
          level: Mock.Random.cname(),
          methods: [Mock.Random.cname(), Mock.Random.cname()],
          personConfirm: Mock.Random.cname(),
          description: Mock.Random.paragraph(2, 5),
          createBy: Mock.Random.cname(),
          createTime: Mock.Random.date(),
          updateBy: Mock.Random.cname(),
          updateTime: Mock.Random.date(),
        };
        return {
          code: 0,
          data: detailData,
          msg: '请求成功',
        };
      }
    );
    Mock.mock(
      new RegExp('/businessApi/business/thingsboard/eventManagement/get-page'),
      (params: MockParams) => {
        const tableData: eventManageView[] = [];
        for (let i = 0; i < 100; i++) {
          tableData.push({
            id: Mock.Random.guid(),
            name: Mock.Random.cname(),
            typeCode: Mock.Random.guid(),
            type: Mock.Random.cname(),
            levelCode: Mock.Random.guid(),
            level: Mock.Random.cname(),
            createTime: Mock.Random.date(),
            device: Mock.Random.cname(),
            deviceLocation: Mock.Random.cname(),
            status: Mock.Random.cname(),
            handleStatus: Mock.Random.cname(),
          });
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
      new RegExp(
        '/businessApi/business/thingsboard/eventManagement/get-tab-list'
      ),
      (params: MockParams) => {
        const tableData: {
          id: string;
          code: string;
          name: string;
          count: number;
        }[] = [];
        for (let i = 1; i <= 3; i++) {
          const names = ['应急事件', '隐患', '设备故障'];
          const count = [4, 0, 0];
          tableData.push({
            id: Mock.Random.guid(),
            code: i.toString(),
            name: names[i - 1],
            count: count[i - 1],
          });
        }
        return {
          code: 0,
          data: tableData,
          msg: '请求成功',
        };
      }
    );
  },
});

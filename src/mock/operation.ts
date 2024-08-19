import Mock from 'mockjs';
import { MockParams } from '@/types/mock';
import setupMock from '@/utils/setup-mock';

setupMock({
  mock: false,
  setup() {
    Mock.mock(
      new RegExp('/businessApi/business/cert_security_measure/get-page'),
      (params: MockParams) => {
        const tableData: {
          id: string;
          safetyMeasure: string;
          operationType: string;
        }[] = [];
        for (let i = 0; i < 100; i++) {
          tableData.push({
            id: Mock.Random.guid(),
            operationType: Mock.Random.cname(),
            safetyMeasure: Mock.Random.cparagraph(1, 2),
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
  },
});

setupMock({
  mock: true,
  setup() {
    Mock.mock(
      new RegExp('/businessApi/business/fireWorkCertificate/table/page'),
      (params: MockParams) => {
        const tableData: {
          certificateId: string;
          fireWorkLevelName: string;
          fireWorkLevelCode: string;
          wordCompany: string;
          applyCompany: string;
          workManager: string;
          certificateApplyTime: string;
          certificateStatusName: string;
          certificateStatusCode: string;
          closeReason?: string;
        }[] = [];
        for (let i = 0; i < 100; i++) {
          tableData.push({
            certificateId: Mock.Random.integer(
              100000000000000000,
              999999999999999999
            ).toString(),
            fireWorkLevelName: Mock.Random.cname(),
            fireWorkLevelCode: Mock.Random.natural(1, 3).toString(),
            wordCompany: Mock.Random.cname(),
            applyCompany: Mock.Random.cname(),
            workManager: Mock.Random.cname(),
            certificateApplyTime: Mock.Random.datetime(),
            certificateStatusName: Mock.Random.cname(),
            certificateStatusCode: Mock.Random.natural(1, 12).toString(),
            closeReason: Mock.Random.cparagraph(1, 2),
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
  },
});

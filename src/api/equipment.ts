import Axios from '@/api/interceptor';
// import axios from 'axios';
import type { TableData } from '@arco-design/web-vue/es/table/interface';

const axios = Axios
// 设备设施---获取设备列表（分页）
export function getPage(params: Record<string, any>) {
    return axios.post<TableData[]>('/businessApi/business/equipment/page', params);
}

// 设备设施---获取设备详情
export function getDetail(params: Record<string, any>) {
    return axios.get<TableData[]>('/businessApi/business/equipment/detail?id=' + params.id);
}

// 设备设施---创建设备
export function create(params: Record<string, any>) {
    return axios.post<any>('/businessApi/business/equipment/create', params);
}

// 设备设施---更新设备信息
export function update(params: Record<string, any>) {
    return axios.post<any>('/businessApi/business/equipment/update', params);
}

// 设备设施---导出设备表格
export function exportExcel(params: Record<string, any>) {
    return axios.post<any>('/businessApi/business/equipment/export-excel?exportType='+params.exportType, params, {
        responseType: 'blob'
    });
}

// 设备设施---删除设备信息（批量）
export function deleteFun(params: Record<string, any>) {
    return axios.post<any>('/businessApi/business/equipment/deletes?ids=' + params.ids);
}

// 设备设施---设备类型--类表（分页）
export function typeList() {
    return axios.get<any>('/businessApi/business/equipment-type/list');
}

// 设备设施---设备类型--创建
export function typeCreate(params: Record<string, any>) {
    return axios.post<any>('/businessApi/business/equipment-type/create', params);
}

// 设备设施---设备类型--更新
export function typeEdit(params: Record<string, any>) {
    return axios.post<any>('/businessApi/business/equipment-type/update', params);
}

// 设备设施---设备类型--删除
export function typeDelete(params: Record<string, any>) {
    return axios.delete<any>('/businessApi/business/equipment-type/delete/' + params.id);
}

// 设备设施---设备--获取文件链接
export function getFiles(params: Record<string, any>) {
    return axios.post<any>('/businessApi/business/upload/files' , params);
}

// 设备设施---设备---批量上传设备数据
export function uploadData(params: Record<string, any>) {
    return axios.post<any>('/businessApi/business/equipment/upload-data' , params);
}

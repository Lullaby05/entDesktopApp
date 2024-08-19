// 设备状态
const EQUIPMENT_STATUS: Array<string> = ['在用', '停用', '维修中', '报废']
const EQUIPMENT_STATUS_COLOR: Array<string> = ['arcoblue', 'red', 'orange', 'gray']
const UPLOAD_URL = '/dev/businessApi/business/upload/uploadFile'

export const global = {
    EQUIPMENT_STATUS,
    EQUIPMENT_STATUS_COLOR,
    UPLOAD_URL
}

export const globalSpare = {
    EQUIPMENT_STATUS
}
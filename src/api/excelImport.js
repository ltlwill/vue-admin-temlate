import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/excel/imp/list',
    method: 'get',
    params
  })
}

export function deleteImpByIds(params) {
  return request({
    url: '/excel/imp/delete',
    method: 'get',
    params
  })
}

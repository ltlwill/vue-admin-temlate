import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/excel/imp/list',
    method: 'get',
    params
  })
}

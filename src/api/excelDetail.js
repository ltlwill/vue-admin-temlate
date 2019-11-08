import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/excel/detail/list',
    method: 'get',
    params
  })
}

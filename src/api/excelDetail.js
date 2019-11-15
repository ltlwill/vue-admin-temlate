import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/excel/detail/list',
    method: 'get',
    params
  })
}

export function deleteDetailByIds(params) {
  return request({
    url: '/excel/detail/delete',
    method: 'get',
    params
  })
}

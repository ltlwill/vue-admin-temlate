import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    fileName: '@sentence(10, 20)',
    'status|1': ['0', '1'],
    userId: '@cname',
    userName: '@cname',
    uploadTime: '@datetime'
  }]
})

export default [
  {
    url: '/excel/imp/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]

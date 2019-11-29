import Mock from 'mockjs'

const data = Mock.mock({
  'items|10': [{
    id: '@id',
    fileName: '@sentence(10, 20)',
    'status|1': ['0', '1'],
    userId: '@cname',
    userName: '@cname',
    importTime: '@datetime'
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
          items: items,
          list: items
        }
      }
    }
  },
  {
    url: '/excel/imp/delete',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {}
      }
    }
  }
]

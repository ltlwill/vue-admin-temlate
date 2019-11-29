import Mock from 'mockjs'

const data = Mock.mock({
  'items|20': [{
    id: '@id',
    impId: 10001,
    fileName: '@string(10,20)',
    accountName: '@cname(10, 20)',
    accountNo: '@integer(10000)',
    bankName: '@string("upper", 5)银行',
    transactionTime: '@time',
    transactionDate: '@date("yyyy-MM-dd")',
    'income|123.2': 1,
    'expend|123.2': 1,
    'balance|199.2': 2,
    toAccountName: '@cname(10, 20)',
    toAccountNo: '@integer(10000)',
    toBankName: '@string("upper", 6)银行',
    summary: '@string(5)',
    ip: '@ip'
  }]
})

export default [
  {
    url: '/excel/detail/list',
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
    url: '/excel/detail/delete',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: { }
      }
    }
  }
]

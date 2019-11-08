import Mock from 'mockjs'

const data = Mock.mock({
  'items|10': [{
    id: '@id',
    accountName: '@cname(10, 20)',
    accountNo: '@integer(10000)',
    bankName: '@string("upper", 5)银行',
    transactionTime: '@time',
    transactionDate: '@date("yyyy-MM-dd")',
    'income|123.2': 1,
    'expend|123.2': 1
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
          items: items
        }
      }
    }
  }
]

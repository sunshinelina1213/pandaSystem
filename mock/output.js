import Mock from 'mockjs'

export default {
  getOutPutTemplates: () => {
    const items = Mock.mock({
      retCode: '0',
      'rows|20': [{
        id: '@id',
        desc: '@sentence(1, 2)',
        'status|1': ['published', 'draft', 'deleted'],
        infile: '@sentence(1, 2)',
        name: '@name',
        sourceType: '@integer(1, 5)'
      }],
      totalCount: 31
    })
    return items
  },
  showQuery: () => {
    const items = Mock.mock({
      retCode: '0',
      retData: '@paragraph(1, 3)',
      retMsg: ''
    })
    return items
  },
  refreshResponseTemplates: () => {
    const items = Mock.mock({
      retCode: '0',
      retData: {},
      retMsg: ''
    })
    return items
  },
  parsedResponseTemplate: () => {
    const items = Mock.mock({
      retCode: '0',
      retData: {
        params: '@sentence(10, 20)',
        parsedResponse: '@sentence(10, 20)'
      },
      retMsg: ''
    })
    return items
  },
  getParamsOfResponseTemplate: () => {
    const items = Mock.mock({
      retCode: '0',
      retData: [{
        name: '@name',
        fieldLabel: '@string',
        value: '@string',
        xtype: 'textfield'
      }],
      retMsg: ''
    })
    return items
  }
}

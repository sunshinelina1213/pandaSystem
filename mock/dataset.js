import Mock from 'mockjs'

export default {
  getDtSrcTemplates: () => {
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
  refreshDtSrcTemplates: () => {
    const items = Mock.mock({
      retCode: '0',
      retData: {},
      retMsg: ''
    })
    return items
  },
  showMapping: () => {
    const items = Mock.mock({
      retCode: '0',
      retData: '@sentence(10, 20)',
      retMsg: ''
    })
    return items
  },
  executeDataScripts: () => {
    const items = Mock.mock({
      retCode: '0',
      retData: {
        tid: '@sentence(10, 20)'
      },
      retMsg: ''
    })
    return items
  },
  getDataScriptsLog: () => {
    const items = Mock.mock({
      retCode: '0',
      retData: {
        flag: 1,
        logs: ['@sentence(10, 20)', '@sentence(10, 20)'],
        total: 5
      },
      retMsg: ''
    })
    return items
  },
  deleteIndexes: () => {
    const items = Mock.mock({
      retCode: '0',
      retData: {},
      retMsg: ''
    })
    return items
  },
  deleteAllDtSrcs: () => {
    const items = Mock.mock({
      retCode: '0',
      retData: {},
      retMsg: ''
    })
    return items
  }
}

import Mock from 'mockjs'

export default {
  getUsers: () => {
    const items = Mock.mock({
      retCode: '0',
      'rows|20': [{
        CZFP: '@sentence(1, 2)',
        POSTNAME: '@sentence(1, 2)',
        USERNAME: '@name'
      }],
      totalCount: 31
    })
    return items
  }
}
